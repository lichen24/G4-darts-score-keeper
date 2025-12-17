# G4-darts-score-keeper

A single-page web application for keeping score in a two-player darts game.  
This project was developed as part of a web development course assignment, focusing on core game logic, UI interaction, accessibility, and teamwork using Git.

---

## Features

### Game setup
- Add *two players*
- Select game type: *301* or *501*
- Select *set size (max legs)* before starting the match (e.g. Best of 3, Best of 5, Best of 7)

### Gameplay (per leg)
- Players take turns entering their scores
- The application keeps track of each player’s *remaining score*
- A *chronological turn history* is displayed for the current leg
- Recorded turns can be:
  - *Edited inline*
  - *Deleted*
- Editing or deleting a turn automatically *recalculates scores*

### Match level
- Tracks the *number of legs won* by each player
- After a leg is completed, scores are *reset for the next leg*
- When a player reaches the selected number of legs, the *match winner is declared*
- A *winner announcement and celebration message* is shown
- Options to *Rematch* (same players) or start a *New Game*

### Real-time aggregates
- Remaining score per player
- Legs won per player
- *Average score per turn*, updated dynamically during the leg

### Additional features
- Optional player avatars
- Dark mode toggle
- Responsive layout for desktop and mobile use
- Basic accessibility support using semantic HTML and ARIA roles

---

## Rules and assumptions

- The application follows standard darts scoring for *301 / 501*
- Special finishing rules (e.g. double-out or bull’s eye when reaching zero) are *not enforced by the application*
  - These checks are intentionally left to the user, as allowed by the assignment instructions
- When turns are edited or removed, the application *recalculates scores from the start of the current leg*

---

## Accessibility

- Semantic HTML elements (button, label, input, etc.)
- Keyboard-accessible controls
- Basic ARIA support for dynamic content:
  - aria-live="polite" for turn history
  - role="status" for leg announcements
  - role="alert" for match winner notifications

---

## Technologies used

- HTML5
- CSS3
- JavaScript (vanilla)
- No external frameworks or backend services

---

## Project structure

```text
G4-darts-score-keeper/
├── index.html        # Application structure and UI
├── style.css         # Styling and layout
├── script.js         # State management, game logic, UI rendering, event handling
├── README.md
