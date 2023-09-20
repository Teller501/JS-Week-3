const game = {
    randomNumber: 0,
    score: 20,
  };
  
  function generateRandomNumber() {
    game.randomNumber = Math.floor(Math.random() * 20) + 1;
  }
  
  function updateScore(newScore) {
    document.getElementById("score").textContent = newScore;
  }
  
  function showMessage(message) {
    document.getElementById("message").textContent = message;
  }
  
  function check() {
    const inputNumber = parseInt(document.getElementById("inputNumber").value, 10);
  
    if (isNaN(inputNumber)) {
      showMessage("Please enter a valid number.");
      return;
    }
  
    game.score -= 1;
    updateScore(game.score);
  
    if (inputNumber === game.randomNumber) {
      showMessage("Correct!");
  
      if (game.score > parseInt(document.getElementById("highScore").textContent, 10)) {
        document.getElementById("highScore").textContent = game.score;
      }
    } else {
      showMessage("Wrong!");
  
      if (game.score <= 0) {
        again();
      }
    }
  }
  
  function again() {
    generateRandomNumber();
    game.score = 20;
    updateScore(game.score);
    document.getElementById("inputNumber").value = "";
    showMessage("Start guessing...");
  }
  
  function setUpHandlers() {
    document.getElementById("btnCheck").onclick = check;
    document.getElementById("btnAgain").onclick = again;
  }
  
  setUpHandlers();
  generateRandomNumber();
  updateScore(game.score);
  showMessage("Start guessing...");
  