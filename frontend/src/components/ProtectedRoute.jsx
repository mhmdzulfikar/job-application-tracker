import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // 1. Satpam ngecek dompet browser, ada tiket (token) ngga?
    const token = localStorage.getItem('token');

    // 2. Kalau tiketnya NGGA ADA, langsung tendang ke halaman /login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 3. Kalau ADA, silakan lewat dan render halaman yang dituju (<Outlet />)
    return <Outlet />;
};

export default ProtectedRoute;