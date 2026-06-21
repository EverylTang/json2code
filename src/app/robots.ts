import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://codetools.cc";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/pricing", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
