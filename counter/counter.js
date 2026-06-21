"use strict";

// counter state
const state = {
  count: 0,
  step: 1,
  log: [],
  milestones: [10, 25, 50, 100],
};

// DOM references
const counterDisplay = document.getElementById("counter-display");
const stepInput      = document.getElementById("step-input");
const statusMsg      = document.getElementById("status-msg");
const milestoneBadge = document.getElementById("milestone-badge");
const logList        = document.getElementById("log-list");
const btnClearLog    = document.getElementById("btn-clear-log");


// updates the number on screen and its color based on sign
function updateDisplay() {
  counterDisplay.textContent = state.count;

  counterDisplay.classList.remove("positive", "negative", "zero");
  if (state.count > 0) counterDisplay.classList.add("positive");
  else if (state.count < 0) counterDisplay.classList.add("negative");
  else counterDisplay.classList.add("zero");

  // pop animation — add class then remove it so it can replay
  counterDisplay.classList.add("pop");
  setTimeout(() => counterDisplay.classList.remove("pop"), 200);
}


// reads and validates the step input value
function readStep() {
  const value = parseInt(stepInput.value, 10);
  if (isNaN(value) || value < 1) return 1;
  return value;
}


// adds the step to the count
function increment() {
  state.step = readStep();
  state.count += state.step;
  updateDisplay();
  checkMilestone();
  logAction("increment").then(() => renderLog());
}


// subtracts the step from the count
function decrement() {
  state.step = readStep();
  state.count -= state.step;
  updateDisplay();
  checkMilestone();
  logAction("decrement").then(() => renderLog());
}


// resets the count back to zero
function reset() {
  state.count = 0;
  updateDisplay();
  milestoneBadge.classList.add("hidden");
  milestoneBadge.textContent = "";
  logAction("reset").then(() => renderLog());
}


// simulates an async save using a Promise + setTimeout
function logAction(action) {
  return new Promise((resolve) => {
    setTimeout(() => {
      state.log.push({
        action: action,
        value: state.count,
        time: new Date().toLocaleTimeString(),
      });
      resolve();
    }, 120);
  });
}


// rebuilds the log list in the DOM from state.log
function renderLog() {
  if (state.log.length === 0) {
    logList.innerHTML = '<li class="log-empty">No actions yet…</li>';
    return;
  }

  logList.innerHTML = state.log.map((entry) => {
    return `<li>
      <span>${entry.time} — ${entry.action}</span>
      <span class="log-value">${entry.value}</span>
    </li>`;
  }).join("");

  logList.scrollTop = logList.scrollHeight;
}


// shows the milestone badge if the current count is in the milestones list
function checkMilestone() {
  if (state.milestones.includes(state.count)) {
    milestoneBadge.textContent = `🎉 Milestone: ${state.count}!`;
    milestoneBadge.classList.remove("hidden");
  } else {
    milestoneBadge.classList.add("hidden");
  }
}


// shows a short status message then hides it after 1800ms
function showStatus(message) {
  statusMsg.textContent = message;
  statusMsg.classList.remove("hidden");
  setTimeout(() => {
    statusMsg.classList.add("hidden");
    statusMsg.textContent = "";
  }, 1800);
}


// adds ripple class to button then removes it so it can replay
function triggerRipple(button) {
  button.classList.add("ripple");
  setTimeout(() => button.classList.remove("ripple"), 380);
}


// clears all log entries and refreshes the list
function clearLog() {
  state.log = [];
  renderLog();
}


// --- implemented with the help of Antigravity ---


document.querySelector(".btn-row").addEventListener("click", (e) => {
  const btn = e.target.closest(".btn");
  if (!btn) return;

  triggerRipple(btn);

  switch (btn.dataset.action) {
    case "increment": increment(); break;
    case "decrement": decrement(); break;
    case "reset":     reset();     break;
  }
});

btnClearLog.addEventListener("click", clearLog);

(function init() {
  updateDisplay();
  renderLog();
})();
