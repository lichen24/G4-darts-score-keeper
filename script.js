// ==============================
// 1.State (application data)
// ==============================
let players = ["", ""];
let scores = [0, 0];
let legs = [0, 0];
let legCounter = 0;
let currentPlayer = 0;
let matchEnded = false;
let turns = [];
let editingTurnIndex = null;
let maxLegs = 3;

// ==============================
// 2.DOM element references (UI)
// ==============================
const startBtn = document.getElementById("startBtn");
const darkModeBtn = document.getElementById("darkModeBtn");
const setupSection = document.getElementById("setup");
const gameSection = document.getElementById("game");
const setSizeSelect = document.getElementById("setSize");

const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
const avatar1Input = document.getElementById("avatar1");
const avatar2Input = document.getElementById("avatar2");
const gameTypeSelect = document.getElementById("gameType");

const name1El = document.getElementById("name1");
const name2El = document.getElementById("name2");
const score1El = document.getElementById("score1");
const score2El = document.getElementById("score2");
//average score per turn
const avg1El = document.getElementById("avg1");
const avg2El = document.getElementById("avg2");
const p1avatarEl = document.getElementById("p1avatar");
const p2avatarEl = document.getElementById("p2avatar");

//const turnScoreInput = document.getElementById("turnScore");
const currentPlayerLabel = document.getElementById("currentPlayerLabel");
const submitTurnBtn = document.getElementById("submitTurn");
const resetLegBtn = document.getElementById("resetLeg");
const turnHistoryEl = document.getElementById("turnHistory");

const legsP1El = document.getElementById("legsP1");
const legsP2El = document.getElementById("legsP2");
const announcementEl = document.getElementById("announcement");
const matchWinnerEl = document.getElementById("matchWinner");
const celebrationEl = document.getElementById("celebration");
const winnerNameEl = document.getElementById("winnerName");
const legsHistoryEl = document.getElementById("legsHistory");
const rematchBtn = document.getElementById("rematchBtn");
const newGameBtn = document.getElementById("newGameBtn");
const endGameBtn = document.getElementById("endGameBtn");
const helpBtn = document.getElementById("helpBtn");
const helpBox = document.getElementById("helpBox");

const dart1Input = document.getElementById("dart1");
const dart2Input = document.getElementById("dart2");
const dart3Input = document.getElementById("dart3");



// ==============================
// 3. UI helper functions
// ==============================
function resetToSetup() {
  matchEnded = false;
  players = ["", ""];
  scores = [0, 0];
  legs = [0, 0];
  legCounter = 0;
  currentPlayer = 0;
  turns = [];
  editingTurnIndex = null;

  player1Input.value = "";
  player2Input.value = "";
  avatar1Input.value = "";
  avatar2Input.value = "";

  name1El.textContent = "";
  name2El.textContent = "";
  score1El.textContent = "";
  score2El.textContent = "";

  p1avatarEl.src = "";
  p2avatarEl.src = "";

  legsP1El.textContent = "0";
  legsP2El.textContent = "0";

  announcementEl.style.display = "none";
  announcementEl.textContent = "";
  matchWinnerEl.style.display = "none";
  celebrationEl.style.display = "none";
  winnerNameEl.textContent = "";

  legsHistoryEl.innerHTML = "Leg Wins:";
  turnHistoryEl.innerHTML = "";

  avg1El.textContent = "0";
  avg2El.textContent = "0";

  setupSection.style.display = "block";
  gameSection.style.display = "none";

  rematchBtn.style.display = "none";
  newGameBtn.style.display = "none";
}


function loadAvatar(fileInput, imgEl) {
  const file = fileInput.files && fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    imgEl.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function updateScores() {
  score1El.textContent = scores[0];
  score2El.textContent = scores[1];

  // Simple checkout highlight when <= 170
  [score1El, score2El].forEach((el, i) => {
    const val = scores[i];
    el.style.color = val <= 170 ? "#28a745" : "var(--text)";
  });

  // Small pop animation
  [score1El, score2El].forEach((el) => {
    el.style.transition = "transform 0.15s";
    el.style.transform = "scale(1.15)";
    setTimeout(() => {
      el.style.transform = "scale(1)";
    }, 150);
  });
}

function updateCurrentPlayerLabel() {
  currentPlayerLabel.textContent = players[currentPlayer] || "";
  name1El.classList.remove("current-player");
  name2El.classList.remove("current-player");

  // Add highlight to the active player
  if (currentPlayer === 0) {
    name1El.classList.add("current-player");
  } else {
    name2El.classList.add("current-player");
  }
}

function addTurnEntry(turn, index) {
  const div = document.createElement("div");
  div.className = "turn-entry";

  // Editing mode
  if (editingTurnIndex === index) {
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = "180";
    input.value = turn.score;
    input.style.width = "80px";

    div.appendChild(
      document.createTextNode(`${players[turn.playerIndex]}: `)
    );
    div.appendChild(input);

    // Save button
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.style.marginLeft = "8px";
    saveBtn.onclick = () => {
      const val = Number(input.value);
      if (Number.isNaN(val) || val < 0 || val > 180) {
        alert("Invalid score (0–180)");
        return;
      }

      turns[index].score = val;
      editingTurnIndex = null;
      recalculateScores();
      renderTurnHistory();
    };
    div.appendChild(saveBtn);

    // Cancel button
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.style.marginLeft = "5px";
    cancelBtn.onclick = () => {
      editingTurnIndex = null;
      renderTurnHistory();
    };
    div.appendChild(cancelBtn);

  } else {
    // Display turn normally
    const text = document.createElement("span");
    text.textContent = `${players[turn.playerIndex]}: ${turn.score}`;
    div.appendChild(text);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.style.marginLeft = "10px";
    editBtn.onclick = () => {
      editingTurnIndex = index;
      renderTurnHistory();
    };
    div.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.marginLeft = "5px";
    deleteBtn.onclick = () => deleteTurn(index);
    div.appendChild(deleteBtn);
  }

  turnHistoryEl.appendChild(div);
}


function renderTurnHistory() {
  turnHistoryEl.innerHTML = "";
  turns.forEach((turn, index) => {
    addTurnEntry(turn, index);
  });
}

// Update average scores per turn
function updateAverages() {
  const totals = [0, 0];
  const counts = [0, 0];

  turns.forEach(turn => {
    totals[turn.playerIndex] += turn.score;
    counts[turn.playerIndex]++;
  });

  avg1El.textContent = counts[0] === 0
    ? "0"
    : (totals[0] / counts[0]).toFixed(1);

  avg2El.textContent = counts[1] === 0
    ? "0"
    : (totals[1] / counts[1]).toFixed(1);
}


function appendLegHistory(winnerIndex) {
  const div = document.createElement("div");
  div.textContent = `${players[winnerIndex]} won leg ${legCounter}`;
  legsHistoryEl.appendChild(div);
  legsHistoryEl.scrollTop = legsHistoryEl.scrollHeight;
}

function clearDartInputs() {
  dart1Input.value = "";
  dart2Input.value = "";
  dart3Input.value = "";
}


// ==============================
// 4.Game logic functions
// ==============================
function getStartScore() {
  return Number(gameTypeSelect.value) || 301;
}

function resetLeg() {
  const startScore = getStartScore();
  scores = [startScore, startScore];
  updateScores();
  turnHistoryEl.innerHTML = "";
  turns = [];
  currentPlayer = 0;
  updateCurrentPlayerLabel();
  announcementEl.style.display = "none";
  announcementEl.textContent = "";
  turnScoreInput.value = "";
  editingTurnIndex = null;
  avg1El.textContent = "0";
  avg2El.textContent = "0";
}

function handleLegWin(winnerIndex) {
  // increase legs and leg counter
  legs[winnerIndex]++;
  legCounter++;
  legsP1El.textContent = legs[0];
  legsP2El.textContent = legs[1];

  announcementEl.style.display = "block";
  announcementEl.textContent = `${players[winnerIndex]} won leg ${legCounter}!`;
  appendLegHistory(winnerIndex);

  // First to  maxLegs wins the match
  if (legs[winnerIndex] === maxLegs) {
    matchEnded = true;
    matchWinnerEl.style.display = "block";
    matchWinnerEl.textContent = `${players[winnerIndex]} WINS THE MATCH!`;

    //show celebration message
    winnerNameEl.textContent = players[winnerIndex];
    celebrationEl.style.display = "block";

    rematchBtn.style.display = "inline-block";
    newGameBtn.style.display = "inline-block";
    return;
  }

  // Start new leg (scores reset, legs kept, leg counter continues)
  resetLeg();
}

// Delete turn at index
function deleteTurn(index) {
  turns.splice(index, 1);
  recalculateScores();
  renderTurnHistory();
  updateAverages();

}

// Recalculate scores from turns
function recalculateScores() {
  scores = [getStartScore(), getStartScore()];
  currentPlayer = 0;

  turns.forEach(turn => {
    const idx = turn.playerIndex;
    const newScore = scores[idx] - turn.score;

    if (newScore >= 0) {
      scores[idx] = newScore;
    }

    currentPlayer = 1 - currentPlayer;
  });

  updateScores();
  updateCurrentPlayerLabel();
}

// ==============================
// 5.Event handlers
// ==============================
startBtn.addEventListener("click", () => {
  const p1 = player1Input.value.trim();
  const p2 = player2Input.value.trim();
  if (!p1 || !p2) {
    alert("Enter both player names");
    return;
  }

  players = [p1, p2];
  legs = [0, 0];
  legCounter = 0;
  matchEnded = false;

  maxLegs = Number(setSizeSelect.value) || 3;

  legsP1El.textContent = "0";
  legsP2El.textContent = "0";
  announcementEl.style.display = "none";
  announcementEl.textContent = "";
  matchWinnerEl.style.display = "none";
  matchWinnerEl.textContent = "";
  legsHistoryEl.innerHTML = "Leg Wins:";

  name1El.textContent = p1;
  name2El.textContent = p2;

  scores = [getStartScore(), getStartScore()];
  updateScores();

  loadAvatar(avatar1Input, p1avatarEl);
  loadAvatar(avatar2Input, p2avatarEl);

  setupSection.style.display = "none";
  gameSection.style.display = "block";

  currentPlayer = 0;
  updateCurrentPlayerLabel();
  turnHistoryEl.innerHTML = "";
  turnScoreInput.value = "";
  rematchBtn.style.display = "none";
  newGameBtn.style.display = "none";
});

// Event: Submit turn
submitTurnBtn.addEventListener("click", () => {
  if (matchEnded) return;

  const d1 = Number(dart1Input.value);
  const d2 = Number(dart2Input.value);
  const d3 = Number(dart3Input.value);

  // Validate each dart
  if ([d1, d2, d3].some(v => Number.isNaN(v) || v < 0 || v > 60)) {
    alert("Each dart score must be between 0 and 60");
    return;
  }

  const val = d1 + d2 + d3; // total turn score (0–180)
  const idx = currentPlayer;
  const newScore = scores[idx] - val;

  // Store the turn (even if bust)
  turns.push({
    playerIndex: idx,
    score: val,
  });

  if (newScore < 0) {
    renderTurnHistory();
    alert("Bust! Score cannot go below 0");
  } else {
    scores[idx] = newScore;
    updateScores();
    renderTurnHistory();
    updateAverages();

    if (newScore === 0) {
      handleLegWin(idx);
      clearDartInputs();
      return;
    }
  }

  // Switch player
  currentPlayer = 1 - currentPlayer;
  updateCurrentPlayerLabel();
  clearDartInputs();
});



// Event: Reset leg manually (does NOT reset legs count or leg counter)
resetLegBtn.addEventListener("click", () => {
  if (matchEnded) return; // after match, no more play
  resetLeg();
});

// Rematch button: same players & avatars, reset legs/scores/history/legs
rematchBtn.addEventListener("click", () => {
  matchEnded = false;
  legs = [0, 0];
  legCounter = 0;
  legsP1El.textContent = "0";
  legsP2El.textContent = "0";
  matchWinnerEl.style.display = "none";
  matchWinnerEl.textContent = "";
  celebrationEl.style.display = "none";
  winnerNameEl.textContent = "";
  announcementEl.style.display = "none";
  announcementEl.textContent = "";
  legsHistoryEl.innerHTML = "Leg Wins:";
  scores = [getStartScore(), getStartScore()];
  updateScores();
  turnHistoryEl.innerHTML = "";
  currentPlayer = 0;
  updateCurrentPlayerLabel();
  turnScoreInput.value = "";
  rematchBtn.style.display = "none";
  newGameBtn.style.display = "none";
  editingTurnIndex = null;
  //reset averages
  avg1El.textContent = "0";
  avg2El.textContent = "0";

});

// New Game button: back to setup, new players
newGameBtn.addEventListener("click", () => {
  matchEnded = false;
  players = ["", ""];
  scores = [0, 0];
  legs = [0, 0];
  legCounter = 0;
  currentPlayer = 0;

  player1Input.value = "";
  player2Input.value = "";
  avatar1Input.value = "";
  avatar2Input.value = "";

  name1El.textContent = "";
  name2El.textContent = "";
  score1El.textContent = "";
  score2El.textContent = "";
  legsP1El.textContent = "0";
  legsP2El.textContent = "0";
  announcementEl.style.display = "none";
  announcementEl.textContent = "";
  matchWinnerEl.style.display = "none";
  matchWinnerEl.textContent = "";
  celebrationEl.style.display = "none";
  winnerNameEl.textContent = ""
  legsHistoryEl.innerHTML = "Leg Wins:";
  turnHistoryEl.innerHTML = "";
  turnScoreInput.value = "";
  p1avatarEl.src = "";
  p2avatarEl.src = "";

  setupSection.style.display = "block";
  gameSection.style.display = "none";
  rematchBtn.style.display = "none";
  newGameBtn.style.display = "none";
  editingTurnIndex = null;
  //reset averages
  avg1El.textContent = "0";
  avg2El.textContent = "0";

});

// Event: Dark mode toggle
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

endGameBtn.addEventListener("click", () => {
  resetToSetup();
});


helpBtn.addEventListener("click", () => {
    helpBox.classList.toggle("hidden");
});

// Close help when clicking outside
document.addEventListener("click", (e) => {
  const helpBtn = document.getElementById("helpBtn");
  const helpBox = document.getElementById("helpBox");
  if (!helpBtn || !helpBox) return;

  const clickedInsideHelp = helpBox.contains(e.target);
  const clickedHelpButton = helpBtn.contains(e.target);

  if (!clickedInsideHelp && !clickedHelpButton) {
    helpBox.classList.add("hidden");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const scoreInput = document.getElementById("scoreInput");
  const addScoreBtn = document.getElementById("addScoreBtn");

  if (scoreInput && addScoreBtn) {
    scoreInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();     // stop form reload
        addScoreBtn.click();    // reuse existing logic
      }
    });
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const helpBox = document.getElementById("helpBox");
    if (helpBox) {
      helpBox.classList.add("hidden");
    }
  }
});
