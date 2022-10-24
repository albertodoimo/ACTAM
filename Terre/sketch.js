//DICHIARO LE IMMAGINI FUORI DALLA FUNZIONE PRELOAD
//PERCHE' ABBIANO VISIBILITA' ANCHE NELLE ALTRE FUNZIONI
let imgEarth;
let imgSun;
let imgMoon;
let imgPlanets = [];
let bool;
//let imgBackground;




//CARICO LE IMMAGINI
function preload() {
  imgEarth = loadImage('./plani.jpg');
  imgSun = loadImage('./sun.jpg');
  imgMoon = loadImage('./moon.jpg');
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
  perspective(PI / 2, width / height, 0.1, 5000);
  textureWrap(CLAMP);
  
  bool = 0;
  button = createButton('2D/3D');
  button.position(10, 10);
  button.mousePressed(booleana);

  function booleana(){
   if(bool==0) {
      bool=1;
    }
    else if (bool==1){
      bool=0;
    }
  };
}




//----------------------------------------------------------------------------------------------------------------
function planet(orbitWidth, orbitHeight, tilt, revolution, rotation, skin, diameter){

  //ELLIPSE
  rotateX(PI/2);
  noFill();
  stroke(255); 
  strokeWeight(2);
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
  //---------------------------------------------------------------------------------------------------------------




function draw() {

  //CAMERA
  if (bool==0){
    //camera(0,-1200, 1700);
    orbitControl([1],[1],[0.01]);
  }
  else if (bool==1){
    camera(0,-2000, 0.00001);
  }

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
  sphere(100); 
  rotateY(-frameCount * 0.005);
  rotateY(-PI);

  //LIGHT
  ambientLight(60);
  pointLight(255, 255, 255, 0, 0, 0);

  //PLANETS
  planet(150, 100, 0, 0.1, 0.005, imgPlanets[0], 25);
  planet(300, 200, 0, 0.08, 0.01, imgPlanets[1], 50);

  //MOON
  push();
  translate(-sin(frameCount*0.02+PI)*500, 0, -[cos(frameCount*0.02+PI)*333]);
  rotateY(-frameCount * 0.015);
  planet(100, 100, 0, 0.1, 0.005, imgMoon, 15);
  pop();

  //OTHER PLANETS
  planet(500, 333, -25, 0.02, 0.015, imgPlanets[2], 75);
  planet(800, 533, 0, 0.01, 0.02, imgPlanets[3], 100);
  planet(1050, 700, 0, 0.005, 0.025, imgPlanets[4], 125);
  planet(1300, 866.5, 0, 0.001, 0.030, imgPlanets[5], 125);
  planet(1600, 1066, 0, 0.0005, 0.035, imgPlanets[6], 100);
  planet(1900, 1266, 0, 0.0001, 0.040, imgPlanets[7], 200);

}