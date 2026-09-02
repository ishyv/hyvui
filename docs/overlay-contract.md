# overlay contract

HyvUI overlays share one behavioral contract. Material can vary by theme, but dismissal, focus, source order, and scoped appearance do not.

## modal surfaces

`Modal` and `Drawer` render a native `<dialog>` and call `showModal()`. They must:

- expose an accessible name through `title`, `labelledBy`, or `ariaLabel`;
- expose an optional description through `describedBy`;
- close on native Escape through the `cancel` event;
- restore focus to the opener after close;
- lock document scrolling only while open;
- include safe-area padding for fixed edges;
- keep the dialog in the source order where it was authored;
- stop their opening animation under reduced motion.

`Drawer` adds side placement and constrained internal scrolling. Its backdrop is the dialog backdrop, not a second document-wide overlay.

## nonmodal surfaces

`Popover` is nonmodal. It uses Floating UI for anchored positioning and may be portalled to `document.body`. A portalled popover snapshots the nearest `AppearanceContext` from its anchor and applies the three appearance attributes to its own root.

It must:

- expose an explicit `role`;
- support `labelledBy` and `describedBy`;
- enter focus on open when requested;
- restore focus on close when requested;
- close on Escape and outside pointer input;
- stop positioning and remove listeners when closed or destroyed;
- tolerate an anchor disappearing during an asynchronous position update.

`DropdownMenu` is a menu-shaped popover. Its trigger exposes button semantics and its content uses `role="menu"`. A consumer remains responsible for menu item semantics when providing custom children.

## notifications

`Toast` is nonmodal, fixed, and live-announced. It never steals focus, traps the keyboard, or blocks pointer input outside the toast itself. Its status color is semantic and its motion has a reduced-motion fallback.

## authoring rule

Choose the least forceful overlay that expresses the relationship. Use a modal when the user must resolve a decision, a drawer when the document remains conceptually present beside a temporary panel, a popover for local context, and a toast for transient status. Do not recreate these behaviors with arbitrary fixed divs.
