//load board from string
const easy = [
  "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
  "685329174971485326234761859362574981549618732718293465823946517197852643456137298",
];
const medium = [
  "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
  "619472583243985617587316924158247369926531478734698152891754236365829741472163895",
];
const hard = [
  "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
  "712583694639714258845269173521436987367928415498175326184697532253841769976352841",
];

// create variables for game
var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;

window.onload = function () {
  //function for starting game when button is clicked
  id("start-btn").addEventListener("click", startGame);
  //add event listner to each number-container ans board
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].addEventListener("click", function () {
      //if selecting is not disabled
      if (!disableSelect) {
        //if number s already selected
        if (this.classList.contains("selected")) {
          //then remove the selection
          this.classList.remove("selected");
          selectedNum = null;
        } else {
          //deselect all other numbers
          for (let i = 0; i < 9; i++) {
            id("number-container").children[i].classList.remove("selected");
          }
          //select it and update selectNum varible
          this.classList.add("selected");
          selectedNum = this;
          updateMove();
        }
      }
    });
  }
};

function startGame() {
  //choose board difficulty
  let board;
  if (id("diff-1").checked) board = easy[0];
  else if (id("diff-2").checked) board = medium[0];
  else board = hard[0];
  //set lives to 3 and enable selesting numbers and tiles
  lives = 3;
  disableSelect = false;
  id("lives").textContent = "Lives Remaining: 3";
  //create board based on difficulty
  generateBoard(board);
  //starts the timer
  startTimer();
  //sets theme based on input
  if (id("theme-1").checked) {
    qs("body").classList.remove("dark");
  } else {
    qs("body").classList.add("dark");
  }
  //show number container
  id("number-container").classList.remove("hidden");
}

function startTimer() {
  //set time remaining based on input
  if (id("time-1").checked) timeRemaining = 180;
  else if (id("time-2").checked) timeRemaining = 300;
  else timeRemaining = 600;
  //sets for first second
  id("timer").textContent = timeConversion(timeRemaining);
  //sets timer to update every second
  timer = setInterval(function () {
    timeRemaining--;
    //if no time remaining end the game
    if (timeRemaining === 0) endGame();
    id("timer").textContent = timeConversion(timeRemaining);
  }, 1000);
}
//convert seconds into string of mm:ss format
function timeConversion(time) {
  let minutes = Math.floor(time / 60);
  if (minutes < 10) minutes = "0" + minutes; //adding zero before whhen becomes one digit
  let seconds = time % 60;
  if (seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
}

function generateBoard(board) {
  //clear prev board
  clearPrevious();
  //let used increment tile ids
  let idCount = 0;
  for (let i = 0; i < 81; i++) {
    //create a new paragraph element
    let tile = document.createElement("p");
    //if tile is not blank
    if (board.charAt(i) != "-") {
      //set tile text to num
      tile.textContent = board.charAt(i);
    } else {
      //add click event listner to tile
      tile.addEventListener("click", function () {
        //if selecting is not disabled
        if (!disableSelect) {
          //if tile is already selected
          if (tile.classList.contains("selected")) {
            //the remove the selection
            tile.classList.remove("selected");
            selectedTile = null;
          } else {
            //deselect all other tiles
            for (let i = 0; i < 81; i++) {
              qsa(".tile")[i].classList.remove("selected");
            }
            //add selecton and update varible
            tile.classList.add("selected");
            selectedTile = tile;
            updateMove();
          }
        }
      });
    }
    //assingn tile id
    tile.id = idCount;
    //increment for next tile
    idCount++;
    //add tile class to all tile
    tile.classList.add("tile");
    if ((tile.id > 17 && tile.id < 27) || (tile.id > 44) & (tile.id < 54)) {
      tile.classList.add("bottomBorder");
    }
    if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
      tile.classList.add("rightBorder");
    }
    //add tile to board
    id("board").appendChild(tile);
  }
}

function updateMove() {
  //if tile and num is selected
  if (selectedTile && selectedNum) {
    //set tile tothe correct number
    selectedTile.textContent = selectedNum.textContent;
    //if the no matches the correspondind number in sol key
    if (checkCorrect(selectedTile)) {
      //deselect the tile
      selectedTile.classList.remove("selected");
      selectedNum.classList.remove("selected");
      //clear the selected variables
      selectedNum = null;
      selectedTile = null;
      //check if all the tiles are correct end the game
      if (checkDone()) {
        endGame();
      }
      //if  the number does not match the solution key

    } else {
      //disable selecting new numbers for one second
      disableSelect = true;
      //make the tile turn red
      selectedTile.classList.add("incorrect");
      //run in one second
      setTimeout(function () {
        //substract lives by one
        lives--;
        //if no lives left end the game
        if (lives === 0) {
          endGame();
        } else {
          //if lives is not equal to zero
          //update lives text
          id("lives").textContent = "Lives Remaining: " + lives;
          //renable selecting numbers and tiles
          disableSelect = false;
        }
        //restore tile color and remove selected fro both
        selectedTile.classList.remove("incorrect");
        selectedTile.classList.remove("selected");
        selectedNum.classList.remove("selected");
        //clear the tiles text and clear selected variables
        selectedTile.textContent = "";
        selectedTile = null;
        selectedNum = null;
      }, 1000);
    }
  }
}

function checkDone() {
  let tiles = qsa(".tile");
  for (let i = 0; i < tiles.length; i++){
    if (tiles[i].textContent === "") return false;
  }
  return true;
}

function endGame() {
  //disable moves and stop the timer
  disableSelect = true;
  clearTimeout(timer);
  //display win or loss message
  if (lives === 0 || timeRemaining === 0) {
    id("lives").textContent = "You Lost!";
  } else {
     id("lives").textContent = "You Won!";
  }

}

function checkCorrect(tile) {
  //set sol based on diffculty selection
  let solution;
   if (id("diff-1").checked) solution = easy[1];
   else if (id("diff-2").checked) solution = medium[1];
  else solution = hard[1];
  //if tile's number is equal to solution number
  if (solution.charAt(tile.id) === tile.textContent) return true;
  else return false;
}

function clearPrevious() {
  //access all of the tiles
  let tiles = qsa(".tile");
  //remove each tile
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].remove();
  }
  //If timer left also clear it
  if (timer) clearTimeout(timer);
  //delsect any numbers
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].classList.remove("selected");
    //clear selected variables
    selectedTile = null;
    selectedNum = null;
  }
}

function id(id) {
  return document.getElementById(id); //helper fun for getting element by id
}

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}
