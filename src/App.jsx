import ThemeToggle from "./ThemeToggle";

function App() {
  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Dark Mode Example</h1>
      <ThemeToggle />
      <p>এই টেক্সটের রংও পরিবর্তন হবে dark/light mode অনুযায়ী।</p>
    </div>
  );
}

export default App;
