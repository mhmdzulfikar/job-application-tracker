
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from "../src/components/layouts/Layout";
import ProtectedRoute from "../src/features/jobs/components/ProtectedRoute";
import FindJob from "./pages/FindJob";

// FOLDER pages
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import TailwindPlayground from "./pages/Latihan/TailwindPlayground";
import Warung from "./pages/Latihan/Warung";
import Settings from "./pages/Settings";
import Register from "./pages/Register";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import AIAgent from './pages/AIAgent';


function App() {
  return (
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/find-job" element={<FindJob />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="tailwind" element={<TailwindPlayground />} />
          <Route path="warung" element={<Warung />} />
          <Route path="settings" element={<Settings />} />
          <Route path="aiagent" element={<AIAgent />} />
        </Route>
      </Route>
    </Routes>

  );
}

export default App;

