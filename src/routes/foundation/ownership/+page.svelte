<script lang="ts">
  import { AppShell, Button, Label, Stack, Text } from "$lib/index.js";

  let nested = $state(true);
</script>

<AppShell weight="field-notebook" theme="hextech" grade="dailies">
  <main class="ownership-fixture" data-foundation-ownership>
    <Stack gap="var(--space-md)">
      <Label color="signal">ownership / document convenience</Label>
      <Text as="h1" variant="heading">the outer weather survives</Text>
      <Text>
        The nested shell owns only the channels it names. Removing it restores
        the outer shell, not an unrelated default.
      </Text>
      <Button
        id="foundation-toggle-owner"
        variant="ghost"
        onclick={() => (nested = !nested)}
      >
        {nested ? "release nested shell" : "mount nested shell"}
      </Button>
    </Stack>
  </main>

  {#if nested}
    <AppShell theme="arcane" vignette={false}>
      <div data-foundation-nested-owner aria-hidden="true"></div>
    </AppShell>
  {/if}
</AppShell>

<style>
  .ownership-fixture {
    width: min(100%, var(--shell-max));
    box-sizing: border-box;
    margin-inline: auto;
    padding: var(--space-scene) var(--shell-pad);
  }
</style>
