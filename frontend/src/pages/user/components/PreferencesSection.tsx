interface PreferencesSectionProps {
  preferences: string[];
  availablePreferences: string[];
  onUpdatePreferences: (pref: string) => void;
}

export const PreferencesSection = ({
  preferences,
  availablePreferences,
  onUpdatePreferences,
}: PreferencesSectionProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Preferences</h2>
      <p className="text-gray-600 mb-6">
        Select the categories you're interested in. This helps us personalize your feed.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availablePreferences.map((pref, index) => (
          <button
            key={pref}
            onClick={() => onUpdatePreferences(pref)}
            style={{ animationDelay: `${index * 100}ms` }}
            className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 active:scale-95 text-left ${
              preferences.includes(pref)
                ? "border-black bg-black text-white shadow-lg"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg">{pref}</span>
              {preferences.includes(pref) && (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
