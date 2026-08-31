import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PressWork',
    short_name: 'PressWork',
    description: 'Printing Press Work & Finance Management',
    start_url: '/',
    display: 'standalone',
    background_color: '#F9F9F8',
    theme_color: '#F9F9F8',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
