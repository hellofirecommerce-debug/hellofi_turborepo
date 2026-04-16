/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hellofi-new.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
  transpilePackages: ["@repo/ui", "@repo/validations"],
};

export default nextConfig;
