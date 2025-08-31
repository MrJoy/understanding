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

## 📋 Commit Requirements (ALL Work - Features, Docs, Refactoring, Everything)

### Every Commit Must Capture Human-Claude Interaction

**The commit template below is MANDATORY for ALL commits** - documentation changes, refactoring, bug fixes, features, CLAUDE.md updates, everything. This captures how humans effectively guide Claude.

### When to Commit
Only commit when:
- ✅ Tests pass (if applicable)
- ✅ Human explicitly requests commit OR
- ✅ Reached major milestone

Never commit:
- ❌ Without capturing full interaction log
- ❌ With failing tests or lint errors
- ❌ "Proactively" without meeting above criteria

### Commit Checklist
Before ANY commit:
- [ ] Did I run `yarn lint` and fix any issues?
- [ ] Did I run tests (`yarn test`, `yarn test-storybook`) if applicable?
- [ ] Did I search for existing patterns before writing code?
- [ ] Did I test in development server (`yarn dev`) if UI changes?
- [ ] Did I document any NEW problem/solution in CLAUDE.md?
- [ ] Am I solving a genuinely new problem? (Rare!)
- [ ] **Did I capture VERBATIM human-Claude interactions in commit message?**

### MANDATORY: Output Before EVERY Commit (All Work Types, Including Amends!)
You MUST output exactly (even for `git commit --amend`):
```
📝 COMMIT READY CHECK:
☑️ Lint clean: [YES/NO/NA - only if code changed]
☑️ Tests pass: [YES/NO/NA - only if code changed]
☑️ Tested in development: [YES/NO/NA - only if code changed]
☑️ Tested in browser: [YES/NO/NA - only if UI code changed]
☑️ Documented new patterns: [YES/NO/NA - only if applicable]
☑️ ALL prompts since last commit captured: [YES - X prompts captured VERBATIM]

[If ANY are NO: "❌ NOT ready - need to: (list required actions)"]
[If ALL are YES/NA: "✅ Ready to commit with COMPLETE Human-Claude interaction log."]
```

When ready, commit your work with the human-Claude interaction log.

**Note on Amending**: `git commit --amend` still requires the full checklist - code may have changed since original commit.

**Universal Commit Message Template** (USE FOR EVERY COMMIT - docs, refactoring, features, EVERYTHING):
```bash
# First, check what you modified:
git status
# Then add YOUR specific changes (not everything):
git add [specific files you changed]
# For multiple files:
git add src/app/page.tsx src/components/button.tsx CLAUDE.md
# Commit with interaction log:
git commit -m "$(cat <<'EOF'
Brief description of what was done

[Technical changes made]

## Human-Claude Interaction Log

### Human prompts (VERBATIM - include typos, informal language, COMPLETE text):
**Include EVERY prompt since last commit - even short ones, corrections, clarifications**
1. "[Copy-paste ENTIRE first prompt since last commit]"
   → Claude: [What Claude did in response]

2. "[Copy-paste ENTIRE second prompt - including [Request interrupted] if present]"
   → Claude: [How Claude adjusted]

[Continue numbering ALL prompts - don't skip any or judge importance]

### Key decisions made:
- Human guided: [specific guidance provided]
- Claude discovered: [patterns found]

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```
**Note**: Avoid `git add -A` when multiple Claudes work in parallel - add only YOUR files.