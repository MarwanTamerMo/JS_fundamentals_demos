"use strict";

// calculator state — holds all values the calculator needs
const state = {
  currentValue: "0",
  expression: "",
  operator: null,
  prevValue: null,
  waitingForOperand: false,
  history: [],
};

// grab the DOM elements we need
const mainDisplay       = document.getElementById("main-display");
const expressionDisplay = document.getElementById("expression-display");
const historyList       = document.getElementById("history-list");
const historyBadge      = document.getElementById("history-badge");
const btnClearHistory   = document.getElementById("btn-clear-history");


// updates the screen to match the current state
function updateDisplay() {
  mainDisplay.textContent = state.currentValue;
  expressionDisplay.textContent = state.expression;

  // play the pop animation by adding then removing the class
  mainDisplay.classList.add("pop");
  setTimeout(() => {
    mainDisplay.classList.remove("pop");
  }, 200);
}


// called when a digit button (0-9) is pressed
function handleDigit(digit) {
  if (state.waitingForOperand) {
    // start fresh with the new digit after an operator was pressed
    state.currentValue = digit;
    state.waitingForOperand = false;
  } else {
    // avoid showing leading zero like "07"
    if (state.currentValue === "0" && digit !== ".") {
      state.currentValue = digit;
    } else {
      state.currentValue += digit;
    }
  }
  updateDisplay();
}


// called when the decimal "." button is pressed
function handleDecimal() {
  if (state.waitingForOperand) {
    state.currentValue = "0.";
    state.waitingForOperand = false;
  } else {
    // only add a dot if there isn't one already
    if (!state.currentValue.includes(".")) {
      state.currentValue += ".";
    }
  }
  updateDisplay();
}


// called when an operator button (+, −, ×, ÷) is pressed
function handleOperator(op) {
  // if there is already a pending calculation, resolve it first (chaining)
  if (state.prevValue !== null && !state.waitingForOperand) {
    const result = calculate();
    if (result === "Error") {
      showError();
      return;
    }
    state.prevValue = result;
    state.currentValue = result;
  }

  // store current number and the chosen operator, then wait for next operand
  state.prevValue = state.currentValue;
  state.operator = op;
  state.waitingForOperand = true;
  state.expression = `${state.prevValue} ${op}`;

  // highlight the pressed operator button
  const operatorButtons = document.querySelectorAll(".btn-operator");
  operatorButtons.forEach(button => button.classList.remove("active"));
  document.querySelector(`[data-value="${op}"]`).classList.add("active");

  updateDisplay();
}


// does the actual math and returns the result as a string
function calculate() {
  const prevValue    = parseFloat(state.prevValue);
  const currentValue = parseFloat(state.currentValue);

  switch (state.operator) {
    case "+":
      return (parseFloat((prevValue + currentValue).toPrecision(10))).toString();
    case "−":
      return (parseFloat((prevValue - currentValue).toPrecision(10))).toString();
    case "×":
      return (parseFloat((prevValue * currentValue).toPrecision(10))).toString();
    case "÷":
      if (currentValue === 0) return "Error"; // can't divide by zero
      return (parseFloat((prevValue / currentValue).toPrecision(10))).toString();
    default:
      return currentValue.toString();
  }
}


// called when "=" is pressed
function handleEquals() {
  // do nothing if there's no full expression yet
  if (state.operator === null || state.prevValue === null) return;

  const result = calculate();
  const fullExpression = `${state.prevValue} ${state.operator} ${state.currentValue} = ${result}`;

  if (result === "Error") {
    showError();
    return;
  }

  // update state with the result and reset operator info
  state.currentValue = result;
  state.expression = fullExpression;
  state.operator = null;
  state.prevValue = null;
  state.waitingForOperand = true;

  document.querySelectorAll(".btn-operator").forEach(btn => btn.classList.remove("active"));

  updateDisplay();

  // show the result in the badge below the display
  historyBadge.textContent = `= ${result}`;
  historyBadge.classList.remove("hidden");

  // save to history asynchronously (Promise), then re-render the list
  saveToHistory(fullExpression, result).then(() => {
    renderHistory();
  });
}


