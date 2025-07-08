import { Link, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router';
import { routes } from '../routes/routes';
import { FaBars, FaMoon, FaSun } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar() {
  const { theme, toggle } = useTheme();
  const location = useLocation();

  // Verificar si estamos en la página de categorización
  const isCategorizationPage = location.pathname.includes(
    '/categorizacion-articulo/'
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Si estamos en categorización, mantener cerrado por defecto
        setOpen(!isCategorizationPage);
      } else {
        setOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCategorizationPage]);

  // Función para verificar si una ruta está activa
  const isActiveRoute = (routePath: string) => {
    if (routePath === '/') {
      return location.pathname === '/';
    }

    if (routePath.includes(':')) {
      const routePattern = routePath.split('/');
      const pathSegments = location.pathname.split('/');

      if (routePattern.length !== pathSegments.length) {
        return false;
      }

      return routePattern.every((segment, index) => {
        return segment.startsWith(':') || segment === pathSegments[index];
      });
    }

    return location.pathname === routePath;
  };

  return (
    <section className="flex flex-row h-[100vh] w-full overflow-hidden">
      <div
        className={`flex flex-col h-full transition-all duration-300 ${
          open ? 'w-64' : 'w-16'
        }`}
        style={{
          backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
          borderRight: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
        }}
      >
        <button
          className="p-4 text-2xl focus:outline-none mr-2 transition-colors"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#374151',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              theme === 'dark' ? '#4b5563' : '#e5e7eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          onClick={() => setOpen((prev) => !prev)}
        >
          <FaBars />
        </button>

        <div className="flex flex-col flex-1">
          <div
            className={`hidden md:flex h-20 items-center mx-4 justify-between transition-all duration-300 ${
              open ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <p
              className="text-2xl font-bold"
              style={{ color: theme === 'dark' ? '#ffffff' : '#374151' }}
            >
              Módulos
            </p>
          </div>

          <nav className="flex-1">
            {routes
              .filter((link) => link.showInSidebar !== false)
              .map((link) => {
                const isActive = isActiveRoute(link.path);

                return (
                  <Link
                    to={link.path}
                    key={link.label}
                    className="text-inherit no-underline"
                  >
                    <div
                      className="flex items-center p-4 mx-2 rounded-lg cursor-pointer transition-all duration-200"
                      style={{
                        backgroundColor: isActive
                          ? theme === 'dark'
                            ? '#3b82f6'
                            : '#2563eb'
                          : 'transparent',
                        color: isActive
                          ? '#ffffff'
                          : theme === 'dark'
                          ? '#d1d5db'
                          : '#374151',
                        borderLeft: isActive
                          ? `4px solid ${
                              theme === 'dark' ? '#60a5fa' : '#1d4ed8'
                            }`
                          : '4px solid transparent',
                        fontWeight: isActive ? '600' : '400',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor =
                            theme === 'dark' ? '#4b5563' : '#e5e7eb';
                          e.currentTarget.style.color =
                            theme === 'dark' ? '#ffffff' : '#111827';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color =
                            theme === 'dark' ? '#d1d5db' : '#374151';
                        }
                      }}
                    >
                      {link.icon && (
                        <link.icon
                          className={`mr-0 md:mr-4 text-lg ${
                            isActive ? 'text-white' : ''
                          }`}
                        />
                      )}
                      <span
                        className={`transition-all duration-300 ${
                          open ? 'inline' : 'hidden'
                        }`}
                      >
                        {link.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
          </nav>

          <button
            className="m-4 transition-colors cursor-pointer"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: theme === 'dark' ? '#d1d5db' : '#6b7280',
            }}
            onClick={toggle}
            title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
          >
            {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
          </button>
        </div>
      </div>

      <main
        className="flex-1 overflow-auto"
        style={{
          backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
          color: theme === 'dark' ? '#ffffff' : '#111827',
        }}
      >
        <Outlet />
      </main>
    </section>
  );
}
