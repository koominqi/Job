---
name: FuturePath UI direction
description: User-requested layout and copy rules for the FuturePath site, plus the coupling between catalog skills and badge medals.
---

Keep every page clear and brief. The journey order lives only in the left sidebar. Do not add numbered step rails, explainer boxes or "automatically updated" banners. Questions and answers go in a collapsible section at the very bottom of each page, after the "Next" link. Do not use a named persona (the user asked to remove "Alex"). "Next" links follow the sidebar order, ending at Global Skills Tracker.

**Why:** The user explicitly asked for these changes (October 2026) after finding the guided layout repetitive and cluttered.

**How to apply:** New pages or guidance should follow the same pattern: header, content, Next link, FAQ. Background pathway re-planning stays silent; show only failures, with a Retry button.

Badges show one medal per skill, each with its own icon and colour, and no role lists two skills with the same colour. When adding a catalog skill or role, add or check the skill's medal style in the frontend badge component.

**Why:** The user found same-category medals repetitive.

**How to apply:** After changing the catalog, check that every skill has a medal style and that hues are unique within each role.
