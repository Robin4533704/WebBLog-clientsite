import { useContext } from "react";
import { ThemeContext } from "../../pages/darack/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme}>
      {theme === "light" ? "🌙 " : "☀️"}
    </button>
  );
};

export default ThemeToggle;
