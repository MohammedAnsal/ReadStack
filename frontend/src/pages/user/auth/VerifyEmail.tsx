import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { publicAxiosInstance } from "../../../services/axios";
import { authService } from "../../../services/api/auth.api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!email || !token) {
      setVerificationStatus("error");
      setMessage("Invalid verification link. Please check your email.");
      return;
    }
    setVerificationStatus("idle");
    setMessage("Click the button below to verify your email address");
  }, [email, token]);

  const verifyEmail = async () => {
    try {
      setVerificationStatus("verifying");
      setMessage("Verifying your email...");

      const res = await authService.verifyEmail(
        email as string,
        token as string
      );

      if (res && res.status) {
        setVerificationStatus("success");
        setMessage(res.message || "Email verified successfully!");
        toast.success("Email verified successfully!");
        setTimeout(() => {
          navigate("/auth/login");
        }, 3000);
      } else {
        setVerificationStatus("error");
        setMessage(res.message || "Verification failed. Please try again.");
        toast.error(res.message || "Verification failed");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Verification failed. Please try again."
      );
      console.error("Verification error:", error);
      setVerificationStatus("error");
      setMessage("Verification failed. Please try again.");
    }
  };

  const handleGoToLogin = () => {
    navigate("/auth/login");
  };

  const handleResendEmail = async () => {
    try {
      setVerificationStatus("verifying");
      setMessage("Sending verification email...");
      const res = await publicAxiosInstance.post("/auth/resend-verification", {
        email,
      });

      if (res && res.status) {
        setVerificationStatus("idle");
        setMessage(
          "Verification email sent successfully! Please check your inbox."
        );
        toast.success("Verification email sent successfully!");
      } else {
        setVerificationStatus("error");
        setMessage(
          res.data?.message ||
            "Failed to send verification email. Please try again."
        );
        toast.error(res.data?.message || "Failed to send verification email");
      }
    } catch (error: any) {
      console.error("Resend email error:", error);
      setVerificationStatus("error");
      setMessage("Failed to send verification email. Please try again.");
      toast.error(
        error.response?.data?.message || "Failed to send verification email"
      );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <div className="h-screen w-full bg-white flex items-center justify-center px-4 py-4 overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-10"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200"
        // initial={{ opacity: 0, scale: 0.97, y: 20 }}
        // animate={{ opacity: 1, scale: 1, y: 0 }}
        // transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants as any} className="text-center mb-6">
          <motion.div
            initial={{ rotate: -20, scale: 0.7 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, delay: 0.3 }}
            className="mb-4 flex justify-center"
          >
            {verificationStatus === "idle" && (
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
            {verificationStatus === "verifying" && (
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-600 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
            {verificationStatus === "success" && (
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
            {verificationStatus === "error" && (
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </motion.div>

          <h1 className="text-3xl font-bold text-black mb-2">
            {verificationStatus === "idle" && "Verify Your Email"}
            {verificationStatus === "verifying" && "Verifying Email..."}
            {verificationStatus === "success" && "Email Verified!"}
            {verificationStatus === "error" && "Verification Failed"}
          </h1>
          <p className="text-sm text-gray-600">
            {verificationStatus === "idle" &&
              "Click the button below to verify your email address"}
            {verificationStatus === "verifying" &&
              "Please wait while we verify your email address"}
            {verificationStatus === "success" &&
              "Your email has been successfully verified"}
            {verificationStatus === "error" &&
              "There was an issue verifying your email"}
          </p>
        </motion.div>

        {/* Status Message */}
        <motion.div variants={itemVariants as any} className="mb-6">
          <div
            className={`p-4 rounded-lg text-center text-sm ${
              verificationStatus === "idle"
                ? "bg-gray-50 text-gray-700 border border-gray-200"
                : verificationStatus === "verifying"
                ? "bg-gray-50 text-gray-700 border border-gray-200"
                : verificationStatus === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <p className="font-medium">{message}</p>
          </div>
        </motion.div>

        {verificationStatus === "verifying" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mb-6"
          >
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        )}

        <motion.div variants={itemVariants as any} className="space-y-3">
          {verificationStatus === "idle" && (
            <motion.button
              onClick={verifyEmail}
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out hover:bg-gray-800 hover:shadow-md active:scale-[0.98]"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              Verify Email
            </motion.button>
          )}

          {verificationStatus === "success" && (
            <motion.button
              onClick={handleGoToLogin}
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out hover:bg-gray-800 hover:shadow-md active:scale-[0.98]"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              Go to Login
            </motion.button>
          )}

          {verificationStatus === "error" && (
            <>
              <motion.button
                onClick={handleGoToLogin}
                className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out hover:bg-gray-800 hover:shadow-md active:scale-[0.98]"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                Go to Login
              </motion.button>
              <motion.button
                onClick={handleResendEmail}
                className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out hover:bg-gray-50 active:scale-[0.98]"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                Resend Verification Email
              </motion.button>
            </>
          )}
        </motion.div>

        {email && (
          <motion.div
            variants={itemVariants as any}
            className="mt-6 text-center"
          >
            <p className="text-xs text-gray-500">
              Email: <span className="font-mono text-gray-700">{email}</span>
            </p>
          </motion.div>
        )}

        <motion.div variants={itemVariants as any} className="mt-6 text-center">
          <Link
            to={"/auth/login"}
            className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors duration-300 ease-in-out hover:underline"
          >
            Back to Sign in
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
