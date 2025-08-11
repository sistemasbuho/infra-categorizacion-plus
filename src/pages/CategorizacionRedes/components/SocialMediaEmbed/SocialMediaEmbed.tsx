import {
  FacebookEmbed,
  InstagramEmbed,
  LinkedInEmbed,
  PinterestEmbed,
  TikTokEmbed,
  XEmbed,
  YouTubeEmbed,
} from 'react-social-media-embed';
import { useTheme } from '../../../../shared/context/ThemeContext';

interface SocialMediaEmbedProps {
  url: string;
  redSocial: string;
}

export const SocialMediaEmbed: React.FC<SocialMediaEmbedProps> = ({
  url,
  redSocial,
}) => {
  const { theme } = useTheme();

  const detectSocialMedia = (url: string, redSocial: string) => {
    const lowerUrl = url.toLowerCase();
    const lowerRedSocial = redSocial.toLowerCase();

    if (
      lowerRedSocial.includes('twitter') ||
      lowerRedSocial.includes('x') ||
      lowerUrl.includes('twitter.com') ||
      lowerUrl.includes('x.com')
    ) {
      return 'twitter';
    }
    if (
      lowerRedSocial.includes('facebook') ||
      lowerUrl.includes('facebook.com')
    ) {
      return 'facebook';
    }
    if (
      lowerRedSocial.includes('instagram') ||
      lowerUrl.includes('instagram.com')
    ) {
      return 'instagram';
    }
    if (
      lowerRedSocial.includes('linkedin') ||
      lowerUrl.includes('linkedin.com')
    ) {
      return 'linkedin';
    }
    if (lowerRedSocial.includes('tiktok') || lowerUrl.includes('tiktok.com')) {
      return 'tiktok';
    }
    if (
      lowerRedSocial.includes('pinterest') ||
      lowerUrl.includes('pinterest.com')
    ) {
      return 'pinterest';
    }
    if (
      lowerRedSocial.includes('youtube') ||
      lowerUrl.includes('youtube.com') ||
      lowerUrl.includes('youtu.be')
    ) {
      return 'youtube';
    }

    return 'unknown';
  };

  const socialMediaType = detectSocialMedia(url, redSocial);

  const renderEmbed = () => {
    const spanishPlaceholder = () => (
      <div
        className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg"
        style={{
          backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
          borderColor: theme === 'dark' ? '#6b7280' : '#d1d5db',
          color: theme === 'dark' ? '#d1d5db' : '#374151',
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current mx-auto mb-3"></div>
          <p className="text-sm">Cargando publicación de {redSocial}...</p>
        </div>
      </div>
    );

    const commonProps = {
      url,
      width: '100%',
      embedPlaceholder: spanishPlaceholder(),
    };

    try {
      switch (socialMediaType) {
        case 'twitter':
          return <XEmbed {...commonProps} />;

        case 'facebook':
          return <FacebookEmbed {...commonProps} />;

        case 'instagram':
          return <InstagramEmbed {...commonProps} />;

        case 'linkedin':
          return <LinkedInEmbed {...commonProps} />;

        case 'tiktok':
          return <TikTokEmbed {...commonProps} />;

        case 'pinterest':
          return <PinterestEmbed {...commonProps} />;

        case 'youtube':
          return <YouTubeEmbed {...commonProps} height={315} />;

        default:
          return (
            <div
              className="p-6 border rounded-lg text-center"
              style={{
                backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                color: theme === 'dark' ? '#ffffff' : '#111827',
              }}
            >
              <p className="mb-2">
                <strong>Red Social:</strong> {redSocial}
              </p>
              <p className="mb-4 text-sm opacity-75">
                Tipo de publicación no compatible con vista previa automática
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
              >
                Ver publicación original
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          );
      }
    } catch (error) {
      console.error('Error al renderizar embed:', error);
      return (
        <div
          className="p-6 border rounded-lg text-center"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
            borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          <p className="mb-2">❌ Error al cargar el embed</p>
          <p className="mb-4 text-sm opacity-75">
            No se pudo cargar la publicación de {redSocial}
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
          >
            Ver publicación original
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      );
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Vista Previa de la Publicación
        </h3>
        <span
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: theme === 'dark' ? '#1f2937' : '#f3f4f6',
            color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          }}
        >
          {redSocial} • {socialMediaType}
        </span>
      </div>

      <div className="flex justify-center">
        <div style={{ maxWidth: '550px', width: '100%' }}>{renderEmbed()}</div>
      </div>
    </div>
  );
};
