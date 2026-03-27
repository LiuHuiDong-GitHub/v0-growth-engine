/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 旧 URI 重定向到规范 URI（见 docs/URI_NAMING_GUIDELINES.md）
  async redirects() {
    return [
      { source: "/login", destination: "/auth/login", permanent: true },
      { source: "/register", destination: "/auth/register", permanent: true },
      {
        source: "/forgot-password",
        destination: "/auth/forgot-password",
        permanent: true,
      },
      {
        source: "/verify-email",
        destination: "/auth/verify-email",
        permanent: true,
      },
      { source: "/select-role", destination: "/auth/role", permanent: true },
      {
        source: "/blogger-dashboard",
        destination: "/creator/dashboard",
        permanent: true,
      },
      {
        source: "/blogger-verification",
        destination: "/creator/verification",
        permanent: true,
      },
      {
        source: "/select-product",
        destination: "/creator/products",
        permanent: true,
      },
      {
        source: "/creator/select-product",
        destination: "/creator/products",
        permanent: true,
      },
      {
        source: "/submit-video",
        destination: "/creator/videos/new",
        permanent: true,
      },
      {
        source: "/creator/submit-video",
        destination: "/creator/videos/new",
        permanent: true,
      },
      {
        source: "/blogger-video/:id",
        destination: "/videos/:id",
        permanent: true,
      },
      { source: "/my-product", destination: "/products", permanent: true },
      {
        source: "/upload-product",
        destination: "/products/upload",
        permanent: true,
      },
      { source: "/product/:id", destination: "/products/:id", permanent: true },
      {
        source: "/product-details/:id",
        destination: "/promotions/:id",
        permanent: true,
      },
      { source: "/my-promotions", destination: "/promotions", permanent: true },
      { source: "/message-board", destination: "/messages", permanent: true },
      {
        source: "/privacy-policy",
        destination: "/legal/privacy",
        permanent: true,
      },
      {
        source: "/terms-of-service",
        destination: "/legal/terms",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
