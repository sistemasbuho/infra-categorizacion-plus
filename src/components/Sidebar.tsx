import { Link, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router';
import { routes, menuSections } from '../routes/routes';
import { FaBars, FaMoon, FaSun } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useTheme } from '../shared/context/ThemeContext';

export default function Sidebar() {
  const { theme, toggle } = useTheme();
  const location = useLocation();

  const isCategorizationPage = location.pathname.includes(
    '/categorizacion-articulo/'
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(!isCategorizationPage);
      } else {
        setOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCategorizationPage]);

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
        className={`flex flex-col h-full transition-all duration-300 overflow-x-hidden ${
          open ? 'w-64' : 'w-16'
        }`}
        style={{
          backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
          borderRight: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
        }}
      >
        {/* Botón hamburguesa con altura fija */}
        <div className="flex-shrink-0" style={{ height: '64px' }}>
          <button
            className="w-full h-full flex items-center justify-center focus:outline-none transition-colors"
            style={{
              color: theme === 'dark' ? '#ffffff' : '#374151',
              backgroundColor: 'transparent',
              fontSize: '20px',
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
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          <nav
            className={`flex-1 min-h-0 ${
              open
                ? 'overflow-y-auto py-4'
                : 'overflow-y-auto overflow-x-hidden py-2'
            }`}
            style={{
              maxHeight: open ? 'none' : 'calc(100vh - 128px)',
            }}
          >
            {menuSections.map((section) => (
              <div key={section.id} className={open ? 'mb-6' : 'mb-2'}>
                {/* Título de la sección */}
                {section.title && (
                  <div className="relative">
                    {/* Título cuando está abierto */}
                    <div
                      className={`px-4 py-2 mx-2 text-sm font-bold uppercase transition-all duration-300 ${
                        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                      style={{
                        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {section.title}
                    </div>

                    {/* Indicador cuando está cerrado */}
                    <div
                      className={`flex items-center justify-center w-full transition-all duration-300 ${
                        open
                          ? 'opacity-0 pointer-events-none h-0'
                          : 'opacity-100 h-4'
                      }`}
                      style={{
                        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        fontSize: '12px',
                      }}
                    >
                      •
                    </div>
                  </div>
                )}

                {/* Rutas de la sección */}
                <div className={open ? 'space-y-1' : 'space-y-2'}>
                  {section.routes
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
                            className={`flex items-center rounded-lg cursor-pointer transition-all duration-200 ${
                              open ? 'p-3 mx-2 ml-0' : 'p-3 mx-1 justify-center'
                            }`}
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
                              minHeight: '44px',
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor =
                                  theme === 'dark' ? '#4b5563' : '#e5e7eb';
                                e.currentTarget.style.color =
                                  theme === 'dark' ? '#ffffff' : '#111827';
                                // Buscar específicamente el contenedor del icono
                                const iconContainer =
                                  e.currentTarget.querySelector(
                                    '.icon-container'
                                  ) as HTMLElement;
                                if (iconContainer) {
                                  iconContainer.style.color =
                                    theme === 'dark' ? '#ffffff' : '#111827';
                                }
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor =
                                  'transparent';
                                e.currentTarget.style.color =
                                  theme === 'dark' ? '#d1d5db' : '#374151';
                                const iconContainer =
                                  e.currentTarget.querySelector(
                                    '.icon-container'
                                  ) as HTMLElement;
                                if (iconContainer) {
                                  iconContainer.style.color =
                                    theme === 'dark' ? '#d1d5db' : '#000000';
                                }
                              }
                            }}
                          >
                            {link.icon && (
                              <div
                                className={`icon-container flex items-center justify-center ${
                                  open ? 'mr-0 md:mr-4' : 'mr-0'
                                }`}
                                style={{
                                  color: isActive
                                    ? '#ffffff'
                                    : theme === 'dark'
                                    ? '#d1d5db'
                                    : '#000000',
                                  fontSize: '20px',
                                  width: '20px',
                                  height: '20px',
                                  minWidth: '20px',
                                  minHeight: '20px',
                                }}
                              >
                                <link.icon
                                  size={20}
                                  style={{
                                    color: 'inherit',
                                    fill: 'currentColor',
                                  }}
                                />
                              </div>
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
                </div>
              </div>
            ))}
          </nav>

          {/* Botón de cambio de tema con altura fija igual al botón hamburguesa */}
          <div className="flex-shrink-0" style={{ height: '64px' }}>
            <button
              className="w-full h-full flex items-center justify-center transition-colors cursor-pointer focus:outline-none"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: theme === 'dark' ? '#d1d5db' : '#6b7280',
                fontSize: '20px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme === 'dark' ? '#4b5563' : '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={toggle}
              title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
            >
              {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
            </button>
          </div>
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
