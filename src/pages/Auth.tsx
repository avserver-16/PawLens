import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { User, Stethoscope } from "lucide-react";

const Auth = () => {
  const [role, setRole] = useState<"owner" | "vet">("owner");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-3xl">🐾</span>
            </div>
            <span className="text-3xl font-bold text-primary">PawLens</span>
          </Link>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Welcome to Better Pet Care
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of pet owners and veterinarians using AI-powered 
            diagnostics to provide the best care for dogs.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-lg">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Instant AI Diagnosis</h4>
                <p className="text-sm text-muted-foreground">Get accurate results in seconds</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-lg">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Connect with Specialists</h4>
                <p className="text-sm text-muted-foreground">Access certified veterinary dermatologists</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-lg">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Track Health History</h4>
                <p className="text-sm text-muted-foreground">Maintain complete medical records</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <Card className="p-8">
          <div className="lg:hidden mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <span className="text-2xl font-bold text-primary">PawLens</span>
            </Link>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="signin-email">Email</Label>
                  <Input 
                    id="signin-email" 
                    type="email" 
                    placeholder="you@example.com"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="signin-password">Password</Label>
                  <Input 
                    id="signin-password" 
                    type="password"
                    className="mt-1.5"
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <a href="#" className="text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
              </div>
              <Button className="w-full" size="lg">
                Sign In
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="mb-3 block">I am a:</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setRole("owner")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        role === "owner"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <User className={`w-6 h-6 mx-auto mb-2 ${
                        role === "owner" ? "text-primary" : "text-muted-foreground"
                      }`} />
                      <div className={`font-medium ${
                        role === "owner" ? "text-primary" : "text-foreground"
                      }`}>
                        Pet Owner
                      </div>
                    </button>
                    <button
                      onClick={() => setRole("vet")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        role === "vet"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Stethoscope className={`w-6 h-6 mx-auto mb-2 ${
                        role === "vet" ? "text-primary" : "text-muted-foreground"
                      }`} />
                      <div className={`font-medium ${
                        role === "vet" ? "text-primary" : "text-foreground"
                      }`}>
                        Veterinarian
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input 
                    id="signup-name" 
                    placeholder="John Doe"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="you@example.com"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password"
                    className="mt-1.5"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </div>
              </div>
              <Button className="w-full" size="lg">
                Create Account
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2">Or continue with</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
