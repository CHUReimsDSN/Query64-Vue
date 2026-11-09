import {
  computeSidebar,
  computeVersion,
  computeApiDefinition,
  computeIndexMd,
} from "vitepress-bigbang/scripts";

console.log("Compute started...");
computeApiDefinition();
computeSidebar();
computeVersion({ mode: "package.json", fileToReadPath: '../package.json' });
computeIndexMd();
console.log("🎉 Compute done");
