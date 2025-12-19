import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { authService } from "../../../services/api/auth.api";
import { Link } from "react-router-dom";

const forgotSchema = z.object({
  email: z.string().email("Invalid email format"),
});

type ForgotSchemaType = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotSchemaType>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotSchemaType) => {
    try {
      const res = await authService.forgotPassword(data.email);
      toast.success(res.message || "Password reset link sent to your email");
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset link");
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

  return (
    <div className="h-screen w-full bg-white flex items-center justify-center px-4 py-4 overflow-hidden">
      <motion.div
        className="relative w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants as any} className="text-center mb-6">
          <h1 className="text-3xl font-bold text-black">Forgot password</h1>
          <p className="text-xs text-gray-500 mt-1">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <motion.div variants={itemVariants as any} className="relative">
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm bg-white transition-all duration-300 placeholder:text-gray-400 hover:border-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 mt-1"
              >
                {errors.email.message}
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
              {isSubmitting ? "Sending link..." : "Send reset link"}
            </motion.button>
          </motion.div>
        </form>

        <motion.p
          variants={itemVariants as any}
          className="text-xs text-gray-600 text-center mt-6"
        >
          Remembered your password?{" "}
          <Link
            to="/auth/login"
            className="text-green-600 hover:text-green-700 font-medium hover:underline"
          >
            Back to login
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
