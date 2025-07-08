import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

export interface ArticleData {
  id: string;
  titulo: string;
  texto: string;
  resumen: string;
  url_articulo: string;
  autor: { id: string; autor: string };
  medio: { id: string; url: string };
  tipo_articulo: { id: string; nombre: string } | null;
  fecha: string;
  programa: { id: string; nombre: string } | null;
  image_media_file?: string;
  audio_media_file?: string;
  state: boolean;
}

export interface Keywords {
  id: string;
  article_fragment: string;
  start_index: number;
  color?: string;
}

export interface Fragment {
  id: number;
  article_fragment: string;
  selectionId: number;
  start_index: number;
  tema: any[];
  tag: any[];
  activo: any[];
  pasivo: any[];
  tono: any;
}

export const useArticle = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [keywords, setKeywords] = useState<Keywords[]>([]);
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticleData = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulando datos por ahora - después se conectará con la API real
      const mockArticle: ArticleData = {
        id,
        titulo:
          'Coca-Cola FEMSA sigue creando futuro para las nuevas generaciones',
        texto: `Coca-Cola FEMSA, una de las franquicias embotelladoras más grandes del mundo de productos The Coca-Cola Company, reafirma su compromiso con las nuevas generaciones a través de su plataforma de sostenibilidad. La compañía continúa implementando iniciativas innovadoras que buscan crear un impacto positivo en las comunidades donde opera.

Durante el último año, Coca-Cola FEMSA ha invertido significativamente en programas educativos y de desarrollo juvenil. Estas iniciativas incluyen becas universitarias, programas de mentoría y talleres de emprendimiento dirigidos a jóvenes de entre 18 y 25 años.

"Nuestro objetivo es empoderar a las nuevas generaciones con las herramientas necesarias para construir un futuro próspero", declaró el director de Responsabilidad Social de la empresa. "Creemos firmemente que invertir en la juventud es invertir en el futuro de nuestras comunidades."

Los programas han beneficiado a más de 10,000 jóvenes en toda la región, con un enfoque particular en áreas rurales y comunidades de bajos recursos. La compañía planea expandir estas iniciativas durante los próximos cinco años.`,
        resumen:
          'Coca-Cola FEMSA reafirma su compromiso con las nuevas generaciones a través de programas educativos, becas y talleres de emprendimiento que han beneficiado a más de 10,000 jóvenes.',
        url_articulo:
          'http://vidadigital.com.pa/noticia/coca-cola-femsa-futuro-generaciones',
        autor: { id: '1', autor: 'Staff Vida Digital' },
        medio: { id: '1', url: 'Vida Digital (Online)' },
        tipo_articulo: { id: '1', nombre: 'Noticia' },
        fecha: '2024-01-15',
        programa: { id: '1', nombre: 'KOF' },
        state: true,
      };

      const mockKeywords: Keywords[] = [
        {
          id: '1',
          article_fragment: 'Coca-Cola FEMSA',
          start_index: 0,
          color: '#fbbf24',
        },
        {
          id: '2',
          article_fragment: 'sostenibilidad',
          start_index: 200,
          color: '#34d399',
        },
        {
          id: '3',
          article_fragment: 'nuevas generaciones',
          start_index: 150,
          color: '#60a5fa',
        },
      ];

      setArticle(mockArticle);
      setKeywords(mockKeywords);
    } catch (err) {
      setError('Error al cargar el artículo');
      console.error('Error fetching article:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchArticleData();
  }, [fetchArticleData]);

  const addFragment = (fragment: Omit<Fragment, 'id'>) => {
    const newFragment = { ...fragment, id: Date.now() };
    setFragments((prev) => [...prev, newFragment]);
  };

  const removeFragment = (fragmentId: number) => {
    setFragments((prev) => prev.filter((f) => f.id !== fragmentId));
  };

  const updateFragment = (fragmentId: number, updates: Partial<Fragment>) => {
    setFragments((prev) =>
      prev.map((f) => (f.id === fragmentId ? { ...f, ...updates } : f))
    );
  };

  return {
    article,
    keywords,
    fragments,
    isLoading,
    error,
    addFragment,
    removeFragment,
    updateFragment,
    refetch: fetchArticleData,
  };
};
