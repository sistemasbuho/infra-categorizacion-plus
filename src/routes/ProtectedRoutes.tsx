// import { Navigate } from 'react-router-dom';
// import PropTypes from 'prop-types';

// export const ProtectedRoutes = ({ roles, children }) => {
//   const userData = JSON.parse(localStorage.getItem('userData'));
//   const userRoles = userData?.groups?.map((g) => g.id) || [1, 2];

//   const hasPermission = userRoles.some((r) => roles.includes(r));

//   return hasPermission ? children : <Navigate to="/login" replace />;
// };

// ProtectedRoutes.propTypes = {
//   roles: PropTypes.array.isRequired,
//   children: PropTypes.node.isRequired,
// };

import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getVarSsn } from '../utils/funcs';

export const ProtectedRoutes = ({ roles, children }) => {
  const session = getVarSsn();
  const userRoles = session?.groups?.map((g) => g.id) || [1, 2];

  console.log({ session });
  console.log({ userRoles });

  const hasPermission = userRoles.some((r) => roles.includes(r));
  return hasPermission ? children : <Navigate to="/login" replace />;
};

ProtectedRoutes.propTypes = {
  roles: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
};
