<script lang="ts">
  import Keeper from "$lib/examples/Keeper.svelte";
  import ShowcaseShell from "$lib/showcase/ShowcaseShell.svelte";
  import { getShowcaseManifest } from "$lib/showcase/showcaseManifest.js";

  const manifest = getShowcaseManifest("keeper");
</script>

<ShowcaseShell manifest={manifest!}>
  <Keeper />
</ShowcaseShell>
