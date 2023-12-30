/** @type {import('next').NextConfig} */
const dev = process.env.NODE_ENV === 'development';
const withPWA = require('next-pwa')({
  dest: 'public',
  // disable: dev ? true : false
});
const nextConfig = {
  images: {
  remotePatterns: [
      {
   protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
{
   protocol: 'https',
        hostname: 'drive-thirdparty.googleusercontent.com',
      }
    ]
  },
  reactStrictMode: true,
  swcMinify: true,
  
}

module.exports = withPWA(nextConfig);
