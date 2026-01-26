import { computeSidebar } from "./compute-sidebar.ts"
import { computeApiDefinition } from './compute-api-definition.ts'
import { computeVersion } from "./compute-version.ts"

console.log("Compute started...")
computeSidebar()
computeApiDefinition()
computeVersion()
console.log("🎉 Compute done")