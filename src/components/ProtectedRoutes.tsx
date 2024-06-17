import { Navigate, Outlet } from 'react-router-dom';
import { getLocalToken } from '../utils/funcs';

const ProtectedRoutes = () => {
  const token = getLocalToken()

  if (token) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};
export default ProtectedRoutes;
