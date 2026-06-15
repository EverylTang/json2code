import PricingClient from "./client";

export const metadata = {
  title: "Pricing - CodeTools API",
  description: "CodeTools API pricing. 19 developer tools, one API key, 10,000 calls per month for $12.",
  keywords: ["codetools pricing", "developer tools api", "api plan", "online tools api"],
  openGraph: {
    title: "CodeTools API Pricing",
    description: "19 developer tools, one API key, $12 per month.",
    type: "website",
  },
};

export default function PricingPage() {
  return <PricingClient />;
}
