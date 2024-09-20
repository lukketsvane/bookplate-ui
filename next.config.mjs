/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // This will disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@radix-ui/react-icons': '@radix-ui/react-icons/dist/react-icons.cjs.js',
    };
    return config;
  },
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/rapier'],
};

export default nextConfig;