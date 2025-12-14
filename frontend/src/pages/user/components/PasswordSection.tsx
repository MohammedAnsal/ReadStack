interface PasswordSectionProps {
  currentPassword: string;
  setCurrentPassword: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  isChangingPassword: boolean;
  onShowModal: () => void;
}

export const PasswordSection = ({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isChangingPassword,
  onShowModal,
}: PasswordSectionProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>

      <div className="space-y-6 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all duration-200"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all duration-200"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all duration-200"
            placeholder="Confirm new password"
          />
        </div>

        <button
          onClick={onShowModal}
          disabled={
            !currentPassword ||
            !newPassword ||
            !confirmPassword ||
            isChangingPassword
          }
          className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isChangingPassword ? "Changing Password..." : "Change Password"}
        </button>
      </div>
    </div>
  );
};
