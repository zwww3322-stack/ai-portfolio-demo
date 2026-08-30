import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://awinways.com"),
  title: "阿唯inways个人网站｜AI产品实践",
  description: "阿唯inways个人网站：记录AI产品实践、业务思考与持续探索。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "阿唯inways个人网站｜AI产品实践",
    description: "把复杂问题，做成可以体验的AI产品。",
    type: "website",
    locale: "zh_CN",
    images: [{ url: "/og.png", width: 1729, height: 910, alt: "阿唯inways个人网站：供需盯盘与策略中心" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "阿唯inways个人网站｜AI产品实践",
    description: "把复杂问题，做成可以体验的AI产品。",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
