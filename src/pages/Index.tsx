import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Camera, Stethoscope, ShieldCheck, Calendar, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-dog.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-2xl">🐾</span>
            </div>
            <h1 className="text-2xl font-bold text-primary">PawLens</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-in fade-in slide-in-from-left duration-700">
              <div className="inline-block px-4 py-2 bg-accent/10 rounded-full text-sm font-medium text-accent">
                AI-Powered Veterinary Care
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Smart Skin Care for Your Best Friend
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Upload a photo of your dog's skin condition and get instant AI-powered diagnosis with 
                personalized treatment recommendations from certified veterinary dermatologists.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/auth">
                  <Button size="lg" className="group">
                    Start Diagnosis
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  For Veterinarians
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">50k+</div>
                  <div className="text-sm text-muted-foreground">Diagnoses</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">1000+</div>
                  <div className="text-sm text-muted-foreground">Vets</div>
                </div>
              </div>
            </div>
            <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-200">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
              <img
                src={heroImage}
                alt="Happy dog in veterinary clinic"
                className="relative rounded-3xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How PawLens Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, fast, and accurate diagnosis in just three steps
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Camera className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Upload Photo
              </h3>
              <p className="text-muted-foreground">
                Take a clear photo of your dog's skin condition using your phone or camera
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                <ShieldCheck className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                AI Analysis
              </h3>
              <p className="text-muted-foreground">
                Our advanced AI analyzes the image and identifies potential conditions instantly
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Stethoscope className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Get Recommendations
              </h3>
              <p className="text-muted-foreground">
                Receive personalized care recommendations and treatment options
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                <Calendar className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Book Consultation
              </h3>
              <p className="text-muted-foreground">
                Connect with certified dermatologists for video or in-person consultations
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 border-0">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEyYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMTIgMTJjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
            <div className="relative px-8 py-16 text-center">
              <h2 className="text-4xl font-bold text-primary-foreground mb-4">
                Ready to Care for Your Dog's Skin?
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Join thousands of pet owners who trust PawLens for accurate, 
                fast dermatological care for their furry friends.
              </p>
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="shadow-lg">
                  Start Free Diagnosis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🐾</span>
                <span className="text-xl font-bold text-primary">PawLens</span>
              </div>
              <p className="text-muted-foreground text-sm">
                AI-powered veterinary dermatology for healthier, happier dogs.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">For Pet Owners</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">For Veterinarians</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Join Network</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Resources</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Research</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 PawLens. All rights reserved. Made with ❤️ for dogs everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
