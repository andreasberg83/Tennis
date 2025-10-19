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

// Function to generate the bar graph
function generateScoreDistributionGraph(scoreDistribution) {
  const barGraph = document.querySelector(".bar-graph");
  barGraph.innerHTML = ""; // Clear any existing bars

  // Total sets for normalization
  const totalSets = Object.values(scoreDistribution).reduce((sum, value) => sum + value, 0);

  // Scores in the required order
  const scores = ["6-0", "6-1", "6-2", "6-3", "6-4", "7-5", "7-6", "6-7", "5-7", "4-6", "3-6", "2-6", "1-6", "0-6"];

  // Generate bars for each score
  scores.forEach(score => {
    const percentage = ((scoreDistribution[score] || 0) / totalSets) * 100;

    // Create the bar
    const bar = document.createElement("div");
    bar.classList.add("score-distribution-bar"); // Use only the specific class for score distribution bars

    bar.style.width = `${percentage}%`; // Set the width of the bar
    bar.title = `${score}: ${percentage.toFixed(1)}%`;

    // Create the label
    const label = document.createElement("div");
    label.classList.add("bar-label");
    label.textContent = score;

    // Append the bar and label to the graph
    const barContainer = document.createElement("div");
    barContainer.style.display = "flex";
    barContainer.style.alignItems = "center";
    barContainer.appendChild(label);
    barContainer.appendChild(bar);

    barGraph.appendChild(barContainer);
  });
}

// Simulate matches and update results 
simulateBtn.addEventListener("click", () => {
  const playerAProb = parseFloat(playerAServeSlider.value) / 100;
  const playerBProb = parseFloat(playerBServeSlider.value) / 100;

  // Simulate matches
  const numMatches = 10000;
  const results = simulateMatches(numMatches, playerAProb, playerBProb);

  const playerAWinPercentage = (results.playerAWins / numMatches) * 100;
  const playerBWinPercentage = (results.playerBWins / numMatches) * 100;

  // Update bar widths dynamically
  playerABar.style.width = `${playerAWinPercentage}%`;
  playerBBar.style.width = `${playerBWinPercentage}%`;

  // Ensure the classes are not overwritten
  playerABar.classList.add("playerA-bar");
  playerBBar.classList.add("playerB-bar");

  // Update bar text to show only the percentage
  playerABar.textContent = `${playerAWinPercentage.toFixed(1)}%`;
  playerBBar.textContent = `${playerBWinPercentage.toFixed(1)}%`;

  // Generate the bar graph for score distribution
  generateScoreDistributionGraph(results.scoreDistribution);
  console.log(results.scoreDistribution);
});