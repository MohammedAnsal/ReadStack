import type { UserProfile } from "../../../services/api/user.api";

interface PersonalInfoSectionProps {
  user: UserProfile;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  isSaving: boolean;
  onSave: () => void;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  phone: string;
  setPhone: (value: string) => void;
  dob: string;
  setDob: (value: string) => void;
}

export const PersonalInfoSection = ({
  user,
  isEditing,
  setIsEditing,
  isSaving,
  onSave,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  phone,
  setPhone,
  dob,
  setDob,
}: PersonalInfoSectionProps) => {
  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhone(user.phone);
      setDob(user.dob ? user.dob.split("T")[0] : "");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Personal Information
        </h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={!isEditing}
            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
              isEditing
                ? "border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20"
                : "border-gray-200 bg-gray-50"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={!isEditing}
            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
              isEditing
                ? "border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20"
                : "border-gray-200 bg-gray-50"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled={true}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!isEditing}
            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
              isEditing
                ? "border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20"
                : "border-gray-200 bg-gray-50"
            }`}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            disabled={!isEditing}
            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
              isEditing
                ? "border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20"
                : "border-gray-200 bg-gray-50"
            }`}
          />
        </div>
      </div>
    </div>
  );
};
