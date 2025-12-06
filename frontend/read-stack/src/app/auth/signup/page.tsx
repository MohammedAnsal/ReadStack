"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Signup data:", formData);
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
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        className="relative w-full max-w-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.div
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo/Brand */}
          <motion.div variants={itemVariants as any} className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
            </motion.div>
            <h1 className="text-2xl font-bold text-black mb-1">
              Create your account
            </h1>
            <p className="text-sm text-gray-600">
              Start writing and sharing your stories
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={itemVariants as any}>
              <motion.input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 text-sm border-b ${
                  errors.name
                    ? "border-red-400"
                    : "border-gray-300 focus:border-green-600"
                } bg-transparent focus:outline-none transition-colors placeholder:text-gray-400`}
                placeholder="Full name"
                whileFocus={{ scale: 1.01 }}
              />
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.name}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants as any}>
              <motion.input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 text-sm border-b ${
                  errors.email
                    ? "border-red-400"
                    : "border-gray-300 focus:border-green-600"
                } bg-transparent focus:outline-none transition-colors placeholder:text-gray-400`}
                placeholder="Email"
                whileFocus={{ scale: 1.01 }}
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants as any}>
              <motion.input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 text-sm border-b ${
                  errors.password
                    ? "border-red-400"
                    : "border-gray-300 focus:border-green-600"
                } bg-transparent focus:outline-none transition-colors placeholder:text-gray-400`}
                placeholder="Password"
                whileFocus={{ scale: 1.01 }}
              />
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants as any}>
              <motion.input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 text-sm border-b ${
                  errors.confirmPassword
                    ? "border-red-400"
                    : "border-gray-300 focus:border-green-600"
                } bg-transparent focus:outline-none transition-colors placeholder:text-gray-400`}
                placeholder="Confirm password"
                whileFocus={{ scale: 1.01 }}
              />
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants as any} className="pt-2">
              <motion.button
                type="submit"
                className="w-full bg-black text-white text-sm font-medium py-2.5 rounded-full hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create account
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

          {/* Social Login */}
          <motion.div
            variants={itemVariants as any}
            className="space-y-2"
          >
            <motion.button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-sm text-gray-700"
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
            </motion.button>
            
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={itemVariants as any}
            className="mt-6 text-center"
          >
            <p className="text-xs text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
