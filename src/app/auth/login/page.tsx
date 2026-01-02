"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/firebase";
import { Loader2 } from "lucide-react";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function AuthPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { auth, user, isUserLoading } = useFirebase();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const googleProvider = new GoogleAuthProvider();

  const handleAuthError = (error: any) => {
    let title = "Authentication Failed";
    let description = error.message || "An unexpected error occurred. Please try again.";

    switch (error.code) {
        case 'auth/popup-closed-by-user':
        case 'auth/cancelled-popup-request':
            title = "Sign-In Cancelled";
            description = "The sign-in process was cancelled.";
            break;
        case 'auth/operation-not-allowed':
             title = "Sign-In Method Disabled";
             description = "This sign-in method is not enabled. Please contact support.";
             break;
        case 'auth/permission-denied':
            title = "Permission Denied";
            description = "There was a security rule issue. Please contact support.";
            break;
        case 'auth/invalid-credential':
             title = "Invalid Authentication";
             description = "The authentication credential provided is invalid. Please try again.";
             break;
        case 'auth/email-already-in-use':
            title = "Email Already in Use";
            description = "This email is already registered. Please sign in instead.";
            break;
        case 'auth/weak-password':
            title = "Weak Password";
            description = "The password is too weak. Please choose a stronger password.";
            break;
        case 'auth/invalid-email':
            title = "Invalid Email";
            description = "The email address is not valid.";
            break;
    }
    toast({ variant: "destructive", title, description });
    setIsSubmitting(false);
  };
  
  useEffect(() => {
    if (!auth || isSubmitting) return;
    
    setIsSubmitting(true);
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          toast({ title: "Signed in successfully!", description: "Welcome to Yearly Tracker!" });
          router.push('/');
        }
      })
      .catch(handleAuthError)
      .finally(() => setIsSubmitting(false));
  }, [auth, router, isSubmitting, toast]);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsSubmitting(true);
    await signInWithRedirect(auth, googleProvider);
  }

  const handleEmailSignIn = async (values: z.infer<typeof formSchema>) => {
    if (!auth) return;
    setIsSubmitting(true);
    signInWithEmailAndPassword(auth, values.email, values.password)
        .then(userCredential => {
            toast({ title: "Signed in successfully!" });
            router.push('/');
        })
        .catch(handleAuthError)
        .finally(() => setIsSubmitting(false));
  };

  const handleEmailSignUp = async (values: z.infer<typeof formSchema>) => {
    if (!auth) return;
    setIsSubmitting(true);
    createUserWithEmailAndPassword(auth, values.email, values.password)
        .then(userCredential => {
            toast({ title: "Account created successfully!" });
            router.push('/');
        })
        .catch(handleAuthError)
        .finally(() => setIsSubmitting(false));
  };

  if (isUserLoading || user) {
    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-[#0a0a0a]">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 overflow-hidden bg-[#0a0a0a] relative">
      <div className="absolute inset-0 particles-bg" />
      <Card className="w-full max-w-lg h-fit bg-black/60 backdrop-blur-xl border-primary/30 shadow-2xl shadow-primary/20 text-white z-10 animate-glow">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-headline bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-blue-500 to-rose-400 pb-2 animate-text-glow">
            Sign In to Expense Tracker
          </CardTitle>
          <CardDescription className="text-gray-300 text-base">
            Unlock AI-powered insights for your financial wellness.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
            <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                    <form onSubmit={form.handleSubmit(handleEmailSignIn)} className="space-y-4 mt-4">
                         <div className="space-y-2">
                            <Label htmlFor="email-signin">Email</Label>
                            <Input id="email-signin" type="email" placeholder="m@example.com" {...form.register("email")} />
                            {form.formState.errors.email && <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password-signin">Password</Label>
                            <Input id="password-signin" type="password" {...form.register("password")} />
                            {form.formState.errors.password && <p className="text-xs text-red-400">{form.formState.errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Sign In
                        </Button>
                    </form>
                </TabsContent>
                 <TabsContent value="signup">
                    <form onSubmit={form.handleSubmit(handleEmailSignUp)} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="email-signup">Email</Label>
                            <Input id="email-signup" type="email" placeholder="m@example.com" {...form.register("email")} />
                             {form.formState.errors.email && <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password-signup">Password</Label>
                            <Input id="password-signup" type="password" {...form.register("password")} />
                             {form.formState.errors.password && <p className="text-xs text-red-400">{form.formState.errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                             {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                             Sign Up
                        </Button>
                    </form>
                </TabsContent>
            </Tabs>
            
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black/60 px-2 text-gray-300">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Button variant="outline" className="w-full h-14 text-lg bg-black/20 text-white hover:bg-white hover:text-black border-gray-600 hover:border-white transition-all duration-300 group" onClick={handleGoogleSignIn} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <GoogleIcon className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />}
                    Login with Google
                </Button>
            </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm">
             <Button variant="link" asChild className="text-gray-400 hover:text-white">
                <Link href="/">Back to Calendar</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
