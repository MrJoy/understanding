# Version Synchronization Implementation Plan

## Overview
Implement a solution to keep version information synchronized between sw.js (service worker) and version.ts, ensuring consistent versioning across the application.

## Requirements
- Single source of truth for version
- Automatic synchronization during build
- Support for semantic versioning
- Cache busting for service worker updates

## Implementation Steps

### Step 1: Version Source Strategy
1. Choose primary version source:
   - package.json version field (recommended)
   - Dedicated version config file
   - Git tags/commits
   - Environment variables
2. Version format:
   - Semantic versioning (MAJOR.MINOR.PATCH)
   - Build number inclusion
   - Timestamp suffix option
   - Git commit hash reference

### Step 2: Build-Time Generation
1. Create version generation script:
   ```javascript
   // scripts/generate-version.js
   const package = require('../package.json');
   const fs = require('fs');
   
   const version = {
     version: package.version,
     buildTime: new Date().toISOString(),
     commit: process.env.GIT_COMMIT || 'dev'
   };
   
   // Generate version.ts
   fs.writeFileSync('src/version.ts', 
     `export const VERSION = ${JSON.stringify(version)};`
   );
   
   // Update sw.js
   const swContent = fs.readFileSync('public/sw.js', 'utf8');
   const updated = swContent.replace(
     /const VERSION = ['"].*['"]/,
     `const VERSION = '${version.version}'`
   );
   fs.writeFileSync('public/sw.js', updated);
   ```

2. Add to build pipeline:
   - Pre-build hook
   - package.json scripts
   - CI/CD integration

### Step 3: Template-Based Approach
1. Create source templates:
   - `sw.template.js`
   - `version.template.ts`
2. Use placeholders:
   ```javascript
   // sw.template.js
   const VERSION = '__VERSION__';
   const BUILD_TIME = '__BUILD_TIME__';
   ```
3. Replace during build:
   - Webpack DefinePlugin
   - Rollup replace plugin
   - Custom Node.js script

### Step 4: Environment Variable Integration
1. Define version variables:
   ```bash
   VERSION=1.2.3
   BUILD_NUMBER=456
   GIT_COMMIT=$(git rev-parse HEAD)
   ```
2. Inject at build time:
   - Next.js env config
   - Webpack EnvironmentPlugin
   - Process substitution

### Step 5: Service Worker Caching Strategy
1. Version-based cache names:
   ```javascript
   const CACHE_NAME = `app-cache-v${VERSION}`;
   ```
2. Cache cleanup:
   ```javascript
   self.addEventListener('activate', (event) => {
     event.waitUntil(
       caches.keys().then((cacheNames) => {
         return Promise.all(
           cacheNames
             .filter((name) => name !== CACHE_NAME)
             .map((name) => caches.delete(name))
         );
       })
     );
   });
   ```

### Step 6: Version Display UI
1. Add version display component:
   - Footer version number
   - About dialog
   - Developer console info
2. Update checking:
   ```javascript
   // Check for new version
   fetch('/api/version')
     .then(res => res.json())
     .then(data => {
       if (data.version !== currentVersion) {
         // Prompt update
       }
     });
   ```

### Step 7: Automated Version Bumping
1. Use semantic-release or standard-version:
   ```json
   {
     "scripts": {
       "release": "standard-version",
       "release:minor": "standard-version --release-as minor",
       "release:major": "standard-version --release-as major"
     }
   }
   ```
2. Git hooks integration:
   - Pre-commit version sync
   - Post-merge version check
3. CI/CD automation:
   - Auto-increment on merge
   - Tag creation
   - Release notes generation

### Step 8: Development Workflow
1. Local development:
   - Use 'dev' or timestamp version
   - Skip SW caching
   - Hot reload support
2. Staging builds:
   - Include branch name
   - Preview version format
3. Production builds:
   - Strict version validation
   - Version history tracking

### Testing Checklist
- [ ] Version generates correctly from source
- [ ] sw.js and version.ts stay synchronized
- [ ] Build process updates both files
- [ ] Service worker updates properly
- [ ] Cache busting works
- [ ] Version displays in UI
- [ ] Update detection functions
- [ ] CI/CD pipeline integrates correctly
- [ ] Development workflow unaffected