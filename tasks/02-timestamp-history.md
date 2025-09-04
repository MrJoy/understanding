# Timestamp History Entries Implementation Plan

## Overview
Add timestamps to all history entries to show when translations occurred, improving the user experience by providing temporal context.

## Requirements
- Display timestamps for each translation in history
- Show timestamps in a user-friendly format
- Handle different time zones appropriately

## Implementation Steps

### Step 1: Timestamp Storage
1. Ensure all translation entries include timestamp field:
   - Store as ISO 8601 string or Unix timestamp
   - Include timezone information if needed
2. Update data model to require timestamp on creation
3. Add migration logic for existing entries without timestamps

### Step 2: Timestamp Formatting
1. Create timestamp formatting utilities:
   - `formatRelativeTime(timestamp)`: "2 minutes ago", "yesterday"
   - `formatAbsoluteTime(timestamp)`: "Jan 15, 2024 3:45 PM"
   - `formatShortTime(timestamp)`: "3:45 PM" for today, "Jan 15" for older
2. Consider using a library like date-fns or dayjs for formatting
3. Implement locale-aware formatting

### Step 3: UI Display
1. Update translation history item component:
   - Add timestamp display element
   - Position timestamp (e.g., top-right corner, below text)
   - Style with subtle, non-intrusive appearance
2. Update conversation list items:
   - Show "Last active: [timestamp]"
   - Sort by most recent activity

### Step 4: Timestamp Grouping
1. Group translations by time period:
   - "Today"
   - "Yesterday"
   - "This Week"
   - "Older"
2. Add visual separators between groups
3. Implement collapsible sections for better navigation

### Step 5: Time Zone Handling
1. Detect user's time zone
2. Store timestamps in UTC
3. Convert to local time for display
4. Handle daylight saving time changes

### Step 6: Performance Optimization
1. Memoize formatted timestamps to avoid recalculation
2. Use virtual scrolling for long history lists
3. Lazy load older history entries

### Testing Checklist
- [ ] New translations include accurate timestamps
- [ ] Timestamps display in correct format
- [ ] Relative time updates appropriately
- [ ] Time zones handled correctly
- [ ] Timestamp grouping works as expected
- [ ] Performance remains smooth with many entries
- [ ] Formatting respects user locale