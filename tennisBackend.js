// Tennis Score Simulator

// Probabilities 
const playerA = {
   serveWin: 0.5, // Probability of winning a point when serving
   returnWin: 0.7 // Probability of winning a point when not serving
 };

 const playerB = {
   serveWin: 0.5,
   returnWin: 0.5
 };

// Function to simulate a point
function simulatePoint(serverWinProb) {
  return Math.random() < serverWinProb;
}

// Function to simulate a game
function simulateGame(serverWinProb, returnWinProb) {
  let serverPoints = 0;
  let returnerPoints = 0;

  while (true) {
    if (simulatePoint(serverWinProb)) {
      serverPoints++;
    } else {
      returnerPoints++;
    }

    // A player wins the game if they reach 4 points and lead by at least 2
    if (serverPoints >= 4 && serverPoints - returnerPoints >= 2) {
      return "server";
    } else if (returnerPoints >= 4 && returnerPoints - serverPoints >= 2) {
      return "returner";
    }
  }
}

// Function to simulate a tiebreaker (correct serving rules and starting server)
function simulateTiebreaker(lastServerWasPlayerA, playerAProb, playerBProb) {
  let playerAPoints = 0;
  let playerBPoints = 0;
  let pointsPlayed = 0; // Track the total points played to alternate servers correctly

  // Counters for the number of serves
  let playerAServes = 0;
  let playerBServes = 0;

  // Determine the first server in the tiebreaker
  let playerAIsServing = !lastServerWasPlayerA;

  while (true) {
    const serverWinProb = playerAIsServing ? playerAProb : playerBProb;

    // Increment the serve counter for the current server
    if (playerAIsServing) {
      playerAServes++;
    } else {
      playerBServes++;
    }

    // Simulate the point
    if (simulatePoint(serverWinProb)) {
      if (playerAIsServing) {
        playerAPoints++;
      } else {
        playerBPoints++;
      }
    } else {
      if (playerAIsServing) {
        playerBPoints++;
      } else {
        playerAPoints++;
      }
    }

    pointsPlayed++;

    // Alternate servers every two points after the first point
    if (pointsPlayed > 1 && pointsPlayed % 2 === 0) {
      playerAIsServing = !playerAIsServing;
    }

    // A player wins the tiebreaker if they reach 7 points and lead by at least 2
    if (playerAPoints >= 7 && playerAPoints - playerBPoints >= 2) {
      //console.log(`Tiebreaker finished. Player A served ${playerAServes} times, Player B served ${playerBServes} times.`);
      return "Player A";
    } else if (playerBPoints >= 7 && playerBPoints - playerAPoints >= 2) {
      //console.log(`Tiebreaker finished. Player A served ${playerAServes} times, Player B served ${playerBServes} times.`);
      return "Player B";
    }
  }
}

// Simulate a set and return the score
function simulateSetWithScore(playerAIsServing, playerAProb, playerBProb) {
  let playerAGames = 0;
  let playerBGames = 0;

  while (true) {
    const serverWinProb = playerAIsServing ? playerAProb : playerBProb;
    const returnWinProb = playerAIsServing ? playerBProb : playerAProb;

    const winner = simulateGame(serverWinProb, returnWinProb);

    if (winner === "server") {
      if (playerAIsServing) {
        playerAGames++;
      } else {
        playerBGames++;
      }
    } else {
      if (playerAIsServing) {
        playerBGames++;
      } else {
        playerAGames++;
      }
    }

    // Check for tiebreaker scenario
    if (playerAGames === 6 && playerBGames === 6) {
      const tiebreakerWinner = simulateTiebreaker(playerAIsServing, playerAProb, playerBProb);
      if (tiebreakerWinner === "Player A") {
        playerAGames = 7; // Update the score to reflect the tiebreak win
        playerBGames = 6;
        return { winner: "Player A", score: `${playerAGames}-${playerBGames}` };
      } else {
        playerAGames = 6;
        playerBGames = 7; // Update the score to reflect the tiebreak win
        return { winner: "Player B", score: `${playerAGames}-${playerBGames}` };
      }
    }

    // A player wins the set if they reach 6 games and lead by at least 2
    if (playerAGames >= 6 && playerAGames - playerBGames >= 2) {
      return { winner: "Player A", score: `${playerAGames}-${playerBGames}` };
    } else if (playerBGames >= 6 && playerBGames - playerAGames >= 2) {
      return { winner: "Player B", score: `${playerAGames}-${playerBGames}` };
    }

    // Alternate server for the next game
    playerAIsServing = !playerAIsServing;
  }
}

// Simulate a match (best of 3 sets) and return the score
function simulateMatchWithScore(playerAProb, playerBProb) {
  let playerASets = 0;
  let playerBSets = 0;
  let playerAIsServing = true;
  const setScores = [];

  while (true) {
    const setResult = simulateSetWithScore(playerAIsServing, playerAProb, playerBProb);
    //console.log(playerAIsServing ? "Player A served first this set." : "Player B served first this set.");
    const { winner, score } = setResult;

    setScores.push(score);

    if (winner === "Player A") {
      playerASets++;
    } else {
      playerBSets++;
    }

    // A player wins the match if they win 2 sets
    if (playerASets === 2) {
      return {
        winner: "Player A",
        score: `${playerASets}-${playerBSets} (${setScores.join(", ")})`
      };
    } else if (playerBSets === 2) {
      return {
        winner: "Player B",
        score: `${playerASets}-${playerBSets} (${setScores.join(", ")})`
      };
    }

    // Alternate server for the next set
    playerAIsServing = !playerAIsServing;
  }
}

// Simulate multiple matches
function simulateMatches(numMatches, playerAProb, playerBProb) {
  const results = { playerAWins: 0, playerBWins: 0, matchResults: [], scoreDistribution: {} };

  for (let i = 0; i < numMatches; i++) {
    const matchResult = simulateMatchWithScore(playerAProb, playerBProb);
    const { winner, score } = matchResult;

    // Store the match result
    results.matchResults.push(matchResult);

    // Update the match win count
    if (winner === "Player A") {
      results.playerAWins++;
    } else {
      results.playerBWins++;
    }
  }

  // Calculate the score distribution based on set results
  results.matchResults.forEach(match => {
    // Extract the part of the score string inside parentheses
    const setScoresString = match.score.match(/\(([^)]+)\)/);
    if (setScoresString) {
      // Split the set scores by commas and trim any whitespace
      const setScores = setScoresString[1].split(",").map(score => score.trim());
      setScores.forEach(setScore => {
        if (!results.scoreDistribution[setScore]) {
          results.scoreDistribution[setScore] = 0;
        }
        results.scoreDistribution[setScore]++;
      });
    }
  });

  return results;
}