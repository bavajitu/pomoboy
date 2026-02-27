let workMinutes = 50;
let restMinutes = 10;
let timeLeft = workMinutes * 60;
let isWorkTime = true;
let isRunning = false;
let timerInterval = null;

const timerDisplay = document.getElementById("timer");
const presetButtons = document.querySelectorAll(".preset-btn");
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
  isRunning = false;
  document.body.style.backgroundColor = "#000000"; // Reset background
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function playNotification() {
  // Visual notification - flash the timer
  timerDisplay.style.transition = "color 0.2s";
  timerDisplay.style.color = "#FF4444";
  setTimeout(() => {
    timerDisplay.style.color = "#EBDBB2";
  }, 500);

  // Try to play audio notification (browser may block autoplay)
  try {
    const audio = new Audio();
    audio.src =
      "data:audio/wav;base64,UklGRlwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVoAAACAgICAf39/f39/f3+AgICAf39/f39/f3+AgICAf39/f39/f3+AgICAf39/f39/f3+AgICAf39/f39/f3+AgICAf39/fw==";
    audio.play().catch((e) => console.log("Audio play failed:", e));
  } catch (e) {
    console.log("Audio not supported");
  }

  // Optional: browser notification if permitted
  if (Notification.permission === "granted") {
    new Notification("Pomodoro Timer", {
      body: isWorkTime
        ? "Work session finished! Time for a break."
        : "Break finished! Time to focus.",
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍅</text></svg>',
    });
  }
}

function startTimer() {
  if (timerInterval) return;

  isRunning = true;

  timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      // Switch between work/rest
      isWorkTime = !isWorkTime;
      timeLeft = (isWorkTime ? workMinutes : restMinutes) * 60;
      playNotification(); // Play notification when timer completes
    } else {
      timeLeft--;
    }
    updateDisplay();
  }, 1000);
}

function pauseTimer() {
  stopTimer();
  isRunning = false;
}

function toggleTimer() {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
    // Request notification permission on first start
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }
}

function resetTimer() {
  stopTimer();
  isWorkTime = true;
  timeLeft = workMinutes * 60;
  updateDisplay();
  isRunning = false;
  document.body.style.backgroundColor = "#000000";
  timerDisplay.style.color = "#EBDBB2";
}

// Event Listeners
presetButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const work = parseInt(btn.dataset.work);
    const rest = parseInt(btn.dataset.rest);
    switchPreset(work, rest, btn);
  });
});

timerDisplay.addEventListener("click", toggleTimer);
resetBtn.addEventListener("click", resetTimer);

// Initialize
updateDisplay();
setPresetActive(document.querySelector('[data-work="50"]'));
