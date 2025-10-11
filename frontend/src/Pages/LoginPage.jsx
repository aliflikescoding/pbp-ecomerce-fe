import React from "react";
import { NavLink } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-10">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo-vertical.svg" alt="Aurora & CO" className="h-14" />
          <h1 className="text-3xl font-semibold text-primary">Aurora &amp; CO</h1>
          <p className="text-sm text-neutral/70">Your Gateway to Intelligent Interaction</p>
        </div>

        <form className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" placeholder="Email address" className="input input-bordered input-primary w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" placeholder="Password" className="input input-bordered input-primary w-full" />
          </div>

          <button type="submit" className="w-full btn btn-primary">Log In</button>

          <div className="text-center text-sm text-neutral/60">
            Don&apos;t have an account yet? <NavLink to="/register" className="font-semibold text-primary">Sign up now</NavLink>
          </div>
        </form>

        <p className="text-xs text-neutral/60 mt-6">
          By clicking "Log In", you agree to Aurora &amp; CO&apos;s <u>User Agreement</u> and <u>Privacy Policy</u>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