// simulates saving to a database using a Promise + setTimeout
function saveToHistory(expression, result) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (result === "Error") {
        reject("Cannot save an error result to history.");
        return;
      }
      state.history.push({ expression, result });
      resolve();
    }, 150);
  });
}


// reads state.history and rebuilds the history list in the DOM
function renderHistory() {
  if (state.history.length === 0) {
    historyList.innerHTML = '<li class="history-empty">No calculations yet…</li>';
    return;
  }

  // build all list items using .map() then join into one HTML string
  historyList.innerHTML = state.history.map(entry => {
    return `<li class="history-entry">
              <span class="expression">${entry.expression}</span>
              <span class="result">${entry.result}</span>
            </li>`;
  }).join("");

  // scroll to the latest entry
  historyList.scrollTop = historyList.scrollHeight;
}


// resets the calculator back to its initial state (keeps history)
function handleClear() {
  state.currentValue = "0";
  state.expression = "";
  state.operator = null;
  state.prevValue = null;
  state.waitingForOperand = false;

  document.querySelectorAll(".btn-operator").forEach(btn => btn.classList.remove("active"));

  historyBadge.classList.add("hidden");
  historyBadge.textContent = "";

  updateDisplay();
}


// toggles the sign of the current number (+/-)
function handleSign() {
  if (state.currentValue === "0") return;
  const value = parseFloat(state.currentValue);
  state.currentValue = (-value).toString();
  updateDisplay();
}


// converts the current number to a percentage (÷ 100)
function handlePercent() {
  const value = parseFloat(state.currentValue);
  state.currentValue = (value / 100).toString();
  updateDisplay();
}


// shows an error on the display and resets after 500ms
function showError() {
  state.currentValue = "Error";
  updateDisplay();
  mainDisplay.classList.add("shake");
  setTimeout(() => {
    mainDisplay.classList.remove("shake");
    handleClear();
  }, 500);
}


// adds a ripple CSS class to a button then removes it so it can replay
function triggerRipple(button) {
  button.classList.add("ripple");
  setTimeout(() => button.classList.remove("ripple"), 400);
}


// clears all history entries and refreshes the list
function handleClearHistory() {
  state.history = [];
  renderHistory();
}


// --- implemented with the help of Antigravity ---

// event delegation: one listener on the grid handles all button clicks
document.querySelector(".btn-grid").addEventListener("click", (e) => {
  const btn = e.target.closest(".btn");
  if (!btn) return;

  const { action, value } = btn.dataset;

  triggerRipple(btn);

  switch (action) {
    case "digit":    handleDigit(value);    break;
    case "decimal":  handleDecimal();       break;
    case "operator": handleOperator(value); break;
    case "equals":   handleEquals();        break;
    case "clear":    handleClear();         break;
    case "sign":     handleSign();          break;
    case "percent":  handlePercent();       break;
  }
});

// clear history button listener
btnClearHistory.addEventListener("click", handleClearHistory);

// keyboard support — maps keys to the same handler functions
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (key >= "0" && key <= "9")       { handleDigit(key);    return; }
  if (key === ".")                     { handleDecimal();      return; }
  if (key === "Enter" || key === "=") { handleEquals();       return; }
  if (key === "Escape")               { handleClear();        return; }
  if (key === "Backspace")            { handleClear();        return; }
  if (key === "+")                    { handleOperator("+");  return; }
  if (key === "-")                    { handleOperator("−");  return; }
  if (key === "*")                    { handleOperator("×");  return; }
  if (key === "/") {
    e.preventDefault();
    handleOperator("÷");
  }
});

// runs once on page load to set up the initial empty history
(function init() {
  renderHistory();
})();
