let intervalId;
var isPlaying = false;
let speed = 50;

window.addEventListener('DOMContentLoaded', init);

let gridArray = new Array(40);
  for (let i = 0; i < 40; i++) {
    gridArray[i] = new Array(100);
    gridArray[i].fill(0);
  }

function init() {
  const gridContainer = document.getElementById('grid-container');
  const clearButton = document.getElementById('clear-button');
  const startButton = document.getElementById('start-button');
  const stopButton = document.getElementById('stop-button');
  const randomButton = document.getElementById('random-button');
  const slider = document.getElementById('slider');
  const sliderValue = document.getElementById('slider-value');

  for (let i = 0; i < 40; i++) {
    for (let j = 0; j <100;j++){
    const gridCell = document.createElement('div');
    gridCell.classList.add('grid-cell');
    gridCell.id = i*100+j;
    gridCell.addEventListener('click', selectCell);
    gridContainer.appendChild(gridCell);

    }
  }
  clearButton.addEventListener('click', clear);
  startButton.addEventListener('click', start);
  stopButton.addEventListener('click', stop);
  randomButton.addEventListener('click', random);
  slider.addEventListener('input', function() {
    speed = parseInt(slider.value);
    sliderValue.textContent = speed;
    if(isPlaying == true){
      stop();
      start();
    }
  });
}

function selectCell(event){
  const cell = event.target;
  const id = cell.id;
  const value =  gridArray[parseInt(id/100)][id%100];
  gridArray[parseInt(id/100)][id%100] = value == 0 ? 1: 0;
  cell.classList.toggle('selected-cell');
}

function clear(){
  const gridCells = document.getElementsByClassName('grid-cell');
  for (let i = 0; i < gridCells.length; i++) {
    gridCells[i].classList.remove('selected-cell');
  }
  for(let i = 0; i < 40; i++){
    gridArray[i].fill(0);
  }
  isPlaying = false;
  console.log(isPlaying);
}

function stop() {
  if(isPlaying == true){
    isPlaying = false;
    clearInterval(intervalId);
  
  }console.log(isPlaying);
 
}

function start(){
  if(isPlaying == false){
    isPlaying = true;
    intervalId = setInterval(oneIterate, 500-speed*5);
  }
  console.log(isPlaying);
 
}

function oneIterate(){
  let finished = true;
  if(isPlaying == true){
    let newGridArray = new Array(40);
    for(let i = 0; i <40;i++){
      newGridArray[i] = new Array(100);
      for(let j = 0;j<100;j++){
        const cell = document.getElementById(i*100 + j);
        const neighbors = [
          (j>0)? gridArray[i][j-1] : 0,
          (j>0 && i>0)? gridArray[i-1][j-1] : 0,
          (i>0)?  gridArray[i-1][j] : 0,
          (i>0 && j<100)? gridArray[i-1][j+1] : 0,
          (j<100)? gridArray[i][j+1] : 0,
          (j<100 && i<39)? gridArray[i+1][j+1] : 0,
          (i<39)? gridArray[i+1][j] : 0,
          (j>0 && i<39)? gridArray[i+1][j-1] : 0,
        ];
        
        let count1 = 0;
        for(let k = 0 ; k< neighbors.length; k++){
          if(neighbors[k] == 1) count1++;
        }
  
        if(gridArray[i][j] == 1 && (count1 != 2 && count1 != 3)){
          newGridArray[i][j] = 0;
          cell.classList.remove('selected-cell');
        }
        else if(gridArray[i][j] == 0 &&  count1 == 3){
          newGridArray[i][j] = 1;
          finished = false;
          cell.classList.toggle('selected-cell');
        }else {
          newGridArray[i][j] = gridArray[i][j];
          if(gridArray[i][j] == 1) finished = false;
        }
      }
    }
    gridArray = newGridArray;
    if(finished == true){
      isPlaying = false;
      console.log(isPlaying);

    }
  }
    
}

function random() {
  const min = 0; // Minimum value
  const max = 3999; // Maximum value
  const count = 500; // Number of random numbers to generate

  for (let i = 0; i < count; i++) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const cell = document.getElementById(randomNumber);
    gridArray[parseInt(randomNumber/100)][randomNumber%100] = 1;
    cell.classList.toggle('selected-cell');
  }


}
