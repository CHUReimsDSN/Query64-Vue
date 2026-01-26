import fs from "fs";

export function computeVersion() {
  const packageJsonPath = '../package.json'
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const fileToWritePath = ".vitepress/generated/version.ts";
  const fileContent = `export const version = '${packageJson.version}'`;
  
  fs.writeFileSync(fileToWritePath, fileContent);
  console.log("✅ Version computed");
}
