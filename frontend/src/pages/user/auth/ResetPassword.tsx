import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { authService } from "../../../services/api/auth.api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const resetSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetSchemaType = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetSchemaType>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetSchemaType) => {
    if (!email || !token) {
      toast.error("Invalid or missing reset link");
      return;
    }

    try {
      const res = await authService.resetPassword(
        email,
        token,
        data.newPassword,
        data.confirmPassword
      );
      toast.success(res.message || "Password reset successfully");
      navigate("/auth/login", { replace: true });
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
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

  const invalidLink = !email || !token;

  return (
    <div className="h-screen w-full bg-white flex items-center justify-center px-4 py-4 overflow-hidden">
      <motion.div
        className="relative w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants as any} className="text-center mb-6">
          <h1 className="text-3xl font-bold text-black">Reset password</h1>
          <p className="text-xs text-gray-500 mt-1">
            {invalidLink
              ? "This reset link is invalid or missing information."
              : "Choose a new password for your account."}
          </p>
        </motion.div>

        {invalidLink ? (
          <motion.div
            variants={itemVariants as any}
            className="text-center space-y-4"
          >
            <p className="text-sm text-red-500">
              Please request a new reset link.
            </p>
            <Link
              to="/auth/forgot-password"
              className="inline-block text-xs text-green-600 hover:text-green-700 font-medium hover:underline"
            >
              Go to Forgot password
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <motion.div variants={itemVariants as any} className="relative">
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </motion.div>

            <motion.div variants={itemVariants as any} className="relative">
              <input
                {...register("newPassword")}
                type="password"
                placeholder="New password"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm bg-white transition-all duration-300 placeholder:text-gray-400 hover:border-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
              />
              {errors.newPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500 mt-1"
                >
                  {errors.newPassword.message}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants as any} className="relative">
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirm new password"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm bg-white transition-all duration-300 placeholder:text-gray-400 hover:border-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
              />
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500 mt-1"
                >
                  {errors.confirmPassword.message}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants as any} className="pt-2">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-gray-800 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? "Resetting..." : "Reset password"}
              </motion.button>
            </motion.div>
          </form>
        )}

        <motion.p
          variants={itemVariants as any}
          className="text-xs text-gray-600 text-center mt-6"
        >
          Back to{" "}
          <Link
            to="/auth/login"
            className="text-green-600 hover:text-green-700 font-medium hover:underline"
          >
            Login
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
