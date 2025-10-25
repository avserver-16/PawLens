import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  owner_name: string;
  owner_location: string;
  pet_profiles: {
    name: string;
    breed: string;
    age: number;
  };
}

// Mock data for demonstration
const mockDiagnoses: Diagnosis[] = [
  {
    id: "1",
    problem_description: "My dog has red patches on his belly that seem to be itching a lot.",
    image_url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee",
    disease_name: "Atopic Dermatitis",
    severity: "moderate",
    should_consult_doctor: true,
    consultation_reason: "The condition shows signs of inflammation that may require professional treatment and possible allergy testing.",
    cure_suggestions: "Prescribed antihistamines and topical corticosteroids. Consider hypoallergenic diet.",
    home_remedies: "Regular oatmeal baths, keep environment clean, use hypoallergenic bedding.",
    status: "pending",
    created_at: new Date().toISOString(),
    owner_name: "Sarah Johnson",
    owner_location: "San Francisco, CA",
    pet_profiles: {
      name: "Max",
      breed: "Golden Retriever",
      age: 4,
    },
  },
  {
    id: "2",
    problem_description: "Small dry patches appeared on my cat's back near the tail.",
    image_url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
    disease_name: "Flea Allergy Dermatitis",
    severity: "mild",
    should_consult_doctor: false,
    consultation_reason: "Mild case that can be managed with proper flea control.",
    cure_suggestions: "Apply topical flea treatment monthly. Monitor for improvement.",
    home_remedies: "Regular grooming, wash bedding frequently, vacuum carpets.",
    status: "reviewed",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    owner_name: "Michael Chen",
    owner_location: "Austin, TX",
    pet_profiles: {
      name: "Luna",
      breed: "Domestic Shorthair",
      age: 2,
    },
  },
];

const VeterinarianDashboard = () => {
  const [diagnoses] = useState<Diagnosis[]>(mockDiagnoses);
  const navigate = useNavigate();

  const handleSignOut = () => {
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
              <span className="text-muted-foreground">vet@example.com</span>
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

          {diagnoses.length === 0 ? (
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
                          <span>Owner: {diagnosis.owner_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{diagnosis.owner_location}</span>
                        </div>
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
