import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  signUpSchema,
  type SignupSchemaType,
} from "../../../lib/validations/auth.z.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { authService } from "../../../services/api/auth.api";
import { useAuthStore } from "../../../store/auth.store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state: { accessToken: any; }) => !!state.accessToken);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/articles/feed");
    }
  }, [isLoggedIn]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(signUpSchema),
  });

  const goToLogin = () => {
    navigate("/auth/login");
  };

  const onSubmit = async (data: SignupSchemaType) => {
    try {
      const res = await authService.signup(data);

      toast.success(res.data.message || "Account created!");
      reset();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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
        // initial={{ opacity: 0, scale: 0.97, y: 20 }}
        // animate={{ opacity: 1, scale: 1, y: 0 }}
        // transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Branding */}
        <motion.div variants={itemVariants as any} className="text-center mb-5">
          <h1 className="text-3xl font-bold text-black">ReadStack</h1>
          <p className="text-xs text-gray-500 mt-1 italic">
            "Write. Express. Inspire."
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          {/* TWO COLUMN */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "firstName", placeholder: "First Name" },
              { name: "lastName", placeholder: "Last Name" },
            ].map((field) => (
              <motion.div
                key={field.name}
                variants={itemVariants as any}
                className="relative"
              >
                <input
                  {...register(field.name as keyof SignupSchemaType)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm bg-white transition-all duration-300 ease-in-out placeholder:text-gray-400 hover:border-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
                />
                {errors[field.name as keyof SignupSchemaType] && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 mt-1"
                  >
                    {errors[field.name as keyof SignupSchemaType]?.message}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>

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

          {/* 2 COLUMN (Phone + DOB) */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div variants={itemVariants as any} className="relative">
              <input
                {...register("phone")}
                type="tel"
                placeholder="Phone"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm bg-white transition-all duration-300 ease-in-out placeholder:text-gray-400 hover:border-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
              />
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500 mt-1"
                >
                  {errors.phone.message}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants as any} className="relative">
              <input
                type="date"
                {...register("dob")}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm bg-white transition-all duration-300 ease-in-out hover:border-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none text-gray-700"
              />
              {errors.dob && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500 mt-1"
                >
                  {errors.dob.message}
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Preferences */}
          <motion.div variants={itemVariants as any} className="relative">
            <select
              {...register("preferences")}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm bg-white transition-all duration-300 ease-in-out hover:border-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none text-gray-700 cursor-pointer"
            >
              <option value="">Select interest</option>
              <option value="tech">Technology</option>
              <option value="ai">AI</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="stories">Stories</option>
            </select>
            {errors.preferences && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 mt-1"
              >
                {errors.preferences.message}
              </motion.p>
            )}
          </motion.div>

          {/* PASSWORDS */}
          {["password", "confirmPassword"].map((field) => (
            <motion.div
              key={field}
              variants={itemVariants as any}
              className="relative"
            >
              <input
                type="password"
                {...register(field as keyof SignupSchemaType)}
                placeholder={
                  field === "confirmPassword" ? "Confirm Password" : "Password"
                }
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm bg-white transition-all duration-300 ease-in-out placeholder:text-gray-400 hover:border-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
              />
              {errors[field as keyof SignupSchemaType] && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500 mt-1"
                >
                  {errors[field as keyof SignupSchemaType]?.message}
                </motion.p>
              )}
            </motion.div>
          ))}

          <motion.div variants={itemVariants as any} className="pt-1">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out hover:bg-gray-800 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </motion.button>
          </motion.div>
        </form>

        <motion.p
          variants={itemVariants as any}
          className="text-xs text-gray-600 text-center mt-5"
        >
          Already have an account?{" "}
          <span
            onClick={goToLogin}
            className="cursor-pointer text-green-600 hover:underline"
          >
            Sign in
          </span>
        </motion.p>
      </motion.div>
    </div>
  );
}
