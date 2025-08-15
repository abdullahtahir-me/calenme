"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; // A great spinner icon

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // State for the email/password form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // State for the Google button (it's separate so they don't interfere)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const router = useRouter();

  // Handler for the standard email/password signup form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission (page reload)
    setIsFormLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setSuccessMessage(data.message);
      // Don't redirect immediately, let the user see the "check your email" message.
      // You could redirect after a few seconds or let them click a link.
      // For now, we'll just clear the form.
      setEmail("");
      setPassword("");

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsFormLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0">
          {/* --- FORM 1: EMAIL/PASSWORD SIGNUP --- */}
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome</h1>
                <p className="text-muted-foreground text-balance">
                  Sign up for your Calenme account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isFormLoading || isGoogleLoading}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="UPPERCASE, lowecase and numbers required"
                  disabled={isFormLoading || isGoogleLoading}
                  required
                />
              </div>

              {/* Display feedback messages */}
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              {successMessage && <p className="text-sm text-green-500 text-center">{successMessage}</p>}

              <Button type="submit" className="w-full" disabled={isFormLoading || isGoogleLoading}>
                {isFormLoading ? <Loader2 className="animate-spin" /> : "Sign Up"}
              </Button>
              
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              
              {/* --- GOOGLE & GITHUB BUTTONS --- */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {/* Use a Link styled as a button for the server-side OAuth flow */}
                <Link href="/api/auth/login/googleSignin" passHref onClick={() => setIsGoogleLoading(true)}>
                  
                    <Button variant="destructive" type="button" className="w-full" disabled={isFormLoading || isGoogleLoading}>
                      {isGoogleLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                      Google
                    </Button>
                  
                </Link>
                
                {/* You can add a similar Link for GitHub 
                <Button variant="outline" type="button" className="w-full" disabled={true}>
                  {/* Your GitHub SVG Icon 
                  GitHub
                </Button>*/}
              </div>
              
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}