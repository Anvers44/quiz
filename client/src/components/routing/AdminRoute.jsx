// client/src/components/routing/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();



    return isAuthenticated && user?.role === 'admin'
        ? children
        : <Navigate to="/dashboard" />;
};

export default AdminRoute;