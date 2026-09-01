<script lang="ts">
  import Bridge from "$lib/examples/Bridge.svelte";
  import ShowcaseShell from "$lib/showcase/ShowcaseShell.svelte";
  import { getShowcaseManifest } from "$lib/showcase/showcaseManifest.js";

  const manifest = getShowcaseManifest("bridge");
</script>

<ShowcaseShell manifest={manifest!}>
  <Bridge />
</ShowcaseShell>
