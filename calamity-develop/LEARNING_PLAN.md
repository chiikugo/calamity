# Calamity: Learning Plan

Build an Obsidian-style notepad with pop-out windows, and learn **TypeScript**, **React**, and **Tauri** (plus a little **Rust**) along the way.

## How to use this plan

- Work from top to bottom. Each checkbox is one small, testable step. Tick it when it works.
- **Read the linked docs before you write the code.** The docs are the lesson, and the step is the exercise.
- Answer the "Check yourself" questions at the end of each phase before moving on. If you can't, re-read the docs.
- Commit after every step or two (`git add` + `git commit`). Small commits make it easy to undo experiments.
- Use the **`/tutor`** skill (`.claude/skills/tutor/SKILL.md` at the repo root) for help:
  - `/tutor`: where you are and what the next step teaches.
  - `/tutor hint`: a nudge. Run it again for a bigger hint.
  - `/tutor explain <error or concept>`: why something happens.
  - `/tutor review phase N` or `/tutor review <file>`: feedback on your code.
  - `/tutor quiz <topic>`: check that a concept stuck.
  - `/tutor answer`: answers your open questions in `QUESTIONS.md`.
  - Say "just write it" when you want Claude to skip tutoring for one request.

## Your stack (as scaffolded)

React 19, TypeScript 6, Vite 8, Tauri 2.

> ⚠️ **Only use Tauri v2 docs** (`v2.tauri.app` or `tauri.app`). Many blog posts and StackOverflow answers describe Tauri v1, which looks similar but differs. Signs of v1: an `allowlist` in the config, or importing from `@tauri-apps/api/tauri`. Ignore anything with those.

