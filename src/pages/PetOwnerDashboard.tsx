import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, LogOut, User } from "lucide-react";

const PetOwnerDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
    };
    getUser();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !selectedImage) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      // Upload image to storage
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('pet-images')
        .upload(fileName, selectedImage);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('pet-images')
        .getPublicUrl(fileName);

      // Create pet profile if needed
      const petName = formData.get('petName') as string;
      const breed = formData.get('breed') as string;
      const age = formData.get('age') as string;
      const medicalHistory = formData.get('medicalHistory') as string;

      const { data: petData, error: petError } = await supabase
        .from('pet_profiles')
        .insert({
          owner_id: user.id,
          name: petName,
          breed,
          age: parseInt(age),
          medical_history: medicalHistory
        })
        .select()
        .single();

      if (petError) throw petError;

      // Create diagnosis entry
      const problemDescription = formData.get('problemDescription') as string;
      const { data: diagnosisData, error: diagnosisError } = await supabase
        .from('diagnoses')
        .insert({
          pet_id: petData.id,
          owner_id: user.id,
          problem_description: problemDescription,
          image_url: publicUrl,
          status: 'analyzing'
        })
        .select()
        .single();

      if (diagnosisError) throw diagnosisError;

      // Call AI analysis edge function
      const { data: aiResult, error: aiError } = await supabase.functions.invoke('analyze-skin-condition', {
        body: {
          diagnosisId: diagnosisData.id,
          imageUrl: publicUrl,
          problemDescription
        }
      });

      if (aiError) throw aiError;

      setDiagnosis(aiResult);
      toast({
        title: "Analysis Complete!",
        description: "AI diagnosis has been generated for your pet.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="text-2xl font-bold text-primary">PawLens</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4" />
              <span className="text-muted-foreground">{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">Pet Health Analysis</h1>
          <p className="text-muted-foreground mb-8">
            Upload an image of your dog's skin condition and provide details for AI-powered diagnosis
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="petName">Pet's Name</Label>
                  <Input
                    id="petName"
                    name="petName"
                    placeholder="Max"
                    required
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    name="breed"
                    placeholder="Golden Retriever"
                    required
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="age">Age (years)</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="3"
                    required
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
                  <Textarea
                    id="medicalHistory"
                    name="medicalHistory"
                    placeholder="Previous conditions, allergies, medications..."
                    className="mt-1.5"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="problemDescription">Problem Description</Label>
                  <Textarea
                    id="problemDescription"
                    name="problemDescription"
                    placeholder="Describe the skin issue you're seeing..."
                    required
                    className="mt-1.5"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Upload Image</Label>
                  <div className="mt-1.5">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      required
                      className="cursor-pointer"
                    />
                    {imagePreview && (
                      <div className="mt-4 rounded-lg overflow-hidden border border-border">
                        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  <Upload className="w-4 h-4 mr-2" />
                  {loading ? "Analyzing..." : "Analyze Skin Condition"}
                </Button>
              </form>
            </Card>

            {/* Results Section */}
            <div className="space-y-6">
              {diagnosis ? (
                <>
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">AI Diagnosis</h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground">Condition</Label>
                        <p className="text-lg font-semibold text-foreground">{diagnosis.disease_name}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Severity</Label>
                        <p className={`text-lg font-semibold ${
                          diagnosis.severity === 'severe' ? 'text-destructive' :
                          diagnosis.severity === 'moderate' ? 'text-orange-600' :
                          'text-green-600'
                        }`}>
                          {diagnosis.severity?.toUpperCase()}
                        </p>
                      </div>
                      {diagnosis.should_consult_doctor && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                          <p className="font-semibold text-destructive mb-2">⚠️ Veterinary Consultation Recommended</p>
                          <p className="text-sm text-foreground">{diagnosis.consultation_reason}</p>
                        </div>
                      )}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">Treatment Recommendations</h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground">Cure Suggestions</Label>
                        <p className="text-sm text-foreground mt-1">{diagnosis.cure_suggestions}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Home Remedies</Label>
                        <p className="text-sm text-foreground mt-1">{diagnosis.home_remedies}</p>
                      </div>
                    </div>
                  </Card>
                </>
              ) : (
                <Card className="p-6 text-center">
                  <div className="py-12">
                    <Upload className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Analysis Yet
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Fill out the form and upload an image to get started
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PetOwnerDashboard;
