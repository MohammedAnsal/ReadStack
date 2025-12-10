import { motion } from "framer-motion";
import { useAuthStore } from "../../store/auth.store";
import homeImage from "../../assets/homeImage.jpg";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 20, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.6, // slower animation
        ease: [0.25, 0.8, 0.25, 1], // smoother easing
      },
    },
  };

  return (
    <main className="h-screen bg-white flex items-center justify-center px-4 py-12 overflow-hidden">
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
        className="relative z-10 w-full max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8 lg:gap-16">
          {/* Left Content - Text Section */}
          <div className="flex-1 w-full lg:max-w-xl text-center lg:text-left">
            {/* Logo/Brand */}
            <motion.div variants={itemVariants as any} className="mb-8">
              <h2 className="text-3xl font-bold text-black tracking-tight">
                ReadStack
              </h2>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants as any}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight"
            >
              Human stories & ideas
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants as any}
              className="text-lg md:text-xl text-gray-600 mb-10 font-light"
            >
              A place to read, write, and deepen your understanding
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants as any}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-10"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={isAuthenticated ? "/articles/feed" : "/auth/signup"}
                  className="inline-block px-8 py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm"
                >
                  {isAuthenticated ? "Go to Feed" : "Get Started"}
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={isAuthenticated ? "/articles/feed" : "/auth/login"}
                  className="inline-block px-8 py-3 border border-gray-300 text-black text-sm font-medium rounded-full hover:bg-gray-50 transition-colors"
                >
                  {isAuthenticated ? "Continue Reading" : "Sign In"}
                </Link>
              </motion.div>
            </motion.div>

            {/* Features */}
            <motion.div
              variants={itemVariants as any}
              className="grid grid-cols-3 gap-6 text-xs text-gray-600"
            >
              <div className="flex flex-col items-center lg:items-start">
                <p className="font-medium text-black mb-1">Write</p>
                <p className="text-gray-500">Share your thoughts</p>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <p className="font-medium text-black mb-1">Read</p>
                <p className="text-gray-500">Discover stories</p>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <p className="font-medium text-black mb-1">Connect</p>
                <p className="text-gray-500">Join the community</p>
              </div>
            </motion.div>
          </div>

          {/* Right Image Section - Medium Style */}
          <motion.div
            variants={imageVariants as any}
            className="hidden md:flex flex-1 w-full lg:w-1/2 items-center justify-center lg:justify-end mt-10 lg:mt-0"
          >
            <div className="relative w-full max-w-lg">
              <motion.div
                variants={imageVariants as any}
                className="hidden md:flex flex-1 w-full lg:w-1/2 items-center justify-center lg:justify-end mt-10 lg:mt-0"
              >
                <div className="relative w-full max-w-lg">
                  <motion.div className="relative w-[600px] h-[600px]">
                    <img
                      src={homeImage}
                      alt="Human stories and ideas"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
