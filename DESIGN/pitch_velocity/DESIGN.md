# Design System Documentation: The Kinetic Terminal

## 1. Overview & Creative North Star
**Creative North Star: The Kinetic Terminal**
This design system is engineered to bridge the gap between high-frequency data and elite editorial aesthetics. We are moving away from the "generic sportsbook" look toward a "dev-built," high-performance command center. The aesthetic is inspired by tactical military interfaces and premium automotive cockpits—precise, dark-mode centric, and undeniably fast.

To break the "template" look, we utilize **intentional asymmetry**. Live match scores shouldn't just sit in a grid; they should feel like floating modules of intelligence. We use overlapping elements (e.g., player stats slightly bleeding over team logos) and a high-contrast typography scale to create a sense of depth and urgency.

## 2. Colors
Our palette is rooted in the deep midnight of the pitch at night, punctuated by the "electric turf" glow of our primary green.

*   **Primary (`#9cff93`):** This is our "Action Signal." Use it sparingly for active live scores, primary CTAs, and critical "In-Play" indicators.
*   **Surface Hierarchy (`#0c0e0f` to `#232628`):** We use the Material surface-container tiers to define importance.
*   **The "No-Line" Rule:** We do not use 1px solid borders to section off content. Boundaries must be defined solely through background color shifts. For example, a match card (`surface-container-high`) should sit on a section background of `surface-container-low`. The eye should perceive the change in depth through tone, not lines.
*   **The Glass & Gradient Rule:** To achieve the "high-performance" feel, use Glassmorphism for floating overlays (e.g., navigation bars or player modals). Use semi-transparent versions of `surface-container` with a `backdrop-blur` of 12px-20px. 
*   **Signature Textures:** Main CTAs should utilize a subtle linear gradient from `primary` (`#9cff93`) to `primary-container` (`#00fc40`) at a 135-degree angle to provide visual "soul" and a sense of forward motion.

## 3. Typography
Typography is the backbone of our "athletic-tech" identity.

*   **Display & Headlines (Space Grotesk):** This font provides the "tech-forward" edge. Its idiosyncratic letterforms feel engineered. Use `display-lg` for hero scorelines and `headline-md` for league titles.
*   **Body & Titles (Inter):** The workhorse. We use Inter for team names, match commentary, and news snippets to ensure maximum readability against dark backgrounds. 
*   **Labels (Lexend):** Used specifically for technical data points (xG, Possession %, KM covered). Lexend’s geometric clarity makes small-scale data instantly digestible.
*   **Hierarchy:** Use extreme scale differences. A `display-lg` score should sit near a `label-sm` timestamp to create a sophisticated, editorial tension.

## 4. Elevation & Depth
In this design system, depth is a functional tool, not just an ornament.

*   **The Layering Principle:** Stacking surface-container tiers is our primary method of organization.
    *   *Level 0:* `background` (#0c0e0f) - The base "pitch."
    *   *Level 1:* `surface-container-low` (#111415) - Large content sections.
    *   *Level 2:* `surface-container-highest` (#232628) - Individual match cards or interactive modules.
*   **Ambient Shadows:** When an element must "float" (like a predictive pop-up), use a shadow with a 32px blur, 0% spread, and 6% opacity. The shadow color must be a tinted version of `on-surface` (#f6f6f7) to mimic an ambient glow rather than a muddy black shadow.
*   **The "Ghost Border" Fallback:** If accessibility requires a container definition, use the `outline-variant` (#464849) at 15% opacity. It should be felt, not seen.
*   **Glassmorphism:** For the "dev-built" feel, use `surface-bright` (#292c2e) at 60% opacity with a heavy blur for top-level navigation. This allows the vibrant team colors and live data to "bleed" through as the user scrolls.

## 5. Components

### Buttons
*   **Primary:** `primary` (#9cff93) background with `on-primary` (#006413) text. Use `rounded-md` (0.375rem). Use the signature gradient on hover.
*   **Secondary:** `secondary-container` (#3c475d) with `on-secondary-container` (#c5d0ec). No border.
*   **Tertiary:** Transparent background, `primary` text, no border. Use for "View All Stats."

### Chips (Live Indicators)
*   **Live Match Chip:** `error_container` (#9f0519) background with `on-error-container` (#ffa8a3) text. Apply a subtle pulse animation to the background color.
*   **Stat Chip:** `surface-variant` (#232628) background with `label-md` typography.

### Cards & Lists
*   **The "No Divider" Rule:** Never use lines to separate list items. Use a `spacing-4` (0.9rem) vertical gap or a subtle toggle between `surface-container-low` and `surface-container-highest` backgrounds.
*   **Data Density:** Match cards should utilize `lexend` for secondary data. Group related data (e.g., Shots, Shots on Target) into "data clusters" using `spacing-2` (0.4rem).

### Specific App Components
*   **The "Momentum Tracker":** A custom sparkline component using a `primary` to `primary_dim` gradient stroke to show which team is dominating possession in real-time.
*   **The "Pitch View":** A glassmorphism overlay used for tactical line-ups, where the field is a subtle gradient from `surface` to `on_primary_fixed` (#00440a).

## 6. Do's and Don'ts

### Do:
*   Use `spacing-10` and `spacing-12` for generous section breathing room; let the data breathe.
*   Use `primary_fixed_dim` for icons that accompany important alerts.
*   Ensure all "Interactive" states use the `primary` color as a focus ring or underline.
*   Use `rounded-xl` for large feature cards to give them a premium, modern feel.

### Don't:
*   **Don't** use pure white (#ffffff). Use `on_surface` (#f6f6f7) to prevent eye strain in dark mode.
*   **Don't** use 1px borders to separate scores. Use `surface` color shifts.
*   **Don't** use "Standard" easing. All transitions (hover, card expansion) must use a "Power4.out" or "Expo.out" feel—snappy start, smooth finish.
*   **Don't** crowd the display. If a screen feels busy, increase the spacing scale instead of adding more lines.