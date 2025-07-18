import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getVarSsn } from '../utils/funcs';

export const ProtectedRoutes = ({ roles, children }) => {
  const session = getVarSsn();
  const userRoles = session?.groups?.map((g) => g.id) || [1, 2];

  const hasPermission = userRoles.some((r) => roles.includes(r));
  return hasPermission ? children : <Navigate to="/login" replace />;
};

ProtectedRoutes.propTypes = {
  roles: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
};
