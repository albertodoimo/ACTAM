var environment = localStorage.getItem("environment");

var c = document.getElementById("imageBox");
var ctx = c.getContext("2d");
var image = new Image();
image.onload = function() {
  c.height = image.height/3.5;
  c.width = image.width/3.5;
  ctx.drawImage(image, 0, 0, image.width/3.5, image.height/3.5);
}
image.src = environment.toString();









let stars = [];
let speed;
  
function setup() {
    var canvas = createCanvas(windowWidth, Math.max(document.body.scrollHeight, document.documentElement.scrollHeight
        ));
    canvas.position(0,0);
    canvas.style('z-index', '-1');
    for (let i=0; i<1000; i++) {
      stars.push(new Star());
    }
  }
  
  function draw() {
    background(0);
    speed = map(mouseX, 0, width, 0,15);
    translate(width/2, height/2);
    for (let i = 0; i < stars.length; i++) { 
      stars[i].update();
      stars[i].show();
    }
  }
  
  class Star {
    
    constructor() {
      this.x = random(-width,width);
      this.y = random(-height,height);
      this.z = random(width);
    }
    
    update() {
      this.z = this.z - speed;
  
      if (this.z < 1) {
        this.z = width;
        this.x = random(-width,width);
        this.y = random(-height,height);
  
      }
    }
    
    show() {
      fill(255);
      noStroke();
      
      this.sx = map(this.x / this.z, 0, 1, 0, width);
      this.sy = map(this.y / this.z, 0, 1, 0, height);
      
      this.size = map(this.z,0,width,10,0); 
      ellipse(this.sx,this.sy,this.size,this.size);
    }
  }



/* // AVERAGE IMAGE COLOR
let img;

let avgRed = 0;
let avgGreen = 0;
let avgBlue = 0;

// Load the image
function preload() {
    img = loadImage(environment);
}

function setup() {
  
    // Load the pixels
    img.loadPixels();
  
    // Loop through the pixels X and Y
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
  
        // Calculate the pixel index
        const index = (y * img.width + x) * 4;
  
        // Sum the red, green, and blue values
        avgRed += img.pixels[index + 0];
        avgGreen += img.pixels[index + 1];
        avgBlue += img.pixels[index + 2];
  
      }
    }
  
    // We're finished working with pixels so update them
    img.updatePixels();
  
    // Get the total number of pixels
    // Divide by 4 because the total number of pixels = pixels * numColorChannels 
    const numPixels = img.pixels.length / 4;
  
    // divide the totals by the number of pixels to find the average.
    avgRed /= numPixels;
    avgGreen /= numPixels;
    avgBlue /= numPixels;
  }

function draw()  {
  document.getElementById("color").style.backgroundColor = "rgb(avgRed, avgGreen, avgBlue)";
} */