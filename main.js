/* // Stars not blurry
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
} */

localStorage.clear();
  
let stars = [];
let sp;


function windowResized() {
  resizeCanvas(windowWidth, Math.max(document.body.scrollHeight, document.documentElement.scrollHeight
    ));

}
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
  sp = map(mouseX, 0, width, 0,15);
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
    this.z = this.z - sp;

    if (this.z < 1) {
      this.z = width;
      this.x = random(-width,width);
      this.y = random(-height,height);

    }
  }
  
  show() {
    // fill(255, 255, 150, 170);
    fill(255);
    noStroke();
    
    this.sx = map(this.x / this.z, 0, 1, 0, width);
    this.sy = map(this.y / this.z, 0, 1, 0, height);
    
    this.size = map(this.z,0,width,10,0); 
    ellipse(this.sx,this.sy,this.size,this.size);
  }
}


// Uniform scrolling speed for the whole page
$('#Anchors').click(function(e){
    e.preventDefault();
    var target = this.hash;
    var $target = $(target);
    var scrollTo = $target.offset().top;

    var distance = Math.abs($(window).scrollTop() - scrollTo)
    var duration = distance/750; // 750px in 1s, you can change it
    $('body, html').animate({scrollTop: scrollTo+'px'}, duration * 1000, 'linear');
  });


// Get Selected Environment
var selectedAmbient
var wrappedAmbient

function ambient(id) {
    selectedAmbient = "Images/env/" + id.toString() + ".jpg"
    wrappedAmbient = "Images/env/" + id.toString() + "sk.jpg"
    localStorage.setItem("environment", null)
    localStorage.setItem("environment", selectedAmbient)
    localStorage.setItem("wrapped", null)
    localStorage.setItem("wrapped", wrappedAmbient)
    console.log('dfr')
    window.location.href = "param.html";
}

function flag(id) {
  if (1==localStorage.getItem("guideflag")) {
    ambient(1);
    localStorage.setItem("guideflag", 1);
  } else {
    ambient(id)
  }
}

// GUIDE TOUR

var guideflag

localStorage.setItem("guideflag", 0)
localStorage.setItem("guideflag2", 0)

const tour = new Shepherd.Tour({
  useModalOverlay: true,
  defaultStepOptions: {
      classes: 'shadow-md bg-purple-dark',
      scrollTo: true
  }
});


// step #0
tour.addStep({
  id: 'step0',
  text: 'Select one image to see which music parameters will be extracted. Try different images to change the music mood',
  attachTo: {
      element: '.object1',
      on: 'bottom'
  },
  classes: '',
  buttons: [
    {
        text: 'NEXT',
        action: function () {
        ambient(1)
        }
    },
      {
          text: 'EXIT',
          action: tour.complete
      },

  ]
});

document.getElementById("guide").onclick = function () {
  tour.start();
  localStorage.setItem("guideflag", 1);
}