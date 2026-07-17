import { Link } from "react-router";
import { Trash2, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { usePuterStore } from "../../lib/Puter";

const Navbar = () => {
  const { auth, kv } = usePuterStore();
  const [resumeCount, setResumeCount] = useState(0);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      setResumeCount(0);
      return;
    }

    const loadResumeCount = async () => {
      const resumes = await kv.list("resume:*");
      setResumeCount(resumes?.length ?? 0);
    };

    loadResumeCount();
  }, [auth.isAuthenticated, kv]);

  return (
    <div className="flex items-center justify-center gap-4 px-4">
      {/* Navbar */}
      <nav className="navbar flex-1 max-w-6xl">
        {/* Logo */}
        <Link to="/">
          <p className="text-2xl font-bold text-gradient">RESUME ATS</p>
        </Link>

        {/* Upload Button */}
        <Link to="/upload">
          <p className="primary-button w-fit">Upload Resume</p>
        </Link>
      </nav>

      {resumeCount > 3 && (
        <Link
          to="/wipe"
          title="Wipe App Data"
          className="group flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-red-500 hover:shadow-2xl"
        >
          <Trash2
            size={24}
            className="text-gray-700 transition-colors duration-300 group-hover:text-white"
          />
        </Link>
      )}

      <Link
        to="/auth"
        title={auth.isAuthenticated ? "Account and logout" : "Log in"}
        aria-label={auth.isAuthenticated ? "Account and logout" : "Log in"}
        className="group flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-2xl"
      >
        <UserRound
          size={24}
          className="text-gray-700 transition-colors duration-300 group-hover:text-white"
        />
      </Link>
    </div>
  );
};

export default Navbar;
