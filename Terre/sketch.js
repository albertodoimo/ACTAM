//DICHIARO LE IMMAGINI FUORI DALLA FUNZIONE PRELOAD
//PERCHE' ABBIANO VISIBILITA' ANCHE NELLE ALTRE FUNZIONI
let imgEarth;
let imgSun;
//let imgBackground;
let imgPlanets = [];

//CARICO LE IMMAGINI
function preload() {
  imgEarth = loadImage('./plani.jpg');
  imgSun = loadImage('./sun.jpg');
for(i=0; i<8; i++){
  imgPlanets[i] = loadImage('./' + (i+1).toString(10) + '.jpg');
}

  //SI PUO' FARE background(image) 
  //MA NON FUNZIONA, MAGARI PERCHE' SIAMO IN 3D
  //imgBackground = loadImage('./bg.jpg');
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textureWrap(CLAMP);
  //CAMERA
}







//------------------------------------------------------------------------------------------------
function planet(orbitWidth, orbitHeight, tilt, revolution, rotation, skin, diameter){

  //ELLIPSE
  rotateX(PI/2);
  noFill();
  stroke(255); 
  strokeWeight(5);
  ellipse(0, 0, orbitWidth*2, orbitHeight*2, 50);
  rotateX(-PI/2);
  
  
  //ROTATION
  translate(sin(frameCount*revolution)*orbitWidth, 0, [cos(frameCount*revolution)*orbitHeight]);
  rotateZ(tilt);
  rotateY(frameCount * rotation);
  
  /*
  //AXIS
  fill(255);
  stroke(255); 
  line(0, 400, 0, 0, -400,  0);
  */

  //EARTH
  texture(skin);
  noStroke();
  sphere(diameter);

    //ROTATION
    rotateY(-frameCount * rotation);
    rotateZ(-tilt);
    translate(-sin(frameCount*revolution)*orbitWidth, 0, -[cos(frameCount*revolution)*orbitHeight]);
    
    

  
  }
  //---------------------------------------------------------------------------------------------------------







function draw() {

//CAMERA
camera([0], [-1800], [3000], [0], [0], [0]);

//BACKGROUND
background(2);

//STARS
fill(255);
stroke(255); 
/*
for(i=0; i<100; i++)
{
  point(random()*50000-10000, random()*40000-10000);
}*/

//SUN
noStroke();
rotateY(PI);
rotateY(frameCount * 0.005);
texture(imgSun);
sphere(500);
rotateY(-frameCount * 0.005);
rotateY(-PI);

//LIGHT
ambientLight(60);
pointLight(255, 255, 255, 0, 0, 0);

planet(600, 300, 0, 0.3, 0.005, imgPlanets[0], 100);
planet(1200, 600, -25, 0.1, 0.01, imgPlanets[1], 200);
planet(2000, 800, 0, 0.02, 0.02, imgPlanets[2], 300);
planet(3200, 1000, 0, 0.01, 0.03, imgPlanets[3], 400);
planet(4200, 1600, 0, 0.02, 0.04, imgPlanets[4], 500);
planet(5200, 2600, 0, 0.03, 0.05, imgPlanets[5], 600);

}

