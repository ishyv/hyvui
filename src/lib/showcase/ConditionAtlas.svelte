<script lang="ts">
  import Label from "../components/primitives/Label.svelte";
  import ShowcaseShell from "./ShowcaseShell.svelte";
  import { listShowcaseFamily } from "./showcaseNavigation.js";
  import { getShowcaseManifest } from "./showcaseManifest.js";

  const manifest = getShowcaseManifest("system");
  const conditionIds = new Set([
    "drifting",
    "cooling",
    "forbidden",
    "gateway",
    "interrupted",
    "lost",
    "maintenance",
    "offline",
    "pending",
    "redirecting",
    "unauthorized",
  ]);
  const conditions = listShowcaseFamily("condition-atlas").filter(
    (route) => conditionIds.has(route.id),
  );

  const conditionMeta: Record<
    string,
    { code: string; status: string; tone: "signal" | "accent" | "muted" }
  > = {
    drifting: { code: "429", status: "cooldown", tone: "accent" },
    cooling: { code: "503", status: "recovery", tone: "accent" },
    forbidden: { code: "403", status: "boundary", tone: "muted" },
    gateway: { code: "502", status: "upstream lost", tone: "accent" },
    interrupted: { code: "500", status: "stopped", tone: "accent" },
    lost: { code: "404", status: "not found", tone: "muted" },
    maintenance: { code: "503", status: "under care", tone: "signal" },
    offline: { code: "n/a", status: "no link", tone: "accent" },
    pending: { code: "202", status: "queued", tone: "signal" },
    redirecting: { code: "301", status: "new path", tone: "signal" },
    unauthorized: { code: "401", status: "identity missing", tone: "accent" },
  };
</script>

{#if manifest}
  <ShowcaseShell manifest={manifest}>
    <main class="condition-atlas" data-condition-atlas>
      <section class="atlas-intro" aria-labelledby="atlas-title">
        <div>
          <Label color="signal">condition atlas / route states</Label>
          <h1 id="atlas-title">route states at the edge.</h1>
        </div>
        <p>
          eleven route states. each says what stopped, what remains, and where to
          go next.
        </p>
      </section>

      <ol class="condition-sequence">
        {#each conditions as condition, index}
          {@const meta = conditionMeta[condition.id]}
          <li>
            <a class="condition-entry" data-condition-entry href={condition.href}>
              <span class="condition-index">{String(index + 1).padStart(2, "0")}</span>
              <span class={`condition-code condition-code-${meta.tone}`}>
                {meta.code}
              </span>
              <span class="condition-mark" aria-hidden="true"></span>
              <span class="condition-copy">
                <span class="condition-status">{meta.status}</span>
                <strong>{condition.title}</strong>
                <span>{condition.premise}</span>
              </span>
              <span class="condition-cue">open / {condition.viewerRole}</span>
            </a>
          </li>
        {/each}
      </ol>

      <footer class="atlas-footer">
        <span>eleven route states / one vocabulary</span>
        <span>native links / next step named</span>
      </footer>
    </main>
  </ShowcaseShell>
{/if}

<style>
  .condition-atlas {
    min-width: 0;
    background:
      linear-gradient(
        90deg,
        color-mix(in srgb, var(--signal) 4%, transparent),
        transparent 36%
      ),
      var(--bg);
    color: var(--text);
  }

  .atlas-intro,
  .condition-sequence,
  .atlas-footer {
    width: min(100%, var(--shell-max));
    margin-inline: auto;
    padding-inline: var(--shell-pad);
  }

  .atlas-intro {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(16rem, 0.65fr);
    gap: var(--space-3xl);
    align-items: end;
    padding-block: clamp(var(--space-2xl), 8vw, var(--space-3xl));
    border-bottom: 1px solid var(--line);
  }

  .atlas-intro > div {
    min-width: 0;
  }

  .atlas-intro h1 {
    max-width: 10ch;
    margin: var(--space-md) 0 0;
    font-family: var(--font-body);
    font-size: clamp(var(--text-3xl), 6vw, var(--text-display));
    font-weight: 400;
    letter-spacing: -0.075em;
    line-height: 0.82;
  }

  .atlas-intro p {
    max-width: 26rem;
    margin: 0;
    color: var(--text-soft);
    font-family: var(--font-body);
    font-size: var(--text-md);
    line-height: 1.52;
  }

  .condition-sequence {
    position: relative;
    margin-block: var(--space-xl) 0;
    padding-block: 0;
    list-style: none;
  }

  .condition-sequence::before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(var(--shell-pad) + 6.2rem);
    border-left: 1px solid color-mix(in srgb, var(--signal) 25%, transparent);
    content: "";
  }

  .condition-sequence li {
    position: relative;
    border-top: 1px solid var(--line);
  }

  .condition-sequence li:last-child {
    border-bottom: 1px solid var(--line);
  }

  .condition-entry {
    display: grid;
    grid-template-columns: 2rem 4rem 1rem minmax(0, 1fr) minmax(12rem, 0.55fr);
    gap: var(--space-md);
    align-items: center;
    min-height: 7rem;
    padding-block: var(--space-md);
    color: inherit;
    text-decoration: none;
    transition: background-color var(--transition-fast);
  }

  .condition-entry:hover,
  .condition-entry:focus-visible {
    background: color-mix(in srgb, var(--signal) 6%, transparent);
    outline: none;
  }

  .condition-index,
  .condition-code,
  .condition-status,
  .condition-cue,
  .atlas-footer {
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .condition-index {
    color: var(--muted-strong);
  }

  .condition-code {
    color: var(--muted);
    font-size: var(--text-sm);
    letter-spacing: 0.04em;
  }

  .condition-code-accent {
    color: var(--accent);
  }

  .condition-code-signal {
    color: var(--signal);
  }

  .condition-mark {
    display: block;
    width: 0.55rem;
    height: 0.55rem;
    border: 1px solid var(--signal);
    background: var(--bg);
  }

  .condition-entry:hover .condition-mark,
  .condition-entry:focus-visible .condition-mark {
    border-color: var(--accent);
    background: var(--accent);
  }

  .condition-copy {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .condition-status {
    color: var(--muted);
  }

  .condition-copy strong {
    color: var(--text);
    font-family: var(--font-body);
    font-size: var(--text-xl);
    font-weight: 400;
    letter-spacing: -0.04em;
    line-height: 0.95;
  }

  .condition-copy > span:last-child {
    max-width: 34rem;
    color: var(--text-soft);
    font-family: var(--font-body);
    font-size: var(--text-sm);
    line-height: 1.35;
  }

  .condition-cue {
    color: var(--muted);
    line-height: 1.45;
  }

  .condition-entry:hover .condition-cue,
  .condition-entry:focus-visible .condition-cue {
    color: var(--signal);
  }

  .atlas-footer {
    display: flex;
    justify-content: space-between;
    gap: var(--space-lg);
    padding-block: var(--space-xl);
    color: var(--muted);
  }

  @media (max-width: 820px) {
    .atlas-intro {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .condition-entry {
      grid-template-columns: 2rem 4rem 1rem minmax(0, 1fr);
    }

    .condition-cue {
      grid-column: 4;
    }
  }

  @media (max-width: 560px) {
    .atlas-intro,
    .condition-sequence,
    .atlas-footer {
      padding-inline: var(--space-md);
    }

    .atlas-intro :global(.hyvui-label) {
      white-space: normal;
      overflow-wrap: anywhere;
    }

    .condition-sequence::before {
      left: calc(var(--space-md) + 5.4rem);
    }

    .condition-entry {
      grid-template-columns: 1.5rem 3rem 0.8rem minmax(0, 1fr);
      gap: var(--space-sm);
      min-height: 8rem;
    }

    .condition-copy strong {
      font-size: var(--text-lg);
    }

    .condition-cue {
      grid-column: 4;
    }

    .atlas-footer {
      flex-direction: column;
      gap: var(--space-xs);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .condition-entry {
      transition: none;
    }
  }
</style>
