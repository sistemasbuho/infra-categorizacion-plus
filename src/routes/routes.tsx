import { IconType } from 'react-icons';
import { FaHome, FaList } from 'react-icons/fa';
import Home from '../pages/Home';
import { MisArticulos } from '../pages/MisArticulos';
import { MisArticulosLideres } from '../pages/MisArticulosLideres/MisArticulosLideres';
import { Tags } from '../pages/Tags/Tags';
// import Article from '../components/Article';
import { IoChatboxOutline } from 'react-icons/io5';
import { CategorizacionArticulo } from '../pages/CategorizacionArticulo/CategorizacionArticulo';
import { Temas } from '../pages/Temas/Temas';

export type RouteElement = {
  path: string;
  element: React.ComponentType<any>;
  icon: IconType;
  label: string;
  roles: number[];
  showInSidebar?: boolean; // Por defecto true, false para rutas especiales
};

export const routes: RouteElement[] = [
  {
    path: '/',
    element: Home,
    icon: FaHome,
    label: 'Home',
    roles: [1, 2],
  },
  {
    path: '/mis-articulos',
    element: MisArticulos,
    icon: FaList,
    label: 'Mis Articulos',
    roles: [1, 2],
  },
  {
    path: '/mis-articulos-lider',
    element: MisArticulosLideres,
    icon: FaList,
    label: 'Mis Articulos Lider',
    roles: [1, 2],
  },
  {
    path: '/tags',
    element: Tags,
    icon: FaList,
    label: 'Lista de tags',
    roles: [1, 2],
  },
  {
    path: '/temas',
    element: Temas,
    icon: FaList,
    label: 'Lista de temas',
    roles: [1, 2],
  },
  {
    path: '/categorizacion-articulo/:id/:proyectoId',
    element: CategorizacionArticulo,
    icon: IoChatboxOutline,
    label: 'Categorización de Artículo',
    roles: [1, 2],
    showInSidebar: false,
  },
  // {
  //   path: '/red/:id',
  //   element: <ArticleManager />,
  //   icon: FaTwitter,
  //   label: 'Módulo de Redes',
  // },
];
