import React from 'react';

// Settings component er AppearanceTab e update korbo
const AppearanceTab = () => {
  const { theme, fontSize, updateFontSize, updateLanguage, language } = useTheme();

  const handleThemeChange = (newTheme) => {
    // Theme context e update korbo
    // Ei part ta tomake ThemeContext e implement korte hobe
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme
          </label>
          <select
            value={theme}
            onChange={(e) => handleThemeChange(e.target.value)}
            className="input-field"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Font Size
          </label>
          <select
            value={fontSize}
            onChange={(e) => updateFontSize(e.target.value)}
            className="input-field"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>

      {/* Theme Preview Section */}
      <div>
        <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          Theme Preview
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Light Theme Preview */}
          <div className={`border-2 rounded-lg p-4 transition-all duration-300 ${
            theme === 'light' 
              ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
              : 'border-gray-200 dark:border-gray-600'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
            </div>
            <p className="text-sm text-gray-600 mt-3">Light Theme</p>
          </div>

          {/* Dark Theme Preview */}
          <div className={`border-2 rounded-lg p-4 transition-all duration-300 ${
            theme === 'dark' 
              ? 'border-yellow-500 bg-gray-800' 
              : 'border-gray-200 dark:border-gray-600 bg-gray-800'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-gray-600 rounded"></div>
              <div className="h-2 bg-gray-600 rounded w-3/4"></div>
              <div className="h-2 bg-gray-600 rounded w-1/2"></div>
            </div>
            <p className="text-sm text-gray-400 mt-3">Dark Theme</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AppearanceTab;