import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iwalani Rosita | CSE (AI & ML) Student & Developer",
  description: "Portfolio of Iwalani Rosita, an Integrated M.Tech CSE (AI & ML) student at SRM University-AP exploring AI, full-stack development, and technology.",
  openGraph: {
    title: "Iwalani Rosita | CSE (AI & ML) Student & Developer",
    description: "A student developer exploring AI, full-stack development, and practical technology.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
