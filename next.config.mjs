/** @type {import('next').NextConfig} */
const isPages = process.env.GITHUB_PAGES === "true";
const repoBase = "/BizLaunch";

const config = isPages
  ? {
      output: "export",
      trailingSlash: true,
      images: { unoptimized: true },
      basePath: repoBase,
      assetPrefix: `${repoBase}/`,
    }
  : {};

export default config;
