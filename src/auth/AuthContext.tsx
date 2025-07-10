import { createContext, useContext, useState, ReactNode } from 'react';
import { getVarSsn } from '../utils/funcs';

const AuthContext = createContext<any>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(getVarSsn());

  const hasRole = (requiredRole: number) => {
    if (!user) return false;
    const userRoles = user.groups?.map((g: any) => g.id) || [1, 2];
    return userRoles.includes(requiredRole);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};
