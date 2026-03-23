import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GainTrack GT',
    short_name: 'GainTrack',
    description: 'Tu tracker personal de fitness y nutrición',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#0A0A0A',
    background_color: '#0A0A0A',
    icons: [
      {
        src: '/icons/icon-180x180.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
