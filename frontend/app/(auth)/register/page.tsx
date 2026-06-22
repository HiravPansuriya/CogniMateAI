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
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineAcademicCap,
} from "react-icons/hi2";
import toast from "react-hot-toast";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { AxiosError } from "axios";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, googleLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleSuccess = async (response: CredentialResponse) => {
    try {
      if (response.credential) {
        await googleLogin(response.credential);
        toast.success("Account created with Google!");
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Google registration failed.");
    }
  };

  const onGoogleError = () => {
    toast.error("Google registration was unsuccessful.");
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
          <h1 className="text-2xl font-bold gradient-text">Create Account</h1>
          <p className="text-text-secondary text-sm mt-1">
            Start your smarter learning journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            icon={<HiOutlineUser className="w-5 h-5" />}
            error={errors.name?.message}
            {...register("name")}
          />
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
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            icon={<HiOutlineLockClosed className="w-5 h-5" />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            Create Account
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
            text="signup_with"
            width="100%"
          />
        </div>

        {/* Link to login */}
        <p className="text-center text-sm text-text-secondary mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-accent-primary hover:text-accent-primary-hover font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
