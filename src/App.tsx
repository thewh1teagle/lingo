import { Route, Routes } from "react-router-dom";
import "./globals.css";
import Home from "./pages/Home";
import Setup from "./pages/Setup";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
