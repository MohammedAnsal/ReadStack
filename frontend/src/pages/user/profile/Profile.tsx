import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Navbar from "../../../components/layouts/Navbar";
import { userService, type UserProfile } from "../../../services/api/user.api";
import { ConfirmationModal } from "../../../components/common/ConfirmationModal";
import { PersonalInfoSection } from "../components/PersonalInfoSection";
import { PasswordSection } from "../components/PasswordSection";
import { PreferencesSection } from "../components/PreferencesSection";

const PREFERENCES = [
  "Design",
  "AI",
  "Writing",
  "Product",
  "Technology",
  "Business",
  "Science",
  "Health",
  "Education",
  "Marketing",
  "Finance",
  "Travel",
  "Food",
  "Sports",
  "Entertainment",
];

export const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"info" | "password" | "preferences">("info");

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setDob(user.dob ? user.dob.split("T")[0] : "");
      setPreferences(user.preferences || []);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      if (response.success && response.user) {
        setUser(response.user);
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast.error(error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const response = await userService.updateProfile({
        firstName,
        lastName,
        email,
        phone,
        dob,
      });

      if (response.success && response.user) {
        setUser(response.user);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setShowPasswordModal(false);
    try {
      setIsChangingPassword(true);
      const response = await userService.changePassword({
        currentPassword,
        newPassword,
      });

      if (response.success) {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleUpdatePreferences = async (pref: string) => {
    const updatedPreferences = preferences.includes(pref)
      ? preferences.filter((p) => p !== pref)
      : [...preferences, pref];

    try {
      const response = await userService.updatePreferences(updatedPreferences);
      if (response.success && response.user) {
        setUser(response.user);
        setPreferences(updatedPreferences);
        toast.success("Preferences updated successfully");
      }
    } catch (error: any) {
      console.error("Error updating preferences:", error);
      toast.error(error.message || "Failed to update preferences");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Failed to load profile
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        {/* Header */}
        <div className="mb-8 animate-slide-down">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 animate-slide-down-delay">
          {[
            { id: "info" as const, label: "Personal Info", icon: "👤" },
            { id: "password" as const, label: "Password", icon: "🔒" },
            { id: "preferences" as const, label: "Preferences", icon: "⚙️" },
          ].map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsEditing(false);
              }}
              style={{ animationDelay: `${index * 100}ms` }}
              className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id
                  ? "bg-black text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Personal Info Tab */}
        {activeTab === "info" && (
          <PersonalInfoSection
            user={user}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isSaving={isSaving}
            onSave={handleSaveProfile}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            email={email}
            phone={phone}
            setPhone={setPhone}
            dob={dob}
            setDob={setDob}
          />
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <PasswordSection
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isChangingPassword={isChangingPassword}
            onShowModal={() => setShowPasswordModal(true)}
          />
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <PreferencesSection
            preferences={preferences}
            availablePreferences={PREFERENCES}
            onUpdatePreferences={handleUpdatePreferences}
          />
        )}
      </div>

      {/* Password Change Confirmation Modal */}
      <ConfirmationModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onConfirm={handleChangePassword}
        title="Change Password"
        message="Are you sure you want to change your password? You'll need to use your new password for future logins."
        confirmText="Change Password"
        confirmButtonColor="blue"
        isLoading={isChangingPassword}
        loadingText="Changing Password..."
        icon={
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        }
      />

      {/* Custom Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }

        .animate-slide-down-delay {
          animation: slide-down 0.6s ease-out 0.1s both;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
      `}</style>
    </main>
  );
};
