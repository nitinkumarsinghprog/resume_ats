import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { usePuterStore } from "../../lib/Puter";
import ConfirmModal from "../components/ConfirmModal";

const WipeApp = () => {
  const { auth, isLoading, error, fs, kv } = usePuterStore();
  const navigate = useNavigate();

  const [allFiles, setAllFiles] = useState<FSItem[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const loadFiles = async () => {
    try {
      const existingFiles = (await fs.readDir("./")) as FSItem[];
      setAllFiles(existingFiles);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth=/wipe");
    }
  }, [isLoading, auth.isAuthenticated, navigate]);

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await Promise.all(allFiles.map((file) => fs.delete(file.path)));

      await kv.flush();

      await loadFiles();

      setShowConfirmModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-lg font-semibold animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-red-300 bg-red-100 p-6 text-center text-red-700 shadow">
          <h2 className="mb-2 text-xl font-bold">Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const resumeFiles = allFiles.filter((file) =>
    file.name.toLowerCase().endsWith(".pdf"),
  );

  return (
    <>
      <div className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover pb-20">
        <nav className="resume-nav">
          <Link to="/" className="back-button">
            <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
            <span className="text-gray-800 text-sm font-semibold">
              Back to Homepage
            </span>
          </Link>
        </nav>
        <div className="w-full max-w-6xl mx-auto overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-400 to-indigo-400 px-8 py-10 text-center text-white">
            <h1 className="text-3xl font-bold sm:text-5xl">🗑️ Wipe App Data</h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm text-blue-100 sm:text-lg">
              Delete all stored files and clear your application's local
              storage. This action is permanent and cannot be undone.
            </p>
          </div>

          {/* User Information */}
          <div className="flex flex-col gap-4 border-b px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Authenticated User</p>

              <p className="break-all text-xl font-semibold text-gray-800">
                {auth.user?.username}
              </p>
            </div>

            <span className="self-start rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-green-700 sm:self-auto">
              {resumeFiles.length} Resume{resumeFiles.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Resume List */}
          <div className="p-8">
            <h2 className="mb-6 text-3xl font-bold text-gray-800">
              Existing Resumes
            </h2>

            {resumeFiles.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
                <div className="text-6xl">📂</div>

                <h3 className="mt-4 text-xl font-semibold">No Resumes Found</h3>

                <p className="mt-2 text-gray-500">
                  You have not uploaded any resumes yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {resumeFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-col gap-4 rounded-xl border border-gray-200 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1">
                      <p className="break-all text-lg font-semibold text-gray-800">
                        📄 {file.name}
                      </p>

                      <p className="mt-2 break-all text-sm text-gray-500">
                        {file.path}
                      </p>
                    </div>

                    <span className="self-start rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 sm:self-auto">
                      PDF
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-100 px-8 py-6">
            <div className="flex justify-center sm:justify-end">
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={allFiles.length === 0 || deleting}
                className="w-full rounded-xl bg-white-400 px-8 py-3 font-semibold text-gray-800 border border-gray-50 shadow-[0_10px_30px_rgba(0,0,0,0.18)] hover:shadow-[0_18px_45px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 sm:w-auto"
              >
                🗑️ Wipe App Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reusable Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Delete App Data?"
        message="Are you sure you want to delete all stored files and application data? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default WipeApp;
