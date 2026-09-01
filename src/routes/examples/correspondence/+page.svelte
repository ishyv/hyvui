<script lang="ts">
  import Correspondence from "$lib/examples/Correspondence.svelte";
  import ShowcaseShell from "$lib/showcase/ShowcaseShell.svelte";
  import { getShowcaseManifest } from "$lib/showcase/showcaseManifest.js";

  const manifest = getShowcaseManifest("correspondence");
</script>

<ShowcaseShell manifest={manifest!}>
  <Correspondence />
</ShowcaseShell>
