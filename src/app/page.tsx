import { readFileSync } from "node:fs";
import path from "node:path";
import Script from "next/script";

// The page markup lives in src/site/body.html so the design can be edited as plain HTML.
// It is read at build time; the interactive behaviour lives in public/site.js.
const markup = readFileSync(path.join(process.cwd(), "src/site/body.html"), "utf8");

export default function Home() {
  return (
    <>
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: markup }} />
      <Script src="/site.js" strategy="afterInteractive" />
    </>
  );
}
