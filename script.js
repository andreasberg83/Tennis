// Import the simulateMatches function from tennisBackend.js
// (This works if tennisBackend.js is included as a <script> tag in the HTML)
//const simulateMatches = window.simulateMatches || (() => {});

// Get DOM elements
const playerAServeSlider = document.getElementById("playerA-serve");
const playerBServeSlider = document.getElementById("playerB-serve");
const playerAServeValue = document.getElementById("playerA-serve-value");
const playerBServeValue = document.getElementById("playerB-serve-value");
const simulateBtn = document.getElementById("simulate-btn");
const playerABar = document.querySelector(".playerA-bar");
const playerBBar = document.querySelector(".playerB-bar");

// Update slider values dynamically
playerAServeSlider.addEventListener("input", () => {
  playerAServeValue.textContent = `${playerAServeSlider.value}%`; // Add the % symbol
});

playerBServeSlider.addEventListener("input", () => {
  playerBServeValue.textContent = `${playerBServeSlider.value}%`; // Add the % symbol
});

// Simulate matches and update results
simulateBtn.addEventListener("click", () => {
  const playerAProb = parseFloat(playerAServeSlider.value) / 100;
  const playerBProb = parseFloat(playerBServeSlider.value) / 100;

  // Call the backend simulation
  const numMatches = 10000; // Number of matches to simulate
  const results = simulateMatches(numMatches, playerAProb, playerBProb);

  const playerAWinPercentage = (results.playerAWins / numMatches) * 100;
  const playerBWinPercentage = (results.playerBWins / numMatches) * 100;

  // Update bar widths
  playerABar.style.width = `${playerAWinPercentage}%`;
  playerBBar.style.width = `${playerBWinPercentage}%`;

  // Update bar text to show only the percentage
  playerABar.textContent = `${playerAWinPercentage.toFixed(1)}%`;
  playerBBar.textContent = `${playerBWinPercentage.toFixed(1)}%`;
});