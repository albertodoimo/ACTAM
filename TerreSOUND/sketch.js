// DICHIARO LE IMMAGINI FUORI DALLA FUNZIONE PRELOAD
// PERCHE' ABBIANO VISIBILITA' ANCHE NELLE ALTRE FUNZIONI

let imgEarth;
let imgSun;
let imgMoon;
let imgPlanets = [];
let bool = false;
var easycam;  // creo la variabile easycam, che conterrà l'oggetto corrispondente
let reverb, pingpong;
let synths=[];
let playIsOff=true;





//CARICO LE IMMAGINI

function preload() {

  imgEarth = loadImage('./plani.jpg');
  imgSun = loadImage('./sun.jpg');
  imgMoon = loadImage('./moon.jpg');
  imgSky = loadImage('./bg.jpg');

  for(i=0; i<8; i++){
    imgPlanets[i] = loadImage('./' + (i+1).toString(10) + '.jpg');
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  easycam.setViewport([0,0,windowWidth, windowHeight]); // adattamento viewport nel caso 
                                                        // di resizing per la easycam
}


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(60);
  setAttributes('antialias', true);
  perspective(PI / 2, width / height, 0.1, 10000);
  textureWrap(CLAMP);

  easycam = createEasyCam() // creazione oggetto easycam con distanza iniziale  

  document.oncontextmenu = function() { return false; } // necessari per il controllo da mouse della camera
  document.onmousedown   = function() { return false; }

  button1 = createButton('2D');     // creazione bottoni per switching 2D/3D
  button1.position(20, 20);

  button2 = createButton('3D');
  button2.position(20, 80);

  button1.mouseClicked(set2d);      // clickando i bottoni si switchano gli stati della easycamera, dichiarati di seguito
  button2.mouseClicked(set3d);

  /* function state() {
    let stato;
    stato = easycam.getState();
    console.log(stato)
  } */

  let tri = {
    center: [0, 0, 0],
    distance: 2300,
    rotation: [0.9494219246202699, -0.31387447442855826, 0.008966193303751967, -0.0006563003769737552],
  }

  let bi = {
    center: [0, 0, 0],
    distance: 1600,
    rotation: [0.2, -0.2, 0, 0],
  }

  easycam.setState(tri);    // stato iniziale prospettico
  easycam.setDistanceMax(2900);
  easycam.setDistanceMin(200);

  function set2d() {        // setter vista 2d
    easycam.setState(bi, 700)
    easycam.removeMouseListeners()
  }
  
  function set3d() {        // setter vista 3d (stato iniziale)
    easycam.attachMouseListeners(p5.renderer)
    easycam.setState(tri, 700)
  }

  //SOUND -----------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------
  
  
  reverb = new Tone.Reverb(3, 100, 1);
  pingpong = new Tone.PingPongDelay(0.4, 0.3);
 
  button3 = createButton('Play');
  button3.position(windowWidth-90, 20);
  button3.mouseClicked(function(){
    if(playIsOff){
      playSound(); 
      playIsOff=false;
      button3.html("Stop");
    } 
    else{
    stopSound();
    playIsOff=true;
    button3.html("Play");
    }
  });


  /*
  oscChoice = createSelect();
  oscChoice.position(300, 40);
  oscChoice.option('fmsine');
  oscChoice.option('sine');
  oscChoice.option('sawtooth');
  oscChoice.option('triangle');
  oscChoice.option('square');
  oscChoice.option('pwm');
  oscChoice.option('pulse');
  oscChoice.changed(function(){for(i=0; i<8; i++){synths[i].oscillator.set({type: "sine"});}})
*/

  for(i=0; i<8; i++){
    synths[i] = new Tone.Synth({oscillator: {type : "fmsine"}}).toDestination();
    synths[i].chain(reverb, pingpong, Tone.Destination);
    synths[i].volume.value=-100;
    synths[i].oscillator.set({type: "fmsine"});
  }
  

}


function planet(orbitWidth, orbitHeight, tilt, revolution, rotation, skin, diameter, numSynth, note, delta){
  
  
  push();

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
  
  
  //AXIS
    /*fill(255);
    stroke(255); 
    line(0, 400, 0, 0, -400,  0); */ 

  //TEXTURE
    texture(skin);
    noStroke();
    sphere(diameter);

  pop();
  
  //SOUND
    if (sin(frameCount*revolution)<=delta && sin(frameCount*revolution)>=-delta &&
    cos(frameCount*revolution)>=(1-delta)){
    synths[numSynth].triggerAttackRelease(note, "8n");
    //pointLight(255, 255, 255, 500, 0, 3000);
    }
}


function draw() {

    //BACKGROUND
    background(2);
    fill(255);
    stroke(255);

    // SKYBOX
    push()
    noStroke()
    texture(imgSky);
    sphere(4000);
    pop()
    
    //SOUNDLINE
    push();
    stroke(255, 100, 100);
    strokeWeight(5);
    fill(255);
    rotateX(PI/2);
    rotateZ(PI/4);
    line(0, 0, 894, 894);
    pop();

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

    //MOON
    push();
    translate(-sin(frameCount*0.02+PI)*500, 0, -[cos(frameCount*0.02+PI)*333]);
    rotateY(-frameCount * 0.015);
    planet(100, 100, 0, 0.1, 0.005, imgMoon, 15);
    pop();
    
    //PLANETS
    planet(150, 100, 0, 0.1, 0.005, imgPlanets[0], 25, 0, "C2", 0.05);
    planet(300, 200, 0, 0.08, 0.01, imgPlanets[1], 50, 1, "G2", 0.05);
    planet(500, 333, -25, 0.02, 0.015, imgPlanets[2], 75, 2, "E3", 0.01);
    planet(800, 533, 0, 0.015, 0.02, imgPlanets[3], 100, 3, "B3", 0.01);
    planet(1050, 700, 0, 0.01, 0.025, imgPlanets[4], 125, 4, "C4", 0.008);
    planet(1300, 866.5, 0, 0.008, 0.030, imgPlanets[5], 125, 5, "D4", 0.008);
    planet(1600, 1066, 0, 0.004, 0.035, imgPlanets[6], 100, 6, "G4", 0.004);
    planet(1900, 1266, 0, 0.002, 0.040, imgPlanets[7], 200, 7, "B4", 0.002);
  
}

function playSound(){
  for(i=0; i<8; i++){
  synths[i].volume.value=0;
  }
}

function stopSound(){
  for(i=0; i<8; i++){
    synths[i].volume.value=-100;
    }
}