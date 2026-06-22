"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineAcademicCap } from "react-icons/hi2";
import toast from "react-hot-toast";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { AxiosError } from "axios";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, googleLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleSuccess = async (response: CredentialResponse) => {
    try {
      if (response.credential) {
        await googleLogin(response.credential);
        toast.success("Logged in with Google!");
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Google login failed.");
    }
  };

  const onGoogleError = () => {
    toast.error("Google login was unsuccessful.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="glass-card p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mb-4">
            <HiOutlineAcademicCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">Welcome Back</h1>
          <p className="text-text-secondary text-sm mt-1">
            Sign in to continue learning
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<HiOutlineEnvelope className="w-5 h-5" />}
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<HiOutlineLockClosed className="w-5 h-5" />}
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            Sign In
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border-default" />
          <span className="text-xs text-text-tertiary">OR</span>
          <div className="flex-1 h-px bg-border-default" />
        </div>

        {/* Google */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={onGoogleError}
            theme="filled_blue"
            shape="pill"
            text="continue_with"
            width="100%"
          />
        </div>

        {/* Link to register */}
        <p className="text-center text-sm text-text-secondary mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-accent-primary hover:text-accent-primary-hover font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
