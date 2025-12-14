import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { FiEdit3 } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { authService } from "../../services/api/auth.api";

export default function Navbar() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.log("Logout API call failed, continuing with frontend logout");
    } finally {
      logout();
      localStorage.removeItem("access-token");
      toast.success("Logged out successfully");
      navigate("/signin", { replace: true });
    }
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left - Logo */}
        <Link to="/" className="text-xl font-bold">
          ReadStack
        </Link>

        {/* Right - Actions */}
        <div className="flex items-center gap-5">
          {/* Write Button */}
          <Link
            to="/articles/create"
            className="flex items-center gap-2 text-sm font-medium hover:text-gray-700 transition-colors"
          >
            <FiEdit3 className="text-lg" />
            Write
          </Link>

          {/* Profile Icon */}
          <Link to="/profile">
            <FaRegUserCircle className="text-2xl text-gray-700 hover:text-black transition-colors" />
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <FiLogOut className="text-lg" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
