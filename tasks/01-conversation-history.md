# Conversation History Feature Implementation Plan

## Overview
Implement a conversation history feature that allows users to start new conversations and access previous translation sessions.

## Requirements
- Users should be able to start a "New conversation"
- Previous conversations should be stored and accessible
- Each conversation maintains its own translation history

## Implementation Steps

### Step 1: Data Model Design
1. Define conversation data structure:
   - `id`: unique identifier (use UUID or timestamp-based ID)
   - `createdAt`: conversation start timestamp
   - `updatedAt`: last activity timestamp
   - `title`: auto-generated from first translation or custom name
   - `translations`: array of translation pairs

2. Define translation entry structure:
   - `id`: unique identifier
   - `sourceText`: original text
   - `targetText`: translated text
   - `sourceLang`: source language code
   - `targetLang`: target language code
   - `timestamp`: when translation occurred

### Step 2: Storage Implementation
1. Choose storage method (localStorage for MVP, IndexedDB for production)
2. Create storage service with methods:
   - `createConversation()`: Initialize new conversation
   - `getConversations()`: Retrieve all conversations
   - `getConversation(id)`: Get specific conversation
   - `addTranslation(conversationId, translation)`: Add translation to conversation
   - `deleteConversation(id)`: Remove conversation
   - `updateConversationTitle(id, title)`: Update conversation name

### Step 3: State Management
1. Add conversation state to main app:
   - `currentConversationId`: active conversation
   - `conversations`: list of all conversations
2. Create React context or use state management library
3. Implement state update functions for conversation operations

### Step 4: UI Components
1. Create ConversationList component:
   - Display list of past conversations
   - Show conversation title and preview
   - Add click handler to load conversation
   - Include "New Conversation" button at top

2. Create ConversationHeader component:
   - Show current conversation title
   - Add dropdown/sidebar toggle for conversation list
   - Include conversation management actions

3. Update main translation interface:
   - Connect to current conversation context
   - Auto-save translations to current conversation
   - Clear input/output when switching conversations

### Step 5: Navigation and Routing
1. Consider URL structure for conversations (e.g., /?conversation=uuid)
2. Implement navigation between conversations
3. Handle direct links to specific conversations

### Step 6: Data Persistence
1. Auto-save conversation state on each translation
2. Implement debouncing to avoid excessive saves
3. Handle storage quota limits gracefully

### Testing Checklist
- [ ] Can create new conversation
- [ ] Translations save to current conversation
- [ ] Can switch between conversations
- [ ] Previous translations load when switching back
- [ ] Conversation list updates properly
- [ ] Storage persists across page reloads
- [ ] Handles storage errors gracefully