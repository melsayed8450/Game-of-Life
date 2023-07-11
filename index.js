window.addEventListener('DOMContentLoaded', init);

function init() {
  const startGameButton = document.getElementById("startGameButton");
  startGameButton.addEventListener("click", startGame);
}

function startGame() {
  const rowsInput = document.getElementById("rowsInput");
  const columnsInput = document.getElementById("columnsInput");
  if(rowsInput.value * columnsInput.value > 500000){
    warn("Grids must be less than 500000");
  }else{
    localStorage.setItem('rows', rowsInput.value);
  localStorage.setItem('columns', columnsInput.value);
  console.log(rowsInput.value,columnsInput.value);
  window.location.href = "game.html";

  }

  function warn(message) {
    alert (message);
  }
  
}