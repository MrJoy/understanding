# Storybook Integration Plan

## Overview
Add Storybook 8.5+ to the Understanding translation app to provide component documentation and visual testing capabilities. This will enable isolated component development and serve as a living style guide.

## Current Project Context
- **Framework**: Next.js 15.5.2 with App Router
- **React Version**: 19.1.1
- **TypeScript**: 5.9.2
- **Styling**: Tailwind CSS 4.x with tailwind-variants
- **Build Tool**: Turbopack
- **Package Manager**: Yarn 4.9.4
- **Components**: 5 components (3 vendor UI components, 2 service worker related)

## Implementation Steps

### Phase 1: Initial Setup
1. **Install Storybook** (using Yarn 4)
   ```bash
   yarn dlx storybook@latest init --skip-install
   yarn install
   ```
   - This will auto-detect Next.js and configure appropriately
   - Add necessary dependencies to package.json
   - Create `.storybook/` configuration directory

2. **Configure for React 19 & Next.js 15**
   - Update `.storybook/main.ts`:
     - Add `@storybook/nextjs` framework
     - Configure Turbopack support if available
     - Set up static file serving for `/public` assets
   - Update `.storybook/preview.ts`:
     - Import global CSS (`src/app/globals.css`)
     - Configure viewport addon for responsive testing
     - Set up dark mode toggle

3. **TypeScript Configuration**
   - Ensure `.storybook/tsconfig.json` extends main `tsconfig.json`
   - Add story file patterns to TypeScript include paths

### Phase 2: Component Stories

4. **Create Story Files** for existing components:
   - `src/components/vendor/button.stories.tsx`
     - Document all variants (default, destructive, outline, secondary, ghost, link)
     - Document all sizes (default, sm, lg, icon)
     - Show loading states and disabled states
   
   - `src/components/vendor/textarea.stories.tsx`
     - Show default state
     - Show with placeholder
     - Show disabled state
     - Show with different row counts
   
   - `src/components/vendor/drawer.stories.tsx`
     - Interactive story showing open/close behavior
     - Different content examples
   
   - `src/components/UpdatePrompt.stories.tsx`
     - Mock service worker update scenarios
     - Show update available state
     - Show updating state
   
   - `src/components/ServiceWorkerProvider.stories.tsx`
     - Document provider setup
     - Mock different browser support scenarios

5. **Story Structure Template**:
   ```typescript
   import type { Meta, StoryObj } from '@storybook/react';
   
   const meta = {
     title: 'Components/[ComponentName]',
     component: ComponentName,
     parameters: {
       layout: 'centered', // or 'fullscreen' for drawer
     },
     tags: ['autodocs'],
     argTypes: {
       // Define controls for props
     },
   } satisfies Meta<typeof ComponentName>;
   
   export default meta;
   type Story = StoryObj<typeof meta>;
   
   export const Default: Story = {
     args: {
       // Default props
     },
   };
   ```

### Phase 3: Addons & Enhancements

6. **Essential Addons**:
   - `@storybook/addon-essentials` (included by default)
   - `@storybook/addon-a11y` - Accessibility testing
   - `@storybook/addon-themes` - Theme switching for Tailwind dark mode
   - Consider `@chromatic-com/storybook` for visual regression testing

7. **Custom Decorators**:
   - Create decorator for Tailwind dark mode toggle
   - Add decorator for common layout wrappers
   - Mock Next.js router for components that use navigation

### Phase 4: Integration & Scripts

8. **Update package.json Scripts**:
   ```json
   {
     "scripts": {
       "storybook": "storybook dev -p 6006",
       "build-storybook": "storybook build",
       "test-storybook": "test-storybook"
     }
   }
   ```

9. **CI/CD Considerations**:
   - Add `build-storybook` to build pipeline
   - Consider deploying to Chromatic or Netlify for review
   - Add visual regression tests if using Chromatic

10. **Update Development Workflow**:
    - Add Storybook URL to README
    - Document component development process
    - Update CLAUDE.md with Storybook commands

### Phase 5: Future Enhancements

11. **Component Documentation**:
    - Add JSDoc comments to component props
    - Create MDX documentation pages for complex components
    - Document design tokens and Tailwind variants

12. **Testing Integration**:
    - Set up interaction testing with `@storybook/test`
    - Add play functions for user flow testing
    - Integrate with existing test suite

## File Structure After Implementation
```
understanding/
├── .storybook/
│   ├── main.ts           # Storybook configuration
│   ├── preview.ts        # Global decorators and parameters
│   └── tsconfig.json     # TypeScript config for Storybook
├── src/
│   └── components/
│       ├── vendor/
│       │   ├── button.tsx
│       │   ├── button.stories.tsx
│       │   ├── textarea.tsx
│       │   ├── textarea.stories.tsx
│       │   ├── drawer.tsx
│       │   └── drawer.stories.tsx
│       ├── UpdatePrompt.tsx
│       ├── UpdatePrompt.stories.tsx
│       ├── ServiceWorkerProvider.tsx
│       └── ServiceWorkerProvider.stories.tsx
```

## Success Criteria
- [ ] Storybook runs with `yarn storybook`
- [ ] All components have at least one story
- [ ] Stories render without errors
- [ ] Tailwind styles work correctly in Storybook
- [ ] Dark mode toggle works
- [ ] Build command `yarn build-storybook` succeeds
- [ ] Documentation is auto-generated from TypeScript props

## Potential Challenges
1. **React 19 Compatibility**: May need to adjust if Storybook doesn't fully support React 19 yet
2. **Turbopack Integration**: Storybook's Turbopack support is experimental
3. **Tailwind CSS 4**: Ensure PostCSS configuration works with Storybook's webpack
4. **Service Worker Mocking**: Need to mock service worker APIs for provider components

## Estimated Timeline
- Phase 1-2: 2-3 hours (setup and basic stories)
- Phase 3-4: 1-2 hours (addons and integration)
- Phase 5: Optional future work

## References
- [Storybook for Next.js](https://storybook.js.org/docs/get-started/nextjs)
- [Storybook with Tailwind CSS](https://storybook.js.org/recipes/tailwindcss)
- [Storybook 8.5 Release Notes](https://storybook.js.org/releases/8.5)