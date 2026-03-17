// primitives
export { default as Text } from './components/primitives/Text.svelte';
export { default as Label } from './components/primitives/Label.svelte';
export { default as Icon } from './components/primitives/Icon.svelte';
export { default as Divider } from './components/primitives/Divider.svelte';
export { default as Surface } from './components/primitives/Surface.svelte';

// inputs
export { default as Button } from './components/inputs/Button.svelte';
export { default as Input } from './components/inputs/Input.svelte';
export { default as Textarea } from './components/inputs/Textarea.svelte';
export { default as Select } from './components/inputs/Select.svelte';
export { default as Checkbox } from './components/inputs/Checkbox.svelte';
export { default as Toggle } from './components/inputs/Toggle.svelte';
export { default as FileUpload } from './components/inputs/FileUpload.svelte';

// feedback
export { default as Toast } from './components/feedback/Toast.svelte';
export { toastStore } from './components/feedback/Toast.svelte';
export { default as Alert } from './components/feedback/Alert.svelte';
export { default as Skeleton } from './components/feedback/Skeleton.svelte';
export { default as StatusDot } from './components/feedback/StatusDot.svelte';
export { default as StatusLine } from './components/feedback/StatusLine.svelte';
export { default as EmptyState } from './components/feedback/EmptyState.svelte';
export { default as ErrorState } from './components/feedback/ErrorState.svelte';

// layout
export { default as Stack } from './components/layout/Stack.svelte';
export { default as Grid } from './components/layout/Grid.svelte';
export { default as Card } from './components/layout/Card.svelte';
export { default as Panel } from './components/layout/Panel.svelte';
export { default as Modal } from './components/layout/Modal.svelte';
export { default as Drawer } from './components/layout/Drawer.svelte';
export { default as Popover } from './components/layout/Popover.svelte';

// navigation
export { default as Topbar } from './components/navigation/Topbar.svelte';
export { default as SidebarNav } from './components/navigation/SidebarNav.svelte';
export { default as Tabs } from './components/navigation/Tabs.svelte';
export { default as Breadcrumb } from './components/navigation/Breadcrumb.svelte';
export { default as DropdownMenu } from './components/navigation/DropdownMenu.svelte';

// display
export { default as Badge } from './components/display/Badge.svelte';
export { default as Avatar } from './components/display/Avatar.svelte';
export { default as Table } from './components/display/Table.svelte';
export { default as CodeBlock } from './components/display/CodeBlock.svelte';
export { default as MetricCard } from './components/display/MetricCard.svelte';
export { default as Blockquote } from './components/display/Blockquote.svelte';

// ambient
export { default as GridOverlay } from './components/ambient/GridOverlay.svelte';
export { default as CornerBrackets } from './components/ambient/CornerBrackets.svelte';
export { default as ScanBand } from './components/ambient/ScanBand.svelte';
export { default as Vignette } from './components/ambient/Vignette.svelte';
export { default as ParallaxLayer } from './components/ambient/ParallaxLayer.svelte';

// patterns
export { default as PageHeader } from './components/patterns/PageHeader.svelte';
export { default as ConfirmDialog } from './components/patterns/ConfirmDialog.svelte';
export { default as SearchBar } from './components/patterns/SearchBar.svelte';
export { default as TerminalBoot } from './components/patterns/TerminalBoot.svelte';
export { default as ActionBar } from './components/patterns/ActionBar.svelte';
export { default as Manifesto } from './components/patterns/Manifesto.svelte';
export { default as ChapterMark } from './components/patterns/ChapterMark.svelte';
export { default as PullQuote } from './components/patterns/PullQuote.svelte';
export { default as ShowcaseFrame } from './components/patterns/ShowcaseFrame.svelte';
export { default as DepthPortal } from './components/patterns/DepthPortal.svelte';

// system — shell
export { default as AppShell } from './components/system/AppShell.svelte';

// tokens
export { tokens, themeClasses } from './tokens/tokens.js';

// system — register
export { applyRegister, clearRegister, registers } from './system/register.js';
export type { Register } from './system/register.js';

// system — expressions
export type { Expression } from './components/primitives/text.js';

// system — actions
export { surface } from './system/actions/surface.js';
export { echo } from './system/actions/echo.js';
export { reveal } from './system/actions/reveal.js';
export { resolve } from './system/actions/resolve.js';
export type { ResolveStatus } from './system/actions/resolve.js';

// depth system
export { default as DepthStage } from './components/depth/DepthStage.svelte';
export { default as FloatCard } from './components/depth/FloatCard.svelte';
export { default as HorizonGrid } from './components/depth/HorizonGrid.svelte';
export { default as DepthLayer } from './components/depth/DepthLayer.svelte';
export { default as Plinth } from './components/depth/Plinth.svelte';
export { tiltTransform, depthZ } from './system/depth/depth.js';
export type { DepthLevel, PerspectivePreset } from './system/depth/depth.js';

// new ambient ornaments
export { default as SignalRing } from './components/ambient/SignalRing.svelte';
export { default as GlyphMark } from './components/ambient/GlyphMark.svelte';
export { default as DataStream } from './components/ambient/DataStream.svelte';
export { default as ThreadLine } from './components/ambient/ThreadLine.svelte';

// scenes
export { default as NarrativeScene } from './components/scenes/NarrativeScene.svelte';
export { default as ReadoutScene } from './components/scenes/ReadoutScene.svelte';
export { default as StageScene } from './components/scenes/StageScene.svelte';
export { default as ArchiveScene } from './components/scenes/ArchiveScene.svelte';
export { default as LogScene } from './components/scenes/LogScene.svelte';
export { default as DepthScene } from './components/scenes/DepthScene.svelte';
