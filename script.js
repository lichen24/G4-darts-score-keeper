// --- State ---
let players = ["", ""];
let scores = [0, 0];
let legs = [0, 0];
let legCounter = 0;
let currentPlayer = 0;
let matchEnded = false;
let maxLegs = 3;

// --- Elements ---
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
const p1avatarEl = document.getElementById("p1avatar");
const p2avatarEl = document.getElementById("p2avatar");

const turnScoreInput = document.getElementById("turnScore");
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

function getStartScore() {
  return Number(gameTypeSelect.value) || 301;
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
}

function addTurnEntry(playerName, val, remaining) {
  const div = document.createElement("div");
  div.className = "turn-entry";
  div.textContent = `${playerName}: ${val} (left ${remaining})`;
  turnHistoryEl.appendChild(div);
  turnHistoryEl.scrollTop = turnHistoryEl.scrollHeight;
}

function resetLeg() {
  const startScore = getStartScore();
  scores = [startScore, startScore];
  updateScores();
  turnHistoryEl.innerHTML = "";
  currentPlayer = 0;
  updateCurrentPlayerLabel();
  announcementEl.style.display = "none";
  announcementEl.textContent = "";
  turnScoreInput.value = "";
}

function appendLegHistory(winnerIndex) {
  const div = document.createElement("div");
  div.textContent = `${players[winnerIndex]} won leg ${legCounter}`;
  legsHistoryEl.appendChild(div);
  legsHistoryEl.scrollTop = legsHistoryEl.scrollHeight;
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

// Event: Start game
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
  if (matchEnded) return; // game finished, ignore input

  const raw = turnScoreInput.value;
  const val = Number(raw);
  if (Number.isNaN(val) || val < 0 || val > 180) {
    alert("Enter a valid score between 0 and 180");
    return;
  }

  const idx = currentPlayer;
  const newScore = scores[idx] - val;

  // Record the attempt in history based on resulting score (or bust)
  if (newScore < 0) {
    addTurnEntry(players[idx], val, scores[idx]);
    alert("Bust! Score cannot go below 0");
  } else {
    scores[idx] = newScore;
    updateScores();
    addTurnEntry(players[idx], val, newScore);

    if (newScore === 0) {
      handleLegWin(idx);
      turnScoreInput.value = "";
      return;
    }
  }

  currentPlayer = 1 - currentPlayer;
  updateCurrentPlayerLabel();
  turnScoreInput.value = "";
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
  winnerNameEl.textContent = "";
  legsHistoryEl.innerHTML = "Leg Wins:";
  turnHistoryEl.innerHTML = "";
  turnScoreInput.value = "";
  p1avatarEl.src = "";
  p2avatarEl.src = "";

  setupSection.style.display = "block";
  gameSection.style.display = "none";
  rematchBtn.style.display = "none";
  newGameBtn.style.display = "none";
});

// Event: Dark mode toggle
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
