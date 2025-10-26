// src/components/TestDarkMode.jsx
import { useTheme } from '../../pages/darack/ThemeContext';

const TestDarkMode = () => {
  const { theme, isDark } = useTheme();

  return (
    <div className="p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Dark Mode Test
      </h2>
      
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">
          Current Theme: <strong>{theme}</strong>
        </p>
        
        <p className="text-gray-700 dark:text-gray-300">
          Is Dark Mode: <strong>{isDark ? 'YES' : 'NO'}</strong>
        </p>
        
        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded">
          <p className="text-blue-800 dark:text-blue-200">
            This should be blue in light mode, dark blue in dark mode
          </p>
        </div>
        
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded">
          <p className="text-green-800 dark:text-green-200">
            This should be green in light mode, dark green in dark mode
          </p>
        </div>
        
        <div className="p-4 bg-red-100 dark:bg-red-900 rounded">
          <p className="text-red-800 dark:text-red-200">
            This should be red in light mode, dark red in dark mode
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestDarkMode;