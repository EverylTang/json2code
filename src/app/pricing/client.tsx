"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

const copy = {
  en: {
    breadcrumbHome: "Home",
    title: "Simple pricing. One plan.",
    subtitle: "19 developer tools as REST APIs. One subscription covers them all.",
    body: "Stop opening web pages to copy-paste utility results. Call the same tools from scripts, CI jobs, and backend workflows.",
    primaryCta: "Browse tools",
    secondaryCta: "View API docs",
    freeTitle: "Free",
    freePrice: "$0",
    freePeriod: "forever",
    freeDesc: "All web tools stay free and run in your browser. No account needed.",
    apiTitle: "API Plan",
    apiPrice: "$12",
    apiPeriod: "per month",
    apiDesc: "One key for every CodeTools REST API. Cancel anytime.",
    planned: "Coming soon",
    startSoon: "Payment will open once the API backend is live. Get notified when ready.",
    allToolsTitle: "Every tool has an API endpoint",
    useCasesTitle: "Use cases",
    useCasesSub: "Real scenarios where the API saves time",
    compareTitle: "How it compares",
    freeFeatures: [
      "19 browser tools",
      "No account required",
      "Client-side processing",
      "Ad-supported",
    ],
    apiFeatures: [
      "19 REST APIs",
      "10,000 calls / month",
      "Shared quota across all tools",
      "API key access",
      "No ads while signed in",
    ],
    allTools: [
      { cat: "Encoding & Hashing", items: ["Base64 encode/decode", "URL encode/decode", "Hash (MD5/SHA1/SHA256/384/512)", "HMAC signature"] },
      { cat: "Generators", items: ["UUID v4/v7", "Password generator", "QR code generator", "RSA key pair"] },
      { cat: "Formatting & Analysis", items: ["JSON formatter/validator", "Word counter", "Color converter", "Regex tester"] },
      { cat: "Developer Utilities", items: ["Timestamp converter", "Currency converter", "Cron expression", "Markdown preview"] },
      { cat: "Payment & Finance", items: ["Payment webhook simulator", "Acquiring margin calculator"] },
      { cat: "Network & Tunnel", items: ["frp tunnel config generator"] },
    ],
    useCases: [
      ["CI/CD automation", "Generate HMAC signatures or fresh UUIDs inside deployment scripts without opening a browser."],
      ["Test data generation", "Create passwords, QR codes, and UUIDs for automated test suites on the fly."],
      ["Payment integration", "Simulate signed webhook callbacks and calculate acquiring margins without manual work."],
    ],
    compare: [
      ["Postman", "$14/mo", "API debugging client"],
      ["ngrok", "$8/mo", "Tunnel / localhost expose"],
      ["CodeTools API", "$12/mo", "19 utility APIs"],
    ],
  },
  zh: {
    breadcrumbHome: "首页",
    title: "简洁定价。一个方案。",
    subtitle: "19 个开发者工具的 REST API。一个订阅全部可用。",
    body: "不用再打开网页复制粘贴。把同一批工具接进脚本、CI 流水线和后端工作流。",
    primaryCta: "浏览工具",
    secondaryCta: "查看 API 文档",
    freeTitle: "Free",
    freePrice: "$0",
    freePeriod: "长期免费",
    freeDesc: "网页版工具全部免费，在浏览器中运行，无需注册。",
    apiTitle: "API Plan",
    apiPrice: "$12",
    apiPeriod: "每月",
    apiDesc: "一个 Key 调用全部 CodeTools REST API。随时取消。",
    planned: "即将上线",
    startSoon: "API 后端上线后开放购买入口。上线后第一时间通知你。",
    allToolsTitle: "每个工具都有 API 接口",
    useCasesTitle: "使用场景",
    useCasesSub: "API 在真实场景中帮你节省时间",
    compareTitle: "对比同类工具",
    freeFeatures: [
      "19 个网页版工具",
      "无需注册",
      "浏览器端计算",
      "广告支持",
    ],
    apiFeatures: [
      "19 个 REST API",
      "每月 10,000 次调用",
      "所有工具共享额度",
      "API Key 访问",
      "登录后无广告",
    ],
    allTools: [
      { cat: "编码与哈希", items: ["Base64 编解码", "URL 编解码", "哈希 (MD5/SHA1/256/384/512)", "HMAC 签名"] },
      { cat: "生成器", items: ["UUID v4/v7", "密码生成器", "二维码生成器", "RSA 密钥对"] },
      { cat: "格式化与分析", items: ["JSON 格式化/验证", "文字计数器", "颜色转换", "正则测试"] },
      { cat: "开发工具", items: ["时间戳转换", "汇率换算器", "Cron 表达式", "Markdown 预览"] },
      { cat: "支付与金融", items: ["支付回调模拟器", "收单分润计算器"] },
      { cat: "网络与隧道", items: ["frp 隧道配置生成器"] },
    ],
    useCases: [
      ["CI/CD 自动化", "在部署脚本里生成 HMAC 签名或 UUID，不用打开浏览器。"],
      ["测试数据生成", "为自动化测试套件动态创建密码、二维码和 UUID。"],
      ["支付集成", "模拟带签名的 Webhook 回调，计算收单分润，无需手动操作。"],
    ],
    compare: [
      ["Postman", "$14/月", "API 调试客户端"],
      ["ngrok", "$8/月", "隧道/本地服务暴露"],
      ["CodeTools API", "$12/月", "19 个工具 API"],
    ],
  },
} as const;

