# Changelog

All notable changes to Understanding will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.0.10 - 2025-09-04

### Changes

- Make another attempt at PWA setup
- Disable Turbopack because Serwist [doesn't support it yet](https://github.com/serwist/serwist/issues/54)

## 0.0.9 - 2025-09-04

### Changes

- Run screaming from broken PWA implementation

## 0.0.8 - 2025-09-04

### Changed

- First attempt at using a service worker to turn this into a PWA

## 0.0.7 - 2025-09-04

### Added

- Persistent translation history using LocalStorage
- Type definitions for history management
- Custom hook for history state management

### Changed

- Add ability to remove individual history items, or clear history entirely

## 0.0.6

### Added

- History drawer UI

### Changed

- Updated CLAUDE.md with comprehensive commit requirements and interaction logging

## 0.0.5

### Changed

- Improved viewport scrolling behavior
- Added padding at bottom of UI

## 0.0.4

### Added

- Progressive Web App (PWA) capabilities
- App manifest configuration

### Fixed

- History scrollability issues

### Changed

- Layout adjustments for better usability
- Workflow improvements

## 0.0.3

### Added

- TremorJS and ShadCN UI components integration
- History feature (initially hidden)

### Changed

- Switched to emoji instead of icons for language indicators
- Made controls larger and more accessible
- Manual language toggle mechanism
- Clear input/output on language swap

### Fixed

- Browser auto-zoom on input focus
- Layout formatting to prevent unwanted scrolling
- Controls disabled during translation

## 0.0.2

### Added

- ChatGPT integration for translations, including a development mode to avoid unnecessary API token usage
- Focus input on translation completion

### Changed

- Improved UX with better control flow
- Enhanced formatting and layout
- Made text larger for better readability

## 0.0.1

### Added

- Initial Next.js 15.5.2 application setup with Turbopack, TypeScript, Tailwind, and ESLint.
- English ↔ Japanese translation interface
- Language toggle with flag emoji indicators
- Textarea components for source and translated text
- CLAUDE.md instructions for AI assistance
