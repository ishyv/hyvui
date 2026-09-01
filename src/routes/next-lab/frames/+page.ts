import type { PageLoad } from "./$types.js";

export const load: PageLoad = () => ({
  entries: [
    { id: "arrival", label: "arrival" },
    { id: "departure", label: "departure" },
  ],
});
