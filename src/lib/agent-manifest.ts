// The public barrel exposes discovery data only. The renderer, resolver, and
// experimental composition modules remain private implementation details.
export { getAgentManifest } from "./next-experiments/capabilities.js";
export type { AgentManifest } from "./next-experiments/capabilities.js";
