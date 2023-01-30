var environment = localStorage.getItem("environment");

// Stars not blurry
function Draw () {
	var e, starfield;
	e = document.getElementById ("starfield");
	// Begin size adjusting
	e.width = e.offsetWidth;
	e.height = e.offsetHeight;
	// End size adjusting
}
window.onload = Draw ()

// Starry background
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}      

var canvas = document.getElementById("starfield"),
context = canvas.getContext("2d"),
stars = 700,
colorrange = [0,60,240];

for (var i = 0; i < stars; i++) {
    var x = Math.random() * canvas.offsetWidth;
    y = Math.random() * canvas.offsetHeight,
    radius = Math.random() * 2.3,
    hue = colorrange[getRandom(0,colorrange.length - 1)],
    sat = getRandom(50,100);
    context.beginPath();
    context.arc(x, y, radius, 0, 360);
    context.fillStyle = "hsl(" + hue + ", " + sat + "%, 88%)";
    context.fill();
}

// Import image
document.getElementById('imageBox').src = environment.toString();

// AVERAGE IMAGE COLOR
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

