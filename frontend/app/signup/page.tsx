"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff, ArrowRight, Check, X } from "lucide-react";
import Image from "next/image";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "800", "900"],
});

// Banner images array
const bannerImages = [
  "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/AZY00907.JPG",
  "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/Photo+Oct+04+2025%2C+12+43+00+PM+(8).jpg",
  "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/AZY00461.JPG",
  "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/Photo+Oct+04+2025%2C+12+42+31+PM+(1).jpg",
  "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/Photo+Aug+25+2025%2C+7+04+46+AM.jpg"
];

// Function to get random banner image
const getRandomBannerImage = () => {
  return bannerImages[Math.floor(Math.random() * bannerImages.length)];
};

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signup, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const passwordRequirements = [
    { test: password.length >= 8, text: "Minimum 8 characters" },
    { test: /\d/.test(password), text: "Must contain at least 1 number" },
    { test: /[a-z]/.test(password) && /[A-Z]/.test(password), text: "Must contain at least 1 capital case and 1 small case" },
    { test: /[!@#$%^&*(),.?":{}|<>]/.test(password), text: "Must contain at least 1 symbol" },
  ];

  const validateForm = (): string | null => {
    if (name.length < 2) {
      return "Name must be at least 2 characters long";
    }
    if (!email.includes("@") || !email.includes(".")) {
      return "Please enter a valid email address";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(name, email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex selection:bg-black selection:text-white ${inter.className}`}>

      {/* Left Column - Banner Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={getRandomBannerImage()}
            alt="Fashion banner"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Text Layout - Same as Login */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white w-full">
          {/* Top Header - Discreet */}
          <div className="flex justify-between items-center tracking-[0.1em] text-xs font-bold drop-shadow-lg">
            <div className="border-b-2 border-white pb-1 relative">
              Butterfly couture
            </div>
            <div className="opacity-50 hidden xl:block">
              A/W 2024
            </div>
          </div>

          {/* Bottom Content - Massive Headline */}
          <div className="flex flex-col justify-end mb-8">
            {/* Using vw units for responsive massive text */}
            <h1 className="text-[7vw] font-birds leading-[0.85] tracking-[0.1em] text-white drop-shadow-xl">
              Define <br />
              your <br />
              essence.
            </h1>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px w-16 bg-white"></div>
              <p className="text-zinc-300 text-lg font-light tracking-wide uppercase">
                Sophistication in monochrome.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-12">
            <div className="text-2xl font-bold text-amber-800 mb-2">
              BUTTERFLY
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-2">
                SIGN UP
              </h2>
              <p className="text-gray-600">
                Fill in your information to create a new account
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-xs font-bold text-black tracking-widest uppercase"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  disabled={isSubmitting}
                  className="h-12 rounded-none border-zinc-200 bg-transparent px-0 border-b border-t-0 border-x-0 focus:border-black focus:ring-0 placeholder:text-zinc-300 transition-all duration-300 pl-1"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-bold text-black tracking-widest uppercase"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  disabled={isSubmitting}
                  className="h-12 rounded-none border-zinc-200 bg-transparent px-0 pr-12 border-b border-t-0 border-x-0 focus:border-black focus:ring-0 transition-all duration-300 pl-1"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="text-xs font-bold text-black tracking-widest uppercase"
                  >
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-zinc-400 hover:text-black hover:underline transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="h-12 rounded-none border-zinc-200 bg-transparent px-0 pr-12 border-b border-t-0 border-x-0 focus:border-black focus:ring-0 transition-all duration-300 pl-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-zinc-400 hover:text-black rounded-none"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Password Requirements */}
              {password && (
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center text-xs">
                      {req.test ? (
                        <Check className="h-3 w-3 text-green-500 mr-2" />
                      ) : (
                        <X className="h-3 w-3 text-red-500 mr-2" />
                      )}
                      <span className={req.test ? "text-green-600" : "text-red-600"}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-xs font-bold text-black tracking-widest uppercase"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    disabled={isSubmitting}
                    className="h-12 rounded-none border-zinc-200 bg-transparent px-0 pr-12 border-b border-t-0 border-x-0 focus:border-black focus:ring-0 transition-all duration-300 pl-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-zinc-400 hover:text-black rounded-none"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-black hover:bg-zinc-800 text-white rounded-none tracking-[0.15em] font-medium text-xs uppercase transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Account <ArrowRight className="h-3 w-3" />
                  </span>
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-zinc-100">
              <p className="text-zinc-500 text-sm">
                Already have account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-black hover:underline underline-offset-4 tracking-wide"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
