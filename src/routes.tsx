import { MdArticle, MdPushPin } from 'react-icons/md';
import { ReactNode } from 'react';
import { IconType } from 'react-icons';
import { FaHome, FaList, FaTwitter } from 'react-icons/fa';

import ArticleManager from './ArticleManager';
import TemaManager from './TemaManager';
import TagManager from './TagManager';
import Home from './pages/Home';

export type RouteElement = {
  path: string;
  element: ReactNode;
  icon: IconType;
  label: string;
};

export const userRoutes: RouteElement[] = [
  {
    path: '/',
    element: <Home />,
    icon: FaHome,
    label: 'Home',
  },
  {
    path: '/tags',
    element: <TagManager />,
    icon: MdPushPin,
    label: 'Lista de tags',
  },
  {
    path: '/temas',
    element: <TemaManager />,
    icon: FaList,
    label: 'Lista de temas',
  },
  {
    path: '/articulo/:id',
    element: <ArticleManager />,
    icon: MdArticle,
    label: 'Módulo de Artículos',
  },
  {
    path: '/red/:id',
    element: <ArticleManager />,
    icon: FaTwitter,
    label: 'Módulo de Redes',
  },
];
