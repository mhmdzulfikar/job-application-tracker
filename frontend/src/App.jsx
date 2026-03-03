
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// FOLDER pages
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import TailwindPlayground from "./pages/Latihan/TailwindPlayground";
import Warung from "./pages/Latihan/Warung";
import Settings from "./pages/Settings";
import Register from "./pages/Register";
import Login from "./pages/Login";


function App() {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="tailwind" element={<TailwindPlayground />} />
          <Route path="warung" element={<Warung />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>

  );
}

export default App;

