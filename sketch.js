/**
  * Visual Sequencer
  * Abstract visual with music sequencer - instead of showing the person / object as he/it is, 
  * I create a different, abstract picture from the camera pixels and present it mostly 
  * through music
  */

const RECT_SIZE = 15;
const RECT_SPACING = 20;
const MAX_BLACK_COLOR = 90;

var numOfRectInRow;
var numOfRectInCol;
var rectTime;
var bnwPixArr = [];

// Determines X position of a rectangle in the large matrix
var rectPosX = 0;

// Determines X position of a rectangle when displaying the sequencer - the pink column
// which shows the squares that are currently playing
var xLocation = 0;

// Determines the tempo of the music
var tempo = 50;

// Includes all the uploaded sounds
var playArr;

// With the slider you can change the tempo of the music
var slider;

function preload() {
  soundFormats('mp3');
  
  c = loadSound('C5.mp3');
  d = loadSound('D6.mp3');
  e = loadSound('Eb3.mp3');
  f = loadSound('F4.mp3');
  g = loadSound('G5.mp3');
}

function setup() {
  createCanvas(windowWidth - 50, windowHeight, WEBGL);

  pixelDensity(1);
  
  numOfRectInRow = ceil(width / RECT_SPACING);
  numOfRectInCol = ceil(height / RECT_SPACING);
  
  // Create interval to control the tempo
  rectTime = millis();

  // Creates a tempo slider under the real-time image
  slider = createSlider(50, 500, 250, 50);
  slider.position(0, height);
  slider.style('width', width + 'px');
  
  capture = createCapture(VIDEO);
  capture.size(width, height);
  capture.hide();
  
  playArr = [d, f, c, g, e];
}

function draw() {
  capture.loadPixels();
  bnwPixArr = [];
  
  // Convert camera view to squares image
  for(var y=0; y<height; y+=RECT_SPACING) {
    for(var x=0; x<width; x+=RECT_SPACING) {
      var index = (x + (y * width)) * 4;
      var r = capture.pixels[index];
      var g = capture.pixels[index + 1];
      var b = capture.pixels[index + 2];
            
      var bnw = (r+g+b) / 3;
      
      // Saves the value of the pixel squares to play them in a musical sequence
      bnwPixArr.push(bnw);
      
      strokeWeight(2);
      fill(bnw);
      rect(x - (width/2), y - (height/2), RECT_SIZE, RECT_SIZE);
    }
  }
  
  tempo = slider.value();
    
  // Delay of tempo before playing each sequence
  if(rectTime + tempo < millis()) {
    if(rectPosX > numOfRectInRow) {
      rectPosX = 0;
    }

    xLocation = (rectPosX * RECT_SPACING) - (width/2);

    // Gives color to the sequencer column which reflects which squares are playing
    strokeWeight(0);
    fill('pink');

    for(var i=0; i<numOfRectInCol; i++) {
      // Draw the sequencer
      rect(xLocation,(i * RECT_SPACING) - (height/2), RECT_SIZE, RECT_SIZE);
      
      playMusic(bnwPixArr, rectPosX, i);
    }
      
    rectTime = millis();
    rectPosX++;
  } 
}

/** This function plays each pixel square in the sequence column. 
  * By X and Y values calculates the exact position in the color array (bnwPixArr)
  */
function playMusic(arr, x, y) {
  var idx = (numOfRectInRow * y) + x;
  
  // Split the visual image to equal parts to create real sequencer behavior
  var splitToCols = (numOfRectInRow / playArr.length);
  
  for(var i = 0; i < playArr.length; i++) {
    // Divide the parts so that each part will play different sound in a little different colors range
    if(arr[idx] >= MAX_BLACK_COLOR / (i + 2) && arr[idx] < MAX_BLACK_COLOR && 
       y >= splitToCols * i && y < splitToCols * (i + 1)) {
       playArr[i].play();
       break;
    } 
  }
}

function keyTyped() {
  if(key === 's') {
    save('Creation.jpg');
  }
}
