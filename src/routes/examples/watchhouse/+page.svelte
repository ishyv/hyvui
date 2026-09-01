<script lang="ts">
  import Watchhouse from "$lib/examples/Watchhouse.svelte";
  import ShowcaseShell from "$lib/showcase/ShowcaseShell.svelte";
  import { getShowcaseManifest } from "$lib/showcase/showcaseManifest.js";

  const manifest = getShowcaseManifest("watchhouse");
</script>

<ShowcaseShell manifest={manifest!}>
  <Watchhouse />
</ShowcaseShell>
