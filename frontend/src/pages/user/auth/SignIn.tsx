import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { authService } from "../../../services/api/auth.api";
import { useAuthStore } from "../../../store/auth.store";
import {
  loginSchema,
  type LoginSchemaType,
} from "../../../lib/validations/auth.z.validation";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const res = await authService.signin(data.email, data.password);
      localStorage.setItem("access-token", res.accessToken);

      useAuthStore.getState().login({
        userName: res.userName,
        email: res.email,
        token: res.accessToken,
      });
      toast.success(res.message || "Login successful!");

      navigate("/articles/feed", { replace: true });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
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
      {/* UI Card */}
      <motion.div
        className="relative w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Branding */}
        <motion.div variants={itemVariants as any} className="text-center mb-6">
          <h1 className="text-3xl font-bold text-black">ReadStack</h1>
          <p className="text-xs text-gray-500 mt-1 italic">
            "Write. Express. Inspire."
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* EMAIL */}
          <motion.div variants={itemVariants as any} className="relative">
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm bg-white transition-all duration-300 ease-in-out placeholder:text-gray-400 hover:border-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
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

          {/* PASSWORD */}
          <motion.div variants={itemVariants as any} className="relative">
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm bg-white transition-all duration-300 ease-in-out placeholder:text-gray-400 hover:border-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
            />
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 mt-1"
              >
                {errors.password.message}
              </motion.p>
            )}
          </motion.div>

          {/* Forgot Password Link */}
          <motion.div
            variants={itemVariants as any}
            className="flex justify-end"
          >
            <Link
              to={"/auth/forgot-password"}
              className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors duration-300 ease-in-out hover:underline"
            >
              Forgot password?
            </Link>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants as any} className="pt-2">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out hover:bg-gray-800 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </motion.button>
          </motion.div>
        </form>

        {/* Divider */}
        <motion.div
          variants={itemVariants as any}
          className="my-6 flex items-center"
        >
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-3 text-xs text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </motion.div>

        {/* Social Login (Optional) */}
        <motion.div variants={itemVariants as any} className="space-y-2">
          {/* <motion.button
            type="button"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 ease-in-out text-sm text-gray-700"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </motion.button> */}
        </motion.div>

        {/* Sign Up Link */}
        <motion.p
          variants={itemVariants as any}
          className="text-xs text-gray-600 text-center mt-6"
        >
          Don't have an account?{" "}
          <Link
            to={"/auth/signup"}
            className="text-green-600 hover:text-green-700 font-medium transition-colors duration-300 ease-in-out hover:underline"
          >
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
