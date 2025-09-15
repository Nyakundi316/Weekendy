// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**', // allow all Unsplash image paths
      },
      // add more if you’ll use them later:
      // { protocol: 'https', hostname: 'plus.unsplash.com', pathname: '/**' },
      // { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
