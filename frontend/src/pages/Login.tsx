import React, { useState } from "react";
import logo from "../assets/dis-connect.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // temporary function to handle submitting, need to implement authentication later
  const submit = (e: React.SubmitEvent) => {
    e.preventDefault();
    console.log("Logged in: ", { email, password });
  };

  return (
    <div className="h-dvh w-dvw bg-zinc-950 flex flex-col items-center justify-center text-zinc-200">
      {/* dis-connect logo */}
      <div>
        <img
          src={logo}
          alt="dis-connect logo"
          className="w-20 h-20 object-contain"
        />
      </div>
      {/* Sign in to dis-connect header */}
      <div className="text-3xl text-center font-semibold tracking-tight mb-4">
        Sign in to <span className="text-[#c7ed41]">dis-connect</span>
      </div>

      {/* Login box */}
      <div className="w-full max-w-[352px]">
        <form onSubmit={submit}>
          {/* Email input field */}
          <div>
            <p className="my-1">Email address</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-zinc-700 focus:border-[#c7ed41] focus:outline-none transition-all w-full rounded-md p-1.5 mb-2"
              required
            />
          </div>

          {/* Password input field */}
          <div>
            <div className="flex flex-row justify-between items-center">
              <p className="my-1">Password</p>
              <a href="placeholder" className="text-[#c7ed41] hover:underline">
                Forgot password?
              </a>
            </div>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-zinc-700 focus:border-[#c7ed41] focus:outline-none transition-all w-full rounded-md p-1.5 mb-5"
              required
            />
          </div>

          {/* sign in button */}
          <button type="submit" className="w-full text-center text-white bg-[#c7ed41]/50 hover:bg-[#c7ed41]/60 p-1.5 rounded-md transition-all border border-[#c7ed41]/20 cursor-pointer">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
