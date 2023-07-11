let intervalId;
var isPlaying = false;
let speed = 50;
let columns;
let rows;
let gridArray;

window.addEventListener('DOMContentLoaded', init);

function init() {
  const gridContainer = document.getElementById('grid-container');
  const clearButton = document.getElementById('clear-button');
  const startButton = document.getElementById('start-button');
  const stopButton = document.getElementById('stop-button');
  const randomButton = document.getElementById('random-button');
  const slider = document.getElementById('slider');
  const sliderValue = document.getElementById('slider-value');
  const removeBordersCheckBox = document.getElementById('remove-borders');
  columns = parseInt(localStorage.getItem('columns'));
  rows = parseInt(localStorage.getItem('rows'));

  gridArray = new Array(rows);
  for (let i = 0; i < rows; i++) {
    gridArray[i] = new Array(columns);
    gridArray[i].fill(0);
  }
  
  
  gridContainer.style.setProperty('grid-template-columns', `repeat(${columns}, 15px)`);
  gridContainer.style.setProperty('grid-template-rows', `repeat(${rows}, 15px)`);
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j <columns;j++){
    const gridCell = document.createElement('div');
    gridCell.classList.add('grid-cell');
    gridCell.id = i*1000+j;
    gridCell.addEventListener('click', selectCell);
    gridContainer.appendChild(gridCell);

    }
  }
  clearButton.addEventListener('click', clear);
  startButton.addEventListener('click', start);
  stopButton.addEventListener('click', stop);
  randomButton.addEventListener('click', random);
  removeBordersCheckBox.addEventListener('change', toggleBorders);
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
  const value =  gridArray[parseInt(id/1000)][id%1000];
  gridArray[parseInt(id/1000)][id%1000] = value == 0 ? 1: 0;
  const distanceToCenter = parseInt(Math.sqrt(((id/1000)-rows/2)**2 + ((id%1000)-columns/2)**2));
  cell.style.setProperty('background-color', getRainbowColor(parseInt(id/1000), id% 1000));
}

function clear(){
  const gridCells = document.getElementsByClassName('grid-cell');
  for (let i = 0; i < gridCells.length; i++) {

    gridCells[i].style.setProperty('background-color', '#ffffff');
  }
  for(let i = 0; i < rows; i++){
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
    let newGridArray = new Array(rows);
    for(let i = 0; i <rows;i++){
      newGridArray[i] = new Array(columns);
      for(let j = 0;j<columns;j++){
        const cell = document.getElementById(i*1000 + j);
        const neighbors = [
          (j>0)? gridArray[i][j-1] : 0,
          (j>0 && i>0)? gridArray[i-1][j-1] : 0,
          (i>0)?  gridArray[i-1][j] : 0,
          (i>0 && j<columns-1)? gridArray[i-1][j+1] : 0,
          (j<columns-1)? gridArray[i][j+1] : 0,
          (j<columns-1 && i<rows-1)? gridArray[i+1][j+1] : 0,
          (i<rows-1)? gridArray[i+1][j] : 0,
          (j>0 && i<rows-1)? gridArray[i+1][j-1] : 0,
        ];
        
        let count1 = 0;
        for(let k = 0 ; k< neighbors.length; k++){
          if(neighbors[k] == 1) count1++;
        }
  
        if(gridArray[i][j] == 1 && (count1 != 2 && count1 != 3)){
          newGridArray[i][j] = 0;
          cell.style.setProperty('background-color', '#ffffff');
        }
        else if(gridArray[i][j] == 0 &&  count1 == 3){
          newGridArray[i][j] = 1;
          finished = false;
          cell.style.setProperty('background-color', getRainbowColor(i, j));
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
  const maxI = rows; 
  const maxJ = columns; 
  const count = parseInt((rows * columns)/10); 

  for (let i = 0; i < count; i++) {
    const randomI = Math.floor(Math.random() * (maxI));
    const randomJ = Math.floor(Math.random() * (maxJ));
    console.log(randomI, randomJ);
    const cell = document.getElementById(randomI * 1000 + randomJ);
    console.log(cell.id, randomI * 1000 + randomJ);
    gridArray[parseInt(cell.id/1000)][cell.id%1000] = 1;
    const id = cell.id;
    cell.style.setProperty('background-color', getRainbowColor(parseInt(id/1000), id%1000));
  }

}

function getRainbowColor(i, j) {
    const rainbowColors = [
      [255, 0, 0],     // Red
      [255, 165, 0],   // Orange
      [255, 255, 0],   // Yellow
      [0, 255, 0],     // Green
      [0, 0, 255],     // Blue
      [75, 0, 130],    // Indigo
      [143, 0, 255]    // Violet
    ];
    const centerJ = parseInt(columns/2);
    const centerI = parseInt(rows/2);
    const distanceToCenter = parseInt(Math.sqrt((i-centerI)**2 + (j-centerJ)**2))
    const totalPositions = parseInt(Math.sqrt(centerJ**2+centerI**2));
    const colorStep = (6) / (totalPositions - 1);
    const startIndex = Math.floor(distanceToCenter * colorStep);
    const endIndex = Math.ceil(distanceToCenter * colorStep);
    const startColor = rainbowColors[startIndex];
    const endColor = rainbowColors[endIndex];
    
    const t = (distanceToCenter - (startIndex / colorStep)) * colorStep;
    
    const r = Math.round((1 - t) * startColor[0] + t * endColor[0]);
    const g = Math.round((1 - t) * startColor[1] + t * endColor[1]);
    const b = Math.round((1 - t) * startColor[2] + t * endColor[2]);
    
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  function toggleBorders(){
    const removeBordersCheckBox = document.getElementById('remove-borders');
    const gridCells = document.getElementsByClassName('grid-cell');

   
        for(let i = 0; i < gridCells.length; i++){
            if(removeBordersCheckBox.checked){
                gridCells[i].style.setProperty('border', '1px solid black');

            }
            else {
                gridCells[i].style.setProperty('border', '0');
            }
        }
    
  }
