import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "张唯个人AI作品集｜AI产品实践",
  description: "张唯的AI产品作品集：供需盯盘与策略中心，展示复杂业务理解、AI产品落地与量化提效成果。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "张唯个人AI作品集｜AI产品实践",
    description: "把复杂业务经验，变成真正能用的AI产品。",
    type: "website",
    locale: "zh_CN",
    images: [{ url: "/og.png", width: 1729, height: 910, alt: "张唯个人AI作品集：供需盯盘与策略中心" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "张唯个人AI作品集｜AI产品实践",
    description: "把复杂业务经验，变成真正能用的AI产品。",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
