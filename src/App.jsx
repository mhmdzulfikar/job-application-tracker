import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import TailwindPlayground from "./pages/Latihan/TailwindPlayground";
import Warung from "./pages/Latihan/Warung";

function App() {
  return (
    <Routes>
      {/* Layout membungkus semua halaman di dalamnya */}
      <Route path="/" element={<Layout />}>
        {/* Kalau buka website pertama kali (path="/"), buka Dashboard */}
        <Route index element={<Dashboard />} />
        
        {/* Kalau buka /analytics, buka Analytics */}
        <Route path="analytics" element={<Analytics />} />
        
        {/* Kalau buka /tailwind, buka TailwindPlayground */}
        <Route path="tailwind" element={<TailwindPlayground />} />
        <Route path="warung" element={<Warung />} />
        
        {/* Kalau buka /settings (belum ada file), kasih tulisan aja */}
        <Route path="settings" element={<div className="p-6">Halaman Settings (Soon)</div>} />
      </Route>
    </Routes>
  );
}

export default App;