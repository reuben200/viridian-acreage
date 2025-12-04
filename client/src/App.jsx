import PWABadge from "./PWABadge.jsx";
import "./App.css";
import AppRoutes from "./routes.jsx";

function App() {
  return (
    <div className="dark:bg-gray-800">
      <div className=" min-h-screen">
        <AppRoutes />
      </div>
      <PWABadge />
    </div>
  );
}

export default App;
