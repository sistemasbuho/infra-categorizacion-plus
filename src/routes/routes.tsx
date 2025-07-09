import { IconType } from 'react-icons';
import {
  FaHome,
  FaList,
  FaFileAlt,
  FaEnvelope,
  FaUsers,
  FaHashtag,
  FaClipboardList,
  FaChartBar,
  FaShare,
  FaUserPlus,
  FaCrown,
  FaTags,
  FaThList,
  FaTable,
  FaBullhorn,
  FaShareAlt,
  FaCheckCircle,
  FaTachometerAlt,
  FaUserTie,
  FaNewspaper,
  FaLayerGroup,
  FaClipboard,
} from 'react-icons/fa';
import { MisArticulosLideres } from '../pages/MisArticulosLideres/MisArticulosLideres';
import { Tags } from '../pages/Tags/Tags';
import { IoChatboxOutline } from 'react-icons/io5';
import { CategorizacionArticulo } from '../pages/CategorizacionArticulo/CategorizacionArticulo';
import { Temas } from '../pages/Temas/Temas';
import Home from '../pages/Home/Home';
import { MisArticulos } from '../pages/MisArticulos/MisArticulos';

export type RouteElement = {
  path: string;
  element: React.ComponentType<any>;
  icon: IconType;
  label: string;
  roles: number[];
  showInSidebar?: boolean;
  section?: string; // Nueva propiedad para agrupar por secciones
};

export type MenuSection = {
  id: string;
  title: string;
  routes: RouteElement[];
};

export const routes: RouteElement[] = [
  // Ruta principal - no se muestra en sidebar
  {
    path: '/',
    element: Home,
    icon: FaHome,
    label: 'Home',
    roles: [1, 2],
    showInSidebar: false,
  },
  // ARTICULOS
  {
    path: '/mis-articulos',
    element: MisArticulos,
    icon: FaNewspaper,
    label: 'Mis Articulos',
    roles: [1, 2],
    section: 'articulos',
  },
  {
    path: '/mis-articulos-lider',
    element: MisArticulosLideres,
    icon: FaCrown,
    label: 'Articulos Lideres',
    roles: [1, 2],
    section: 'articulos',
  },
  {
    path: '/asignar-articulos',
    element: Home, // Placeholder
    icon: FaUserTie,
    label: 'Asignar Articulos',
    roles: [1, 2],
    section: 'articulos',
  },
  {
    path: '/temas',
    element: Temas,
    icon: FaLayerGroup,
    label: 'Lista Temas',
    roles: [1, 2],
    section: 'articulos',
  },
  {
    path: '/tags',
    element: Tags,
    icon: FaTags,
    label: 'Lista Tags',
    roles: [1, 2],
    section: 'articulos',
  },
  // SOCIAL
  {
    path: '/matriz',
    element: Home, // Placeholder
    icon: FaTable,
    label: 'Matriz',
    roles: [1, 2],
    section: 'social',
  },
  {
    path: '/lista-publicaciones-lider',
    element: Home, // Placeholder
    icon: FaBullhorn,
    label: 'Lista publicaciones lid...',
    roles: [1, 2],
    section: 'social',
  },
  {
    path: '/lista-publicaciones',
    element: Home, // Placeholder
    icon: FaThList,
    label: 'Lista Publicaciones',
    roles: [1, 2],
    section: 'social',
  },
  {
    path: '/asignar-publicaciones',
    element: Home, // Placeholder
    icon: FaShareAlt,
    label: 'Asignar Publicaciones',
    roles: [1, 2],
    section: 'social',
  },
  // CALIDAD
  {
    path: '/calidad-articulos',
    element: Home, // Placeholder
    icon: FaCheckCircle,
    label: 'Articulos',
    roles: [1, 2],
    section: 'calidad',
  },
  {
    path: '/indicadores',
    element: Home, // Placeholder
    icon: FaTachometerAlt,
    label: 'Indicadores',
    roles: [1, 2],
    section: 'calidad',
  },
  // Ruta especial - no se muestra en sidebar
  {
    path: '/categorizacion-articulo/:id/:proyectoId',
    element: CategorizacionArticulo,
    icon: IoChatboxOutline,
    label: 'Categorización de Artículo',
    roles: [1, 2],
    showInSidebar: false,
  },
];

export const menuSections: MenuSection[] = [
  {
    id: 'articulos',
    title: 'ARTICULOS',
    routes: routes.filter((route) => route.section === 'articulos'),
  },
  {
    id: 'social',
    title: 'SOCIAL',
    routes: routes.filter((route) => route.section === 'social'),
  },
  {
    id: 'calidad',
    title: 'CALIDAD',
    routes: routes.filter((route) => route.section === 'calidad'),
  },
];
