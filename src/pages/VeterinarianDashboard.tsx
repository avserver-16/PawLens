import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, MapPin, Calendar } from "lucide-react";

interface Diagnosis {
  id: string;
  problem_description: string;
  image_url: string;
  disease_name: string;
  severity: string;
  should_consult_doctor: boolean;
  consultation_reason: string;
  cure_suggestions: string;
  home_remedies: string;
  status: string;
  created_at: string;
  owner_id: string;
  pet_profiles: {
    name: string;
    breed: string;
    age: number;
  };
}

const VeterinarianDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [ownerProfiles, setOwnerProfiles] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
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
      fetchDiagnoses();
    };
    getUser();
  }, [navigate]);

  const fetchDiagnoses = async () => {
    try {
      const { data, error } = await supabase
        .from('diagnoses')
        .select(`
          *,
          pet_profiles (
            name,
            breed,
            age
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiagnoses(data || []);

      // Fetch owner profiles separately
      if (data) {
        const ownerIds = [...new Set(data.map(d => d.owner_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, full_name, location')
          .in('user_id', ownerIds);
        
        if (profilesData) {
          const profilesMap = profilesData.reduce((acc: any, profile) => {
            acc[profile.user_id] = profile;
            return acc;
          }, {});
          setOwnerProfiles(profilesMap);
        }
      }
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'severe':
        return 'bg-destructive text-destructive-foreground';
      case 'moderate':
        return 'bg-orange-600 text-white';
      case 'mild':
        return 'bg-green-600 text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
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
            <Badge variant="secondary" className="ml-2">Veterinarian</Badge>
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Case Dashboard</h1>
            <p className="text-muted-foreground">
              Review and manage dermatology cases from pet owners
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading cases...</p>
            </div>
          ) : diagnoses.length === 0 ? (
            <Card className="p-12 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">No Cases Yet</h3>
              <p className="text-muted-foreground">
                New cases will appear here when pet owners submit diagnoses
              </p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {diagnoses.map((diagnosis) => (
                <Card key={diagnosis.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="grid md:grid-cols-[200px_1fr] gap-6">
                    {/* Image */}
                    <div className="rounded-lg overflow-hidden border border-border">
                      <img
                        src={diagnosis.image_url}
                        alt="Skin condition"
                        className="w-full h-48 object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">
                            {diagnosis.pet_profiles.name} - {diagnosis.disease_name || 'Under Analysis'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {diagnosis.pet_profiles.breed}, {diagnosis.pet_profiles.age} years old
                          </p>
                        </div>
                        <Badge className={getSeverityColor(diagnosis.severity)}>
                          {diagnosis.severity?.toUpperCase() || 'PENDING'}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>Owner: {ownerProfiles[diagnosis.owner_id]?.full_name || 'Unknown'}</span>
                        </div>
                        {ownerProfiles[diagnosis.owner_id]?.location && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{ownerProfiles[diagnosis.owner_id].location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(diagnosis.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">Problem Description:</p>
                        <p className="text-sm text-muted-foreground">{diagnosis.problem_description}</p>
                      </div>

                      {diagnosis.should_consult_doctor && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                          <p className="text-sm font-semibold text-destructive mb-1">
                            ⚠️ Consultation Recommended
                          </p>
                          <p className="text-sm text-foreground">{diagnosis.consultation_reason}</p>
                        </div>
                      )}

                      {diagnosis.cure_suggestions && (
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-semibold text-foreground">AI Cure Suggestions:</p>
                            <p className="text-sm text-muted-foreground">{diagnosis.cure_suggestions}</p>
                          </div>
                          {diagnosis.home_remedies && (
                            <div>
                              <p className="text-sm font-semibold text-foreground">Home Remedies:</p>
                              <p className="text-sm text-muted-foreground">{diagnosis.home_remedies}</p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button size="sm">Contact Owner</Button>
                        <Button variant="outline" size="sm">View Full Case</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VeterinarianDashboard;