### Background reading (skim once, return often)
- How Tauri is put together: [Process Model](https://v2.tauri.app/concept/process-model/), [Inter-Process Communication](https://v2.tauri.app/concept/inter-process-communication/)
- React's own course: [react.dev/learn](https://react.dev/learn)
- TypeScript: [TS for the New Programmer → TS in 5 minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

---

## Phase 0: Orientation

**Goal:** Know what every file in the project does and which side it runs on: the webview (your React/TS UI) or Rust (the native process).

- [x] Install the prerequisites (Node, Rust, Xcode command line tools).
  📖 [Prerequisites](https://v2.tauri.app/start/prerequisites/)
- [x] Scaffold the project and run `npm run tauri dev` from `calamity-develop/`.
- [x] Read the project structure page. Then open each of these files and write a one-line comment at the top, in your own words, saying what it does: `index.html`, `src/main.tsx`, `src/App.tsx`, `src-tauri/src/lib.rs`, `src-tauri/tauri.conf.json`, `src-tauri/capabilities/default.json`.
  📖 [Project Structure](https://v2.tauri.app/start/project-structure/), [Configuration Files](https://v2.tauri.app/develop/configuration-files/)
- [x] Trace the template's "Greet" feature end to end: the form in `App.tsx` → `invoke("greet", ...)` → the `greet` function in `lib.rs` → its registration in `generate_handler!`. Change the message Rust returns and watch the app rebuild.
  📖 [Calling Rust from the Frontend](https://v2.tauri.app/develop/calling-rust/) (the first section is enough for now)
- [x] Open the webview devtools (right-click in the app → Inspect). Add a `console.log` in `App.tsx` and find its output. Then add a `println!` in the Rust `greet` function and notice that it shows up in your **terminal**, not in devtools.
  📖 [Debug](https://v2.tauri.app/develop/debug/)
- [x] Delete the template UI: the logos, the greet form, and the template CSS in `App.css`. You can keep the Rust `greet` command as a reference or delete it.

**Done when:** The app opens to a blank window, and you can say which files run in the webview and which run in Rust.

**Check yourself:**
- Why does editing `App.tsx` update instantly, while editing `lib.rs` triggers a recompile?
- What is a "capability" protecting you from?

---

## Phase 1: TypeScript and the data model

**Goal:** Define your note type and write the pure helper functions the UI will need. No UI yet.

> **Where you are now:** `Basepad.tsx` declares `NoteId` and `Note` *inside* the component function. Two things to learn from that:
> 1. Types belong at the **top level of a module**, usually in their own file, so other files can `import` them.
> 2. A React component is a function that **returns JSX**. `Basepad` currently returns nothing.
>
> Move the types out in this phase. `Basepad` becomes your editor in Phase 2.

- [ x] Read Everyday Types and Object Types.
  📖 [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html), [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [ x] Create `src/notes/types.ts` and export `NoteId` and `Note` from it. Decide whether `title` should be **stored** or **derived** from the content. You'll derive the title from the first line, so consider removing it from the type. Storing data you can derive leads to bugs where the two disagree.
  📖 [Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html), [Choosing the State Structure → "Avoid redundant state"](https://react.dev/learn/choosing-the-state-structure)
- [ x] Create `src/notes/noteUtils.ts` with these pure functions, each with typed parameters and return values:
  - `createNote()`: makes a new empty note. Use `crypto.randomUUID()` for the id and `Date.now()` for the timestamp.
  - `deriveTitle(content)`: the first non-empty line, trimmed, with any leading `#` removed. Falls back to `"Untitled"`.
  - `wordCount(text)` and `charCount(text)`.
  📖 [More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html), [crypto.randomUUID](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID), [String methods (split, trim, startsWith…)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- [ x] Add a `SaveStatus` type that can only be `"idle"`, `"saving"`, `"saved"`, or `"error"`. You'll use it in Phase 3.
  📖 [Literal Types (in Everyday Types)](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types), [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [x ] Install Vitest and add a `"test"` script to `package.json`. Write tests for `deriveTitle` and `wordCount`, covering edge cases: an empty string, only whitespace, several spaces in a row, `"# My heading"`, and leading blank lines.
  📖 [Vitest: Getting Started](https://vitest.dev/guide/)
- [ x] Run `npx tsc --noEmit` and fix any type errors it reports.

**Done when:** `npm test` passes and `Basepad.tsx` no longer contains type definitions.

**Check yourself:**
- When would you pick `interface` over `type`?
- `main.tsx` uses `as HTMLElement`. What does that do, and why is it a small lie to the compiler?

---

## Phase 2: React and the blank notepad

**Goal:** A distraction-free, full-window editor with a live word count.

- [ x] Read the core React lessons.
  📖 [Your First Component](https://react.dev/learn/your-first-component), [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx), [Passing Props](https://react.dev/learn/passing-props-to-a-component), [Responding to Events](https://react.dev/learn/responding-to-events), [State: A Component's Memory](https://react.dev/learn/state-a-components-memory), [Using TypeScript with React](https://react.dev/learn/typescript)
- [ ] Make `Basepad` return a `<textarea>`, and render `<Basepad />` from `App` in place of the old template.
- [ x] Make the textarea a **controlled input**: its text lives in `useState`, and it's wired up with `value` and `onChange`.
  📖 [`<textarea>` reference → "Controlling a text area with a state variable"](https://react.dev/reference/react-dom/components/textarea)
- [ x] **Lift the state up.** `App` owns the current `Note`. `Basepad` receives `content` and an `onChange` callback as props. Type the props with an interface.
  📖 [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components), [Thinking in React](https://react.dev/learn/thinking-in-react)
- [ x] Build a `StatusBar` component that receives the content as a prop and shows words and characters, using your Phase 1 helpers. Don't keep the counts in state. Calculate them during render.
  📖 [You Might Not Need an Effect → "Updating state based on props or state"](https://react.dev/learn/you-might-not-need-an-effect)
- [ x] Layout: the editor fills the window and the status bar stays at the bottom. Use a flexbox column at full viewport height. Remove the textarea's border, outline, and resize handle.
  📖 [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [] Theme: define your colors (background, text, muted text, accent) as CSS custom properties on `:root`, using a dark Obsidian-like palette.
  📖 [Using CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [ ] Readability: limit the text column to about `70ch` wide, center it, and give it a comfortable line height. This is Obsidian's "readable line length" setting.
- [ ] Add `autoFocus` and a placeholder, so you can start typing as soon as the app opens.

**Done when:** The app opens, you can type right away, and the counts update live. Nothing from the template is left.

**Check yourself:**
- Why does typing one character re-render `App`?
- What breaks if you use `defaultValue` instead of `value`?

---

## Phase 3: Hooks, autosave, and shortcuts

**Goal:** Your text survives a restart, it saves itself while you type, and you can save with **Cmd+S**.

- [ ] Read the effects and refs lessons. Pay extra attention to cleanup functions.
  📖 [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects), [Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects), [Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs), [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [ ] Read why effects run **twice** in development. Your `main.tsx` uses `<React.StrictMode>`, so you'll see this happen.
  📖 [StrictMode](https://react.dev/reference/react/StrictMode)
- [ ] Create `src/notes/storage.ts` with `saveNote(note)` and `loadNote(id)`, backed by `localStorage` for now. **Make them `async` and return Promises**, even though `localStorage` is synchronous. In Phase 4 you'll replace their insides with Rust calls, and no component should need to change.
  📖 [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [ ] Load on startup. Remember the id of the last open note, and load that note once when `App` mounts. If nothing is saved yet, create a new note. While loading, `App`'s state is `Note | null`, so render something sensible for the `null` case.
  📖 [Conditional Rendering](https://react.dev/learn/conditional-rendering)
- [ ] Write a `useDebounce(value, delayMs)` custom hook in `src/hooks/`. It should use an effect, `setTimeout`, and a cleanup that calls `clearTimeout`.
  📖 [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)
- [ ] Autosave: when the debounced content changes, call `saveNote`, track the progress in a `SaveStatus` state, and show "Saving…", "Saved", or "Error" in the `StatusBar`. Also work out why you shouldn't save right after the initial load, and prevent it.
- [ ] Write a `useHotkey` hook. In an effect, add a `keydown` listener to `window`, and remove it in the cleanup. Use it so **Cmd+S** saves immediately, and call `preventDefault()`. Store the latest handler in a `useRef` so the listener doesn't have to be re-added on every render.
  📖 [keydown event](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event), [KeyboardEvent.metaKey](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey)
- [ ] Make the native window title follow the note's first line with `getCurrentWindow().setTitle(...)`. This is your **first permission**: if the console shows a "not allowed" error, find the matching permission in the core permissions list and add it to `capabilities/default.json`.
  📖 [Window API](https://v2.tauri.app/reference/javascript/api/namespacewindow/), [Capabilities](https://v2.tauri.app/security/capabilities/), [Permissions](https://v2.tauri.app/security/permissions/), [Core Permissions reference](https://v2.tauri.app/reference/acl/core-permissions/)

**Done when:** You type, pause, and see "Saved". You quit and relaunch, and your text is back. Cmd+S works, and the title bar shows your first line.

**Check yourself:**
- What goes wrong if `useHotkey` has no cleanup? (StrictMode will show you.)
- Why does `useDebounce` need a cleanup at all?

---

## Phase 4: Rust and real files

**Goal:** Each note is saved as a `.md` file in the app's data folder, just like an Obsidian vault, and a simple sidebar lists your notes.

- [ ] Rust reading. Don't aim for mastery; you'll come back to these.
  📖 The Rust Book: [Ch 3 Common Concepts](https://doc.rust-lang.org/book/ch03-00-common-programming-concepts.html), [Ch 4 Ownership](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html) (skim), [Ch 5 Structs](https://doc.rust-lang.org/book/ch05-00-structs.html), [Ch 7 Modules](https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html), [Ch 8.2 Strings](https://doc.rust-lang.org/book/ch08-02-strings.html), [Ch 9 Error Handling](https://doc.rust-lang.org/book/ch09-00-error-handling.html) (`Result` and the `?` operator)
- [ ] Re-read Calling Rust **in full**: arguments (camelCase in JS becomes snake_case in Rust), returning `Result` (errors), async commands, and how a command gets access to the `AppHandle`.
  📖 [Calling Rust from the Frontend](https://v2.tauri.app/develop/calling-rust/)
- [ ] Create `src-tauri/src/notes.rs` and declare it as a module in `lib.rs`.
- [ ] Define a Rust `Note` struct that mirrors your TypeScript type. Derive `Serialize` and `Deserialize`, and use serde's `rename_all` attribute so Rust's `updated_at` matches TypeScript's `updatedAt`.
  📖 [serde derive](https://serde.rs/derive.html), [serde container attributes (`rename_all`)](https://serde.rs/container-attrs.html)
- [ ] Write a helper that returns the notes folder: the app data directory joined with `notes`. It should create the folder if it doesn't exist. Find out where `.path()` comes from; look at the `Manager` trait.
  📖 [PathResolver (`app_data_dir`)](https://docs.rs/tauri/latest/tauri/path/struct.PathResolver.html), [Manager trait](https://docs.rs/tauri/latest/tauri/trait.Manager.html), [std::fs](https://doc.rust-lang.org/std/fs/index.html)
- [ ] Write three commands: `save_note`, `load_note`, and `list_notes`. Each note is stored as `<id>.md` containing its text. Every command returns a `Result`, with I/O errors converted into a `String`; look up `map_err`. Register all three in `generate_handler!`.
- [ ] Replace the insides of `storage.ts` with `invoke(...)` calls. Use invoke's type parameter so you get back a typed `Note`. **If you have to change a component, your storage abstraction leaked.** Work out why.
  📖 [Core API (`invoke`)](https://v2.tauri.app/reference/javascript/api/namespacecore/), [TS Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [ ] Find your files on disk. Print the folder path with `println!` and open it in Finder. It will be under `~/Library/Application Support/` in a folder named after the `identifier` in `tauri.conf.json`.
- [ ] Build a minimal sidebar: a list of note titles from `list_notes`, click a title to open that note, and a "New note" button.
  📖 [Rendering Lists (and why `key` matters)](https://react.dev/learn/rendering-lists)
- [ ] Error handling: if a save fails, make sure the user sees the `"error"` status.

**Done when:** Your notes exist as `.md` files you can open in TextEdit. Fun test: open that folder as a vault in real Obsidian. Switching between notes in your app also works.

**Check yourself:**
- Why can't the webview write files by itself? (Think about the security model.)
- Where did you run into `&str` vs `String`, and why are there two string types?

---

## Phase 5: Pop-out windows

**Goal:** Pop any note out into its own small window that can float above everything else.

- [ ] Read the window APIs. Look for the constructor options, `getByLabel`, `setFocus`, `setAlwaysOnTop`, and the `tauri://created` / `tauri://error` events.
  📖 [WebviewWindow API](https://v2.tauri.app/reference/javascript/api/namespacewebviewwindow/), [Window API](https://v2.tauri.app/reference/javascript/api/namespacewindow/)
- [ ] **Design on paper first:**
  - Window label scheme: `popout-<noteId>`. Every window needs a unique label.
  - URL: a relative URL to your app with query parameters, such as the note id and `mode=popout`.
  - What does a pop-out show? (Suggestion: only the editor and a small status bar, with no sidebar.)
- [ ] When the app starts, read the query string with `URLSearchParams`. `App` then renders either the **main layout** (sidebar + editor) or a **pop-out layout** (just the editor). Same codebase, two layouts.
  📖 [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams), [Conditional Rendering](https://react.dev/learn/conditional-rendering)
- [ ] Add a "Pop out" button. On click, check whether a window with that label already exists. If it does, focus it. If not, create a new `WebviewWindow` with a title, a size, and a minimum size.
- [ ] **It will fail the first time.** Read the error in the devtools console. Add the permission that lets the main window create webview windows. Then create a **second capability file** for windows matching `popout-*`, granting only what pop-outs actually need. This is the principle of least privilege.
  📖 [Capabilities (windows, glob patterns)](https://v2.tauri.app/security/capabilities/), [Core Permissions reference](https://v2.tauri.app/reference/acl/core-permissions/)
- [ ] The pop-out loads its note with `load_note`, using the id from its URL.
- [ ] Add a 📌 pin button that toggles always-on-top, with its permission. Show whether the window is pinned in the UI.
- [ ] **Observe the bug:** edit a note in the pop-out, and the main window still shows the old text. Worse, autosave from the main window can overwrite your pop-out edits. Write down in your own words why this happens. Phase 6 fixes it.
- [ ] Decide what happens to pop-outs when the main window closes. Should they close too or stay open? Look at `onCloseRequested` in JS, or the window event handler in Rust.
  📖 [Builder (`on_window_event`)](https://docs.rs/tauri/latest/tauri/struct.Builder.html)

**Done when:** You can pop a note into a pinned floating window, and clicking "Pop out" again focuses that window instead of opening a duplicate.

**Check yourself:**
- Two windows run two completely separate React apps. What do they share, and what don't they share?

---

## Phase 6: Syncing between windows

**Goal:** Typing in one window updates every other window that shows the same note, almost instantly.

- [ ] Read about events and managed state.
  📖 [Calling the Frontend from Rust (events)](https://v2.tauri.app/develop/calling-frontend/), [Event API (`emit`, `emitTo`, `listen`)](https://v2.tauri.app/reference/javascript/api/namespaceevent/), [Emitter trait](https://docs.rs/tauri/latest/tauri/trait.Emitter.html), [State Management](https://v2.tauri.app/develop/state-management/), Rust Book [Ch 8.3 HashMaps](https://doc.rust-lang.org/book/ch08-03-hash-maps.html), [Ch 16.3 Mutex](https://doc.rust-lang.org/book/ch16-03-shared-state.html)
- [ ] Pick a **single source of truth**. Recommendation: Rust keeps the open notes in managed state (a `Mutex` around a `HashMap` from id to note), registered with `.manage()` in the builder.
- [ ] Write a new command, `update_note`. It takes the note **and the label of the window that sent it**, updates the map, writes the file, and broadcasts a `note-updated` event to all windows. Event payloads must derive `Serialize` and `Clone`. Mirror the payload type in TypeScript.
- [ ] Write a `useNoteSync(noteId)` hook that listens for `note-updated` and replaces the content when the event is for this note.
  - **Echo loop:** ignore events whose source label matches your own window's label. You can get the label from `getCurrentWebviewWindow()`.
  - **Async cleanup:** `listen` returns a *Promise* of an unlisten function, so a plain cleanup is harder than usual. StrictMode's double mount will expose a leaked listener: every event gets handled twice. Get this right.
- [ ] Update the sidebar titles live from the same event.
- [ ] Optional: show a "popped out" icon next to notes that are open in another window.

**Done when:** You type in the pop-out and the main window updates within a moment. Nothing flickers, the cursor doesn't jump, events aren't handled twice, and nothing is lost after a restart.

**Check yourself:**
- JavaScript is single-threaded, so why does Rust need a `Mutex`?
- Why is "Rust owns the truth" safer than "each window saves its own copy"?

---

## Phase 7: Polish and ship

- [ ] Custom title bar: use the macOS overlay title bar style (or turn off decorations entirely), make your own header draggable with `data-tauri-drag-region`, and add the start-dragging permission. Apply the same options to pop-out windows.
  📖 [Window Customization](https://v2.tauri.app/learn/window-customization/)
- [ ] Remember window sizes and positions with the window-state plugin. Install it with `npm run tauri add window-state`.
  📖 [Window State plugin](https://v2.tauri.app/plugin/window-state/), [Plugins overview](https://v2.tauri.app/develop/plugins/)
- [ ] Add an app menu with keyboard shortcuts: New Note (Cmd+N) and Pop Out (Cmd+Shift+O). Prefer **menu accelerators** over the global-shortcut plugin, because global shortcuts fire even when your app isn't focused.
  📖 [Window Menu](https://v2.tauri.app/learn/window-menu/), [Menu API](https://v2.tauri.app/reference/javascript/api/namespacemenu/)
- [ ] Rename the app from `calamity-develop`: set the `productName`, `identifier`, and window title in `tauri.conf.json`. Changing `identifier` moves the data folder, so copy your notes over.
  📖 [Config reference](https://v2.tauri.app/reference/config/)
- [ ] App icon: run `npm run tauri icon` on a 1024×1024 PNG.
  📖 [Icons](https://v2.tauri.app/develop/icons/)
- [ ] Production build: run `npm run tauri build` and find the `.app` and `.dmg` in `src-tauri/target/release/bundle/`. The app is unsigned, so the first time you open it, right-click → Open.
  📖 [Distribute](https://v2.tauri.app/distribute/), [macOS Application Bundle](https://v2.tauri.app/distribute/macos-application-bundle/)

---

## Stretch goals (after Phase 7)
- A **quick-capture window** opened by a *global* shortcut from anywhere in macOS. This is where the global-shortcut plugin fits. 📖 [Global Shortcut](https://v2.tauri.app/plugin/global-shortcut/)
- Markdown preview mode (look at `react-markdown`).
- Open any folder as a vault, with a file tree. 📖 [File System plugin](https://v2.tauri.app/plugin/file-system/)
- `[[wikilinks]]` between notes, then backlinks.
- Replace the textarea with CodeMirror 6 for syntax highlighting.
- Dogfood the app: keep your learning notes for this project in Calamity itself.

## Common gotchas
| Symptom | Likely cause |
|---|---|
| "…not allowed…" error in the console | A missing permission in `src-tauri/capabilities/`. |
| Nothing logs in devtools | `println!` output goes to the terminal; `console.log` output goes to devtools. |
| Effect or listener runs twice | StrictMode in development. Usually it means a cleanup is missing. |
| `invoke` arguments arrive empty in Rust | JS argument names must be camelCase versions of the Rust parameter names. |
| An example from the internet doesn't compile | It's probably written for Tauri v1. |
| A Rust change seems to do nothing | Check the terminal; the recompile may have failed. |
