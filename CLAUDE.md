# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Next.js 15.5.2 translation application designed to help people understand each other through English ↔ Japanese translation. The app uses React 19, TypeScript, and Tailwind CSS with Turbopack for optimized builds.

## Essential Commands

### Development
```bash
yarn dev          # Start development server with Turbopack on http://localhost:3000
yarn build        # Create production build
yarn start        # Run production server
```

### Code Quality
```bash
yarn lint         # Run full linting pipeline (TypeScript, ESLint, unused imports, security audit)
yarn lint:js      # Run ESLint only
yarn lint:unused  # Check for unused imports
```

## Architecture Overview

### Core Structure
The application follows Next.js 15 App Router conventions:
- `src/app/` - App Router pages and layouts
- `src/components/` - Reusable React components using Tailwind CSS variants
- Main translation interface at `src/app/page.tsx` with language toggle functionality

### Key Implementation Points
1. **Translation Flow**: The app maintains source/target language state (English/Japanese) with flag icons for visual representation. Translation logic is marked TODO in `src/app/page.tsx:49`.

2. **Component Architecture**: Uses functional components with TypeScript. The Button component (`src/components/button.tsx`) demonstrates the pattern for reusable UI components with Tailwind styling.

3. **Styling Strategy**: Tailwind CSS 4.x with forms plugin, using CSS custom properties for theming and dark mode support via prefers-color-scheme.

### Active Development Areas
- Translation functionality implementation (marked as TODO: Use ChatGPT)
- History display feature in footer (marked as TODO)

## Development Guidelines

### Before Making Changes
1. Check existing component patterns in `src/components/` for consistency
2. Follow the established TypeScript strict mode configuration
3. Use Tailwind classes for styling rather than custom CSS

### After Making Changes
Always run `yarn lint` to ensure:
- TypeScript compilation succeeds
- ESLint rules pass
- No unused imports remain
- No security vulnerabilities in dependencies