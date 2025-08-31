import * as Colors from '@tamagui/colors'
import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder'

/**
 * This is the default config v4 definitions.
 *   - uses shorthands v4
 *   - uses tokens v4 which are mostly the same as v3
 */

// Themes:

/**
 * PALETTE SYSTEM EXPLAINED:
 * Tamagui uses a 12-step palette system where each position has semantic meaning:
 * 
 * Positions 1-3: Background colors (lightest backgrounds to slightly darker)
 *   - color1: Main background (cards, surfaces)
 *   - color2: Subtle background (hover states)
 *   - color3: UI element background (borders, dividers)
 * 
 * Positions 4-8: Interactive/component colors (progressively stronger)
 *   - color4-5: Disabled states, subtle borders
 *   - color6-7: Hovered elements, active borders
 *   - color8: Pressed/active states
 * 
 * Positions 9-12: Foreground/text colors (progressively higher contrast)
 *   - color9: Solid backgrounds, primary actions
 *   - color10: Hovered solid backgrounds
 *   - color11: Low contrast text
 *   - color12: High contrast text (primary text)
 * 
 * This consistent mapping means components can use color6 for borders,
 * color9 for buttons, color12 for text, etc., and it works across all themes!
 */

const darkPalette = [
  '#050505',  // [0] color1: Darkest background
  '#151515',  // [1] color2: Slightly lighter background
  '#191919',  // [2] color3: Card/surface background
  '#232323',  // [3] color4: Subtle borders
  '#282828',  // [4] color5: Element backgrounds
  '#323232',  // [5] color6: Interactive borders
  '#424242',  // [6] color7: Hovered borders
  '#494949',  // [7] color8: Active/pressed states
  '#545454',  // [8] color9: Solid elements
  '#626262',  // [9] color10: Hovered solid elements
  '#a5a5a5',  // [10] color11: Muted text
  '#fff',     // [11] color12: Primary text
]

const lightPalette = [
  '#fff',                // [0] color1: Pure white background
  '#f2f2f2',            // [1] color2: Slightly gray background
  'hsl(0, 0%, 93%)',    // [2] color3: Light gray surface
  'hsl(0, 0%, 91%)',    // [3] color4: Subtle borders
  'hsl(0, 0%, 88%)',    // [4] color5: Element backgrounds
  'hsl(0, 0%, 85%)',    // [5] color6: Interactive borders
  'hsl(0, 0%, 82%)',    // [6] color7: Hovered borders
  'hsl(0, 0%, 76%)',    // [7] color8: Active/pressed states
  'hsl(0, 0%, 56%)',    // [8] color9: Solid elements
  'hsl(0, 0%, 50%)',    // [9] color10: Hovered solid elements
  'hsl(0, 0%, 42%)',    // [10] color11: Secondary text
  'hsl(0, 0%, 9%)',     // [11] color12: Primary text (near black)
]

const lightShadows = {
  shadow1: 'rgba(0,0,0,0.04)',
  shadow2: 'rgba(0,0,0,0.08)',
  shadow3: 'rgba(0,0,0,0.16)',
  shadow4: 'rgba(0,0,0,0.24)',
  shadow5: 'rgba(0,0,0,0.32)',
  shadow6: 'rgba(0,0,0,0.4)',
}

const darkShadows = {
  shadow1: 'rgba(0,0,0,0.2)',
  shadow2: 'rgba(0,0,0,0.3)',
  shadow3: 'rgba(0,0,0,0.4)',
  shadow4: 'rgba(0,0,0,0.5)',
  shadow5: 'rgba(0,0,0,0.6)',
  shadow6: 'rgba(0,0,0,0.7)',
}

const blackColors = {
  black1: darkPalette[0],
  black2: darkPalette[1],
  black3: darkPalette[2],
  black4: darkPalette[3],
  black5: darkPalette[4],
  black6: darkPalette[5],
  black7: darkPalette[6],
  black8: darkPalette[7],
  black9: darkPalette[8],
  black10: darkPalette[9],
  black11: darkPalette[10],
  black12: darkPalette[11],
}

const whiteColors = {
  white1: lightPalette[0],
  white2: lightPalette[1],
  white3: lightPalette[2],
  white4: lightPalette[3],
  white5: lightPalette[4],
  white6: lightPalette[5],
  white7: lightPalette[6],
  white8: lightPalette[7],
  white9: lightPalette[8],
  white10: lightPalette[9],
  white11: lightPalette[10],
  white12: lightPalette[11],
}

const generatedThemes = createThemes({
  /**
   * COMPONENT THEMES:
   * Pre-built theme variations for Tamagui components like Button, Card, etc.
   * These define how components look in different semantic contexts (primary, danger, etc.)
   * You care about these because they give you the "variant" behavior you're looking for!
   * Example: <Button theme="danger" /> will use the danger component theme
   */
  componentThemes: defaultComponentThemes,

  /**
   * BASE THEME:
   * The foundation that all other themes build upon.
   * This is your default light/dark mode configuration.
   */
  base: {
    /**
     * PALETTE:
     * Maps to color1-color12 in your themes.
     * When in light mode, uses lightPalette. In dark mode, uses darkPalette.
     * Components reference $color1, $color2, etc., and get the right values automatically!
     */
    palette: {
      dark: darkPalette,
      light: lightPalette,
    },

    /**
     * EXTRA:
     * Additional color tokens that DON'T follow the palette system.
     * These are explicit colors like $blue1, $red5, etc. from Radix Colors.
     * They DON'T inherit to child themes - useful for one-off accent colors.
     * This is where you'd add your Bootstrap-style semantic colors!
     */
    extra: {
      light: {
        ...Colors.blue,     // Adds $blue1 through $blue12
        ...Colors.green,    // Adds $green1 through $green12
        ...Colors.red,      // Adds $red1 through $red12
        ...Colors.yellow,   // Adds $yellow1 through $yellow12
        ...lightShadows,    // Shadow tokens for elevation
        ...blackColors,     // Black scale for when you need true blacks
        ...whiteColors,     // White scale for when you need true whites
        shadowColor: lightShadows.shadow1,  // Default shadow color
      },
      dark: {
        ...Colors.blueDark,   // Dark mode versions of blue
        ...Colors.greenDark,  // Dark mode versions of green
        ...Colors.redDark,    // Dark mode versions of red
        ...Colors.yellowDark, // Dark mode versions of yellow
        ...darkShadows,
        ...blackColors,
        ...whiteColors,
        shadowColor: darkShadows.shadow1,
      },
    },
  },

  /**
   * ACCENT THEME:
   * An "inverse" theme - swaps light and dark palettes!
   * Usage: <Theme name="accent"><Card>I'm inverted!</Card></Theme>
   * Useful for: CTAs, tooltips, popovers that need to stand out
   * In light mode, accent uses dark colors. In dark mode, it uses light colors.
   */
  accent: {
    palette: {
      dark: lightPalette,  // Intentionally swapped!
      light: darkPalette,  // Intentionally swapped!
    },
  },

  /**
   * CHILDREN THEMES:
   * Colored variations that inherit from their parent theme.
   * Usage: <Theme name="blue"><Button>I'm blue!</Button></Theme>
   * 
   * These create contextual color themes where:
   * - All color1-color12 tokens use shades of that color
   * - Components automatically adapt to use the color palette
   * - Great for: sections, cards, or components that need a color wash
   * 
   * NESTING EXAMPLE:
   * <Theme name="blue">           // Everything inside is blue-tinted
   *   <Card>                      // Uses blue palette for backgrounds
   *     <Text>Blue text</Text>   // Uses blue palette for text
   *     <Theme name="red">       // Nested theme! Creates blue_red
   *       <Button />              // This button uses red palette
   *     </Theme>
   *   </Card>
   * </Theme>
   */
  childrenThemes: {
    /**
     * BLACK/WHITE THEMES:
     * Special themes that use the same palette in both light and dark modes.
     * Useful for elements that should always be black or white regardless of mode.
     */
    black: {
      palette: {
        dark: Object.values(blackColors),   // Always black scale
        light: Object.values(blackColors),  // Always black scale
      },
    },
    white: {
      palette: {
        dark: Object.values(whiteColors),   // Always white scale
        light: Object.values(whiteColors),  // Always white scale
      },
    },

    /**
     * COLOR THEMES:
     * Each provides a full 12-step palette in that color.
     * Components inside these themes will use appropriate shades:
     * - Backgrounds use blue1-3
     * - Borders use blue6-7
     * - Buttons use blue9
     * - Text uses blue11-12
     */
    blue: {
      palette: {
        dark: Object.values(Colors.blueDark),
        light: Object.values(Colors.blue),
      },
    },
    red: {
      palette: {
        dark: Object.values(Colors.redDark),
        light: Object.values(Colors.red),
      },
    },
    yellow: {
      palette: {
        dark: Object.values(Colors.yellowDark),
        light: Object.values(Colors.yellow),
      },
    },
    green: {
      palette: {
        dark: Object.values(Colors.greenDark),
        light: Object.values(Colors.green),
      },
    },
  },
})

export type TamaguiThemes = typeof generatedThemes

export const themes = generatedThemes

/**
 * This is an optional production optimization: themes JS can get to 20Kb or more.
 * Tamagui has ~1Kb of logic to hydrate themes from CSS, so you can remove the JS.
 * So long as you server render your Tamagui CSS, this will save you bundle size:
 */
// export const themes: TamaguiThemes =
//   process.env.TAMAGUI_ENVIRONMENT === 'client' && process.env.NODE_ENV === 'production'
//     ? {}
//     : (generatedThemes as any)
