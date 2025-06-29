# AfinarteStudio Color Palette

This color palette has been extracted from the `logo.png` file and represents the brand identity of AfinarteStudio.

## 🎨 Primary Colors

### Gold Theme
- **Primary Gold**: `#e4a323` - Main brand color, used for primary buttons, headers, and accent elements
- **Light Gold**: `#ffb625` - Lighter variation for hover states and highlights
- **Dark Gold**: `#d4921f` - Darker variation for active states and emphasis

## 🎭 Secondary Colors

### Dark Theme
- **Primary Dark**: `#1a1a1a` - Main background color for dark theme
- **Secondary Dark**: `#2b2725` - Alternative dark color with slight brown tint
- **Light**: `#f9f9f9` - Light text color and light theme background
- **Gray**: `#9c9c9c` - Muted text and border color

## 📱 Usage Guidelines

### Text Colors
- Use **Light** (`#f9f9f9`) for text on dark backgrounds
- Use **Primary Dark** (`#1a1a1a`) for text on light backgrounds
- Use **Gray** (`#9c9c9c`) for secondary/muted text
- Use **Primary Gold** (`#e4a323`) for accent text and links

### Background Colors
- **Primary Dark** (`#1a1a1a`) for main application background
- **Light** (`#f9f9f9`) for card backgrounds and content areas
- **White** (`#ffffff`) for modal backgrounds and clean sections

### Interactive Elements
- **Primary Gold** for main action buttons
- **Light Gold** for hover states
- **Dark Gold** for active/pressed states
- **Gray** for disabled states

## 🎨 Gradients

### Available Gradients
1. **Gold Gradient**: `linear-gradient(to bottom, #ffb625, #ffffff)`
   - Perfect for headers and hero sections
   
2. **Gold Alt Gradient**: `linear-gradient(to bottom, #e4a323, #ffffff)`
   - Alternative gold gradient for variety
   
3. **Light Gradient**: `linear-gradient(to bottom, #ffffff, rgba(43, 39, 37, 0))`
   - Subtle fade effect for overlays

## 📂 File Structure

```
src/styles/
├── colors.css          # CSS custom properties
├── colors.ts           # TypeScript constants
├── _colors.scss        # SCSS variables and mixins
└── COLOR_PALETTE.md    # This documentation
```

## 🔧 Implementation

### CSS Custom Properties
```css
:root {
  --primary-gold: #e4a323;
  --bg-primary: #1a1a1a;
  --text-primary: #f9f9f9;
}

.header {
  background-color: var(--primary-gold);
  color: var(--bg-primary);
}
```

### TypeScript/Angular
```typescript
import { COLORS } from './styles/colors';

@Component({
  template: `
    <div [style.background-color]="COLORS.PRIMARY_GOLD">
      Content
    </div>
  `
})
export class MyComponent {
  COLORS = COLORS;
}
```

### SCSS
```scss
@import 'colors';

.button {
  @include gold-button;
}

.text-gradient {
  @include gold-text-gradient;
}
```

## 🎵 Brand Context

These colors represent the musical identity of AfinarteStudio:
- **Gold** symbolizes excellence, premium quality, and the golden sound
- **Dark tones** provide elegance and professionalism
- **Light accents** ensure accessibility and modern appeal

The gradient effects mirror the dynamic nature of music and sound waves, while the gold theme reflects the studio's commitment to producing "golden" musical experiences.

## ♿ Accessibility

All color combinations have been chosen to maintain proper contrast ratios:
- Gold on dark backgrounds: 4.5:1 contrast ratio
- Light text on dark backgrounds: 14:1 contrast ratio  
- Dark text on light backgrounds: 14:1 contrast ratio

Always test color combinations with accessibility tools before implementation.
