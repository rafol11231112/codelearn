/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { dev, isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        minimizer: [
          ...config.optimization.minimizer || [],
        ],
      };
      
      config.devtool = false;
    }
    return config;
  },
}

module.exports = nextConfig

