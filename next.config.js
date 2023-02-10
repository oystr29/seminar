/** @type {import('next').NextConfig} */
const dev = process.env.NODE_ENV === 'development';
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: dev ? true : false
});
const nextConfig = {
  experimental: {
    appDir: true
  },
  reactStrictMode: true,
  swcMinify: true,

}

module.exports = withPWA(nextConfig);
