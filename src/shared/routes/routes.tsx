import { IconType } from 'react-icons';
import {
  FaHome,
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
  FaProjectDiagram,
} from 'react-icons/fa';
import { MisArticulosLideres } from '../../pages/MisArticulosLideres/MisArticulosLideres';
import { Tags } from '../../pages/Tags/Tags';
import { IoChatboxOutline } from 'react-icons/io5';
import { CategorizacionArticulo } from '../../pages/CategorizacionArticulo/CategorizacionArticulo';
import { Temas } from '../../pages/Temas/Temas';
import Home from '../../pages/Home/Home';
import { MisArticulos } from '../../pages/MisArticulos/MisArticulos';
import { Proyectos } from '../../pages/Proyectos/Proyectos';
import { ProyectoDetalle } from '../../pages/ProyectoDetalle/ProyectoDetalle';
import { AsignarArticulos } from '../../pages/AsignarArticulos/AsignarArticulos';

export type RouteElement = {
  path: string;
  element: React.ComponentType<any>;
  icon: IconType;
  label: string;
  roles: number[];
  showInSidebar?: boolean;
  section?: string;
};

export type MenuSection = {
  id: string;
  title: string;
  routes: RouteElement[];
};

export const routes: RouteElement[] = [
  {
    path: '/',
    element: Home,
    icon: FaHome,
    label: 'Home',
    roles: [1, 2],
    showInSidebar: false,
  },
  {
    path: '/proyectos',
    element: Proyectos,
    icon: FaProjectDiagram,
    label: 'Proyectos',
    roles: [1, 2],
    section: 'proyectos',
  },
  {
    path: '/proyectos/:id',
    element: ProyectoDetalle,
    icon: FaProjectDiagram,
    label: 'Detalle del Proyecto',
    roles: [1, 2],
    section: 'proyectos',
    showInSidebar: false,
  },
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
    element: AsignarArticulos,
    icon: FaUserTie,
    label: 'Asignar Articulos',
    roles: [1, 2],
    section: 'proyectos',
    showInSidebar: false,
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
  {
    path: '/matriz',
    element: Home,
    icon: FaTable,
    label: 'Matriz',
    roles: [1, 2],
    section: 'social',
  },
  {
    path: '/lista-publicaciones-lider',
    element: Home,
    icon: FaBullhorn,
    label: 'Lista publicaciones lid...',
    roles: [1, 2],
    section: 'social',
  },
  {
    path: '/lista-publicaciones',
    element: Home,
    icon: FaThList,
    label: 'Lista Publicaciones',
    roles: [1, 2],
    section: 'social',
  },
  {
    path: '/asignar-publicaciones',
    element: Home,
    icon: FaShareAlt,
    label: 'Asignar Publicaciones',
    roles: [1, 2],
    section: 'social',
  },
  {
    path: '/calidad-articulos',
    element: Home,
    icon: FaCheckCircle,
    label: 'Articulos',
    roles: [1, 2],
    section: 'calidad',
  },
  {
    path: '/indicadores',
    element: Home,
    icon: FaTachometerAlt,
    label: 'Indicadores',
    roles: [1, 2],
    section: 'calidad',
  },
  {
    path: '/categorizacion-articulo/articulo_id/:id/proyecto_id/:proyectoId',
    element: CategorizacionArticulo,
    icon: IoChatboxOutline,
    label: 'Categorización de Artículo',
    roles: [1, 2],
    showInSidebar: false,
  },
];

export const menuSections: MenuSection[] = [
  {
    id: 'proyectos',
    title: 'PROYECTOS',
    routes: routes.filter((route) => route.section === 'proyectos'),
  },
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
