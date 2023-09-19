let randomNumber = 0;

function generateNumber(){
    randomNumber = Math.floor(Math.random() * 20)+1;
}

generateNumber()

function setUpHandlers() {
    document.getElementById("btnCheck").onclick = check;
    document.getElementById("btnAgain").onclick = again;
  }

  setUpHandlers()

  function check(){
    let inputNumber = document.getElementById("inputNumber").value
    let highscore = document.getElementById("highScore");
    let score = document.getElementById("score");
    score.innerHTML -= 1;
    console.log(inputNumber)
    console.log(randomNumber)

    if(inputNumber == randomNumber){
        document.getElementById("message").innerHTML = "Correct!"
        if (highscore.innerHTML < score.innerHTML){
            highscore.innerHTML = score.innerHTML;
        }
    }else {
        document.getElementById("message").innerHTML = "Wrong!"
        if(score.innerHTML <= 0){
            again();
        }
    }
  }

  function again(){
    generateNumber();
    document.getElementById("score").innerHTML = 20;
    document.getElementById("inputNumber").value = ""
    document.getElementById("message").innerHTML = "Start guessing..."
  }