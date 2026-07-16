/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "hellofi-new.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
