import React from "react";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "../api";
import { toast } from "react-toastify";
import { useAdmin } from "../admin/context/AdminContext";

// 🧩 Zod validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const LoginPage = () => {
  const { refreshAdminAuth } = useAdmin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const body = {
        email: data.email,
        password: data.password,
      };

      const response = await loginUser(body);
      toast.success(`✅ Login successful ${response.user.name}`);

      // Redirect based on user role
      if (response.user.is_admin) {
        // Refresh admin context for admin panel
        await refreshAdminAuth();
        document.location.href = "/admin/dashboard";
      } else {
        document.location.href = "/";
      }

      reset();
    } catch (error) {
      console.error(error);
      toast.error("❌ Login failed");
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
            Your Gateway to Intelligent Interaction
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="Password"
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

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn btn-primary"
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>

          <div className="text-center text-sm text-neutral/60">
            Don&apos;t have an account yet?{" "}
            <NavLink to="/register" className="font-semibold text-primary">
              Sign up now
            </NavLink>
          </div>
        </form>

        <p className="text-xs text-neutral/60 mt-6">
          By clicking "Log In", you agree to Aurora &amp; CO&apos;s{" "}
          <u>User Agreement</u> and <u>Privacy Policy</u>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
