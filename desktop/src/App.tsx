import { Route, Routes } from "react-router-dom";
import "./globals.css";
import Home from "./pages/Home";
import Setup from "./pages/Setup";
import Settings from "./pages/Settings";
import './lib/i18n'
import PreferenceProvider from "./providers/PreferenceProvider";

function App() {
  return (
    <PreferenceProvider>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
    </PreferenceProvider>
  );
}

export default App;
