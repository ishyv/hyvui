import type { PageLoad } from "./$types.js";
import {
  biomeHybridProofs,
  biomeProofs,
  getBiomeProof,
  resolveBiomeHybridProof,
} from "$lib/next-experiments/biomeGallery.js";

const hybridIds = [
  ...biomeHybridProofs.map((proof) => proof.id),
  "object-poetry-diagnostic",
];

export const load: PageLoad = ({ url }) => {
  const focused = getBiomeProof(url.searchParams.get("biome"));
  const proofs = focused ? [focused] : biomeProofs;
  const hybrids = hybridIds.map((id) => {
    const proof = resolveBiomeHybridProof(id);
    if (!proof) throw new Error(`missing hybrid proof: ${id}`);
    return proof;
  });

  return {
    proofs,
    index: biomeProofs,
    focusedId: focused?.id ?? null,
    hybrids,
  };
};
