let workMinutes = 50;
let restMinutes = 10;
let timeLeft = workMinutes * 60;
let isWorkTime = true;
let isRunning = false;
let timerInterval = null;

const timerDisplay = document.getElementById("timer");
const presetButtons = document.querySelectorAll(".preset-btn");
const startPauseBtn = document.getElementById("startPauseBtn");
const resetBtn = document.getElementById("resetBtn");

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);
}

function setPresetActive(activeBtn) {
  presetButtons.forEach((btn) => btn.classList.remove("active"));
  activeBtn.classList.add("active");
}

function switchPreset(work, rest, btn) {
  stopTimer();
  workMinutes = work;
  restMinutes = rest;
  isWorkTime = true;
  timeLeft = workMinutes * 60;
  updateDisplay();
  setPresetActive(btn);
  startPauseBtn.textContent = "▶";
  isRunning = false;
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function startTimer() {
  if (timerInterval) return;

  isRunning = true;
  startPauseBtn.textContent = "⏸";

  timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      // Switch between work/rest
      isWorkTime = !isWorkTime;
      timeLeft = (isWorkTime ? workMinutes : restMinutes) * 60;

      // Update active preset based on mode (visual cue only)
      // No need to change button active state, keep current preset
    } else {
      timeLeft--;
    }
    updateDisplay();
  }, 1000);
}

function pauseTimer() {
  stopTimer();
  isRunning = false;
  startPauseBtn.textContent = "▶";
}

function resetTimer() {
  stopTimer();
  isWorkTime = true;
  timeLeft = workMinutes * 60;
  updateDisplay();
  isRunning = false;
  startPauseBtn.textContent = "▶";
}

// Event Listeners
presetButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const work = parseInt(btn.dataset.work);
    const rest = parseInt(btn.dataset.rest);
    switchPreset(work, rest, btn);
  });
});

startPauseBtn.addEventListener("click", () => {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
});

resetBtn.addEventListener("click", resetTimer);

// Initialize
updateDisplay();
setPresetActive(document.querySelector('[data-work="50"]'));