const curlExample = `curl -X POST https://api.codetools.cc/v1/sign \\
  -H "Authorization: Bearer ct_key_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{"algorithm":"HMAC-SHA256","key":"sk_test_xxx","message":"order=123&amount=99.99"}'`;

export default function PricingClient() {
  const { locale, t } = useI18n();
  const c = copy[locale];

  return (
    <div className="flex-1 bg-white dark:bg-gray-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-16">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <Link href="/" className="hover:text-blue-500 transition-colors">{c.breadcrumbHome}</Link>
          <span>/</span>
          <span className="text-gray-600 dark:text-gray-300">{t.pricing}</span>
        </div>

        {/* Hero */}
        <section className="text-center max-w-3xl mx-auto">
          <p className="mb-4 inline-block rounded-md border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
            {c.planned}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            {c.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            {c.subtitle}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {c.body}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/tools"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:translate-y-px shadow-sm"
            >
              {c.primaryCta} &rarr;
            </Link>
            <Link
              href="/docs/api"
              className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 active:translate-y-px dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
            >
              {c.secondaryCta}
            </Link>
          </div>
        </section>

        {/* Plan Cards */}
        <section className="mt-12 grid gap-6 lg:grid-cols-2 max-w-4xl mx-auto">
          <PlanCard
            title={c.freeTitle}
            price={c.freePrice}
            period={c.freePeriod}
            description={c.freeDesc}
            features={c.freeFeatures}
          />
          <PlanCard
            featured
            title={c.apiTitle}
            price={c.apiPrice}
            period={c.apiPeriod}
            description={c.apiDesc}
            features={c.apiFeatures}
          />
        </section>

        {/* Curl Example */}
        <section className="mt-12 max-w-3xl mx-auto">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-gray-400 ml-2">api call example</span>
            </div>
            <pre className="overflow-x-auto text-xs font-mono leading-relaxed text-gray-100 bg-gray-950 rounded-lg p-4">
              {curlExample}
            </pre>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">{c.startSoon}</p>
          </div>
        </section>

        {/* All Tools Grid */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">{c.allToolsTitle}</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
            {locale === "zh" ? "每个工具都提供 REST API 接口，一个 Key 全部可用" : "Every tool exposes a REST API endpoint with the same API key"}
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {c.allTools.map((group) => (
              <div key={group.cat} className="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  {group.cat}
                </h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
                      <span className="text-blue-500 text-xs">▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">{c.useCasesTitle}</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">{c.useCasesSub}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-4xl mx-auto">
            {c.useCases.map(([title, desc]) => (
              <div key={title} className="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Compare */}
        <section className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">{c.compareTitle}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {c.compare.map(([name, price, value]) => (
              <div
                key={name}
                className={`rounded-xl p-5 ${
                  name === "CodeTools API"
                    ? "bg-blue-50 ring-1 ring-blue-200 dark:bg-blue-950/30 dark:ring-blue-900"
                    : "border border-gray-200 dark:border-gray-800"
                }`}
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</p>
                <p className={`mt-2 font-mono text-2xl font-bold ${name === "CodeTools API" ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"}`}>
                  {price}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{value}</p>
                {name === "CodeTools API" && (
                  <p className="mt-3 text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {locale === "zh" ? "性价比最高" : "Best value"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {locale === "zh" ? "随时可以开始。网页版免费，API 版 $12/月。" : "Start anytime. Web tools are free. API plan is $12/month."}
          </p>
          <Link
            href="/tools"
            className="inline-block rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:translate-y-px shadow-sm"
          >
            {c.primaryCta} &rarr;
          </Link>
        </section>
      </div>
    </div>
  );
}

function PlanCard({
  title,
  price,
  period,
  description,
  features,
  featured = false,
}: {
  title: string;
  price: string;
  period: string;
  description: string;
  features: readonly string[];
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-6 ${
        featured
          ? "border-2 border-blue-500 bg-blue-50/70 shadow-lg dark:border-blue-400 dark:bg-blue-950/30"
          : "border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className="text-right shrink-0">
          <p className={`font-mono text-3xl font-bold ${featured ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"}`}>
            {price}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{period}</p>
        </div>
      </div>
      <div className="mt-5 space-y-2">
        {features.map((feature) => (
          <div key={feature} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <span className={`text-xs ${featured ? "text-blue-500" : "text-gray-400"}`}>✓</span>
            {feature}
          </div>
        ))}
      </div>
    </div>
  );
}