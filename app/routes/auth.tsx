import React, { useEffect } from "react";
import { usePuterStore } from "../../lib/Puter";
import { Link, useLocation, useNavigate } from "react-router";

export const meta = () => [
  { title: "Resume ATS | Auth" },
  { name: "description", content: "Log into your account" },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = new URLSearchParams(location.search).get("next");
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated && next) navigate(next);
  }, [auth.isAuthenticated, navigate, next]);

  return (
    <main className="relative bg-[url('/images/bg-auth.svg')] bg-cover pt-0!">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div className="pointer-events-auto gradient-border shadow-lg">
          <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1>Welcome</h1>
              <h2>Log In to Continue Your Job Journey</h2>
            </div>
            <div>
              {isLoading ? (
                <button className="auth-button animate-pulse">
                  <p>Signing you in...</p>
                </button>
              ) : (
                <>
                  {auth.isAuthenticated ? (
                    <button className="auth-button" onClick={auth.signOut}>
                      <p>Log Out</p>
                    </button>
                  ) : (
                    <button className="auth-button" onClick={auth.signIn}>
                      <p>Log In</p>
                    </button>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Auth;
