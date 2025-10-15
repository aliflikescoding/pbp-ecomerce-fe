import React from "react";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "../api";
import { toast } from "react-toastify";

// 🧩 Zod schema for validation
const registerSchema = z
  .object({
    name: z.string().min(3, "Full name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[#?!@$%^&*-]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    const body = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    try {
      const response = await registerUser(body);
      const successMessage =
        response?.message ??
        (response?.user?.name ? `Registered successfully, ${response.user.name}` : "Registration successful");

      toast.success(`✅ ${successMessage}`);
      reset();
      document.location.href = "/login";
    } catch (error) {
      console.error("❌ Registration failed:", error);
      const apiMessage = error?.response?.data?.message;
      toast.error(apiMessage ? `❌ ${apiMessage}` : "❌ Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-10">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo-vertical.svg" alt="Aurora & CO" className="h-14" />
          <h1 className="text-3xl font-semibold text-primary">
            Aurora &amp; CO
          </h1>
          <p className="text-sm text-neutral/70">
            Create your account to unlock personalized recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Full name"
              {...register("name")}
              className={`input input-bordered w-full ${
                errors.name ? "input-error" : "input-primary"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="Email address"
              {...register("email")}
              className={`input input-bordered w-full ${
                errors.email ? "input-error" : "input-primary"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="Create password"
                {...register("password")}
                className={`input input-bordered w-full ${
                  errors.password ? "input-error" : "input-primary"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Repeat password"
                {...register("confirmPassword")}
                className={`input input-bordered w-full ${
                  errors.confirmPassword ? "input-error" : "input-primary"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn btn-primary"
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>

          <div className="text-center text-sm text-neutral/60">
            Already have an account?{" "}
            <NavLink to="/login" className="font-semibold text-primary">
              Log In
            </NavLink>
          </div>
        </form>

        <p className="text-xs text-neutral/60 mt-6">
          By creating an account, you agree to Aurora &amp; CO&apos;s{" "}
          <u>User Agreement</u> and <u>Privacy Policy</u>.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
