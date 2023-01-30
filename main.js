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


function ambient(id) {
    selectedAmbient = "Images/env/" + id.toString() + ".jpg"
    localStorage.setItem("environment", null)
    localStorage.setItem("environment", selectedAmbient)
    window.location.href = "param.html";
}