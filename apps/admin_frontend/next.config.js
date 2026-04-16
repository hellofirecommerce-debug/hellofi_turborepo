/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hellofi-new.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "d2mtboq75bgsvj.cloudfront.net", // ← add this
      },
    ],
  },
  transpilePackages: ["@repo/ui", "@repo/validations"],
};

export default nextConfig;
