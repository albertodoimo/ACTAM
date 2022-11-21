// DICHIARO LE VARIABILI FUORI DALLA FUNZIONI
// PERCHE' ABBIANO VISIBILITA' ANCHE NELLE ALTRE FUNZIONI
let imgEarth;
let imgSun;
let imgMoon;
let imgPlanets = [];
let planetOrbWidth = [150, 300, 500, 800, 1050, 1300, 1600, 1900];
let planetOrbHeight = [100, 200, 333, 533, 700, 866.5, 1066, 1266];
let planetTilt = [0, 0, -25, 0, 0, 0, 0, 0];
let planetRotation = [0.005, 0.01, 0.015, 0.020, 0.025 , 0.030 , 0.035 , 0.040]; 
let planetDiameter = [25, 50 , 75, 100, 125, 125, 100, 200];
let bool = false;
let easycam;  // creo la variabile easycam, che conterrà l'oggetto corrispondente
//SOUND VARIABLES
let reverb, pingpong;
let synths=[];
let samples=[];
let loop=[];
let playIsOff=true;
let bpm = 20;
//1= MEASURE, 4=BEAT
let planetRatios = [8, 7, 6, 5, 4, 3, 2, 1];
let planetNotes = ["C2", "G2", "E3", "B3", "C4", "D4", "D4", "B4"];
let planetNotesDuration = ["32n", "32n", "32n", "32n", "32n", "32n", "32n", "32n"];
let lineWobble = 0;
let wobbleArray = [];

function preload() {

  imgEarth = loadImage('img/plani.jpg');
  imgSun = loadImage('img/sun.jpg');
  imgMoon = loadImage('img/moon.jpg');
  imgSky = loadImage('img/bg.jpg');

  for(i=0; i<8; i++){
    imgPlanets[i] = loadImage('img/' + (i+1).toString(10) + '.jpg');
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  easycam.setViewport([0,0,windowWidth, windowHeight]); // adattamento viewport nel caso 
                                                        // di resizing per la easycam
}


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);
  setAttributes('antialias', true);
  perspective(PI / 2, width / height, 0.1, 10000);
  textureWrap(CLAMP);

  easycam = createEasyCam() // creazione oggetto easycam con distanza iniziale  

  /*
  document.oncontextmenu = function() { return false; } // necessari per il controllo da mouse della camera
  document.onmousedown   = function() { return false; }
  */

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

  for(i=0; i<8; i++){
    const player = new Tone.Player("samples/" + (i+1).toString(10) + ".wav").toDestination();
  }

  /* for(i=0; i<8; i++){
    synths[i] = new Tone.Synth({oscillator: {type : "fmsine"}}).toDestination();
    synths[i].chain(reverb, pingpong, Tone.Destination);
    synths[i].volume.value=-100;
  } */

  /*
  SE COLLASSO LA PARTE SOTTOSTANTE INDENTATA IN UN CICLO FOR COME IL SEGUENTE NON FUNZIONA
  
  for(i=0; i<8; i++){
    loop[i] = new Tone.Loop(time => {
              synths[i].triggerAttackRelease(planetNotes[i], planetNotesDuration[i], time);
            }, planetRatios[i].toString()+"n").start(0);
  }
  */

  loop[0] = new Tone.Loop(time => {
    synths[0].triggerAttackRelease(planetNotes[0], planetNotesDuration[0], time);
  }, planetRatios[0].toString()+"n").start(0);

  loop[1] = new Tone.Loop(time => {
    synths[1].triggerAttackRelease(planetNotes[1], planetNotesDuration[1], time);
  }, planetRatios[1].toString()+"n").start(0);

  loop[2] = new Tone.Loop(time => {
    synths[2].triggerAttackRelease(planetNotes[2], planetNotesDuration[2], time);
  }, planetRatios[2].toString()+"n").start(0);

  loop[3] = new Tone.Loop(time => {
    synths[3].triggerAttackRelease(planetNotes[3], planetNotesDuration[3], time);
  }, planetRatios[3].toString()+"n").start(0);

  loop[4] = new Tone.Loop(time => {
    synths[4].triggerAttackRelease(planetNotes[4], planetNotesDuration[4], time);
  }, planetRatios[4].toString()+"n").start(0);

  loop[5] = new Tone.Loop(time => {
    synths[5].triggerAttackRelease(planetNotes[5], planetNotesDuration[5], time);
  }, planetRatios[5].toString()+"n").start(0);

  loop[6] = new Tone.Loop(time => {
    synths[6].triggerAttackRelease(planetNotes[6], planetNotesDuration[6], time);
  }, planetRatios[6].toString()+"n").start(0);

  loop[7] = new Tone.Loop(time => {
    synths[7].triggerAttackRelease(planetNotes[7], planetNotesDuration[7], time);
  }, planetRatios[7].toString()+"n").start(0);


  /* loop[0] = new Tone.Loop(time => {
    synths[0].triggerAttackRelease(planetNotes[0], planetNotesDuration[0], time);
  }, planetRatios[0].toString()+"n").start(0);

  loop[1] = new Tone.Loop(time => {
    synths[1].triggerAttackRelease(planetNotes[1], planetNotesDuration[1], time);
  }, planetRatios[1].toString()+"n").start(0);

  loop[2] = new Tone.Loop(time => {
    synths[2].triggerAttackRelease(planetNotes[2], planetNotesDuration[2], time);
  }, planetRatios[2].toString()+"n").start(0);

  loop[3] = new Tone.Loop(time => {
    synths[3].triggerAttackRelease(planetNotes[3], planetNotesDuration[3], time);
  }, planetRatios[3].toString()+"n").start(0);

  loop[4] = new Tone.Loop(time => {
    synths[4].triggerAttackRelease(planetNotes[4], planetNotesDuration[4], time);
  }, planetRatios[4].toString()+"n").start(0);

  loop[5] = new Tone.Loop(time => {
    synths[5].triggerAttackRelease(planetNotes[5], planetNotesDuration[5], time);
  }, planetRatios[5].toString()+"n").start(0);

  loop[6] = new Tone.Loop(time => {
    synths[6].triggerAttackRelease(planetNotes[6], planetNotesDuration[6], time);
  }, planetRatios[6].toString()+"n").start(0);

  loop[7] = new Tone.Loop(time => {
    synths[7].triggerAttackRelease(planetNotes[7], planetNotesDuration[7], time);
  }, planetRatios[7].toString()+"n").start(0); */
  

  Tone.Transport.start();
  Tone.Transport.bpm.value=bpm;
  
  
  //CONTROLS
  setNumPlanets = createSlider(1, 8, 8, 1);
  setNumPlanets.position(200, 40);
  setNumPlanets.addClass("mySliders");
  
  setBPM = createSlider(20, 70, 35, 5);
  setBPM.position(400, 40);
  setBPM.addClass("mySliders");

  oscChoice = createSelect();
  oscChoice.position(600, 30);
  oscChoice.option('fmsine');
  oscChoice.option('sine');
  oscChoice.option('sawtooth');
  oscChoice.option('triangle');
  oscChoice.option('square');
  oscChoice.option('pwm');
  oscChoice.option('pulse');
  oscChoice.style('background-color', '#a229ff');
  oscChoice.style('border-radius', '3px');
  oscChoice.style('width', '150px');
  //oscChoice.addClass("myDropDowns");

  console.log(Tone.Transport.seconds);
}



function planet(orbitWidth, orbitHeight, tilt, rotation, skin, diameter, modifier){
  push();

  //ELLIPSE
    rotateX(PI/2);
    noFill();
    stroke(255); 
    strokeWeight(2);
    ellipse(0, 0, orbitWidth*2, orbitHeight*2, 50);
    rotateX(-PI/2);
  
  //ROTATION
  //Tone.Transport.seconds  TRASCORRERE DEI SECONDI
  //Tone.Transport.bpm.value BPM
  //Tone.Transport.bpm.value/60/4 MEASURES PER SECOND (1n in Tone transport reference)
  //2*Math.PI
    var revolutionRate = (2*(Math.PI)*(((Tone.Transport.seconds)*(Tone.Transport.bpm.value/60/4))*modifier));
    console.log(Tone.Clock.seconds);
    translate(sin(revolutionRate)*orbitWidth, 0, cos(revolutionRate)*orbitHeight);
    rotateZ(tilt);
    rotateY(frameCount * rotation);
  
  //AXIS
    //fill(255);
    //stroke(255); 
    //line(0, 400, 0, 0, -400,  0); 

  //TEXTURE
    texture(skin);
    //COLORE ROSSO QUANDO PASSA PER L'AZIMUTH
    if(sin(revolutionRate)<=0.2 && sin(revolutionRate)>=-0.2 && cos(revolutionRate)>=0.8){
      emissiveMaterial(255, 50, 50);
      wobbleArray[modifier-1] = 1;
    }
    else{
      wobbleArray[modifier-1] = 0;
    }
    noStroke();
    sphere(diameter);
    
  pop();

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
    for(i=0; i<7; i++){
      lineWobble = lineWobble + wobbleArray[i];
    }
    soundLine(lineWobble);
    lineWobble = 0;

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

    //CONTROLS AND DRAW PLANETS
    let val = setNumPlanets.value();    
    for(i=0; i<val; i++){
      planet(planetOrbWidth[i], planetOrbHeight[i], planetTilt[i], planetRotation[i], imgPlanets[i], planetDiameter[i], planetRatios[i]);
      if(i==2){   //MOON
        push();
        translate(-sin(2*Math.PI*(((Tone.Transport.seconds)*(Tone.Transport.bpm.value/60/4))*6)+PI)*500, 0, -[cos(2*Math.PI*(((Tone.Transport.seconds)*(Tone.Transport.bpm.value/60/4))*6)+PI)*333]);
        rotateY(-frameCount * 0.015);
        planet(100, 100, 0, 0.005, imgMoon, 15, 6);
        pop();
      }
      if(!playIsOff){
        synths[i].volume.value=-12;
      }
      else{
        synths[i].volume.value=-100;
      }
    }

    for(i=val; i<8; i++){
      synths[i].volume.value=-100;
    }
   
    oscChoice.changed(function(){for(i=0; i<8; i++){synths[i].oscillator.set({type: oscChoice.value().toString()});}});

    setBPM.changed(function(){
      Tone.Transport.bpm.value=setBPM.value();
      //Tone.Transport.stop();
      //Tone.Transport.start();
    });
}


function playSound(){
  for(i=0; i<8; i++){
  synths[i].volume.value=-12;
  }
}


function stopSound(){
  for(i=0; i<8; i++){
    synths[i].volume.value=-100;
    }
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function soundLine(lineWobble){
  let x, y, z = 0;
  if (lineWobble==0) {
    push();
    stroke(255, 100, 100);
    strokeWeight(5);
    fill(255);
    rotateX(PI/2);
    rotateZ(PI/4);
    line(0, 0, (planetOrbWidth[setNumPlanets.value()-1]/2)*0.94, (planetOrbWidth[setNumPlanets.value()-1]/2)*0.94);
    pop();
  } 
  else {
    //console.log(wobbleArray);
    push();
    beginShape();
    stroke(255, 100, 100);
    strokeWeight(5);
    noFill(255);
    curveVertex(0, 0, 0);
    curveVertex(0, 0, 0);
    for (let i = 1; i < 5; i++) {
      x = getRndInteger(-25, 25);
      y = i * (planetOrbWidth[setNumPlanets.value()-1]/10);
      curveVertex(x, 0, y); 
    }
    curveVertex(0, 0, (planetOrbWidth[setNumPlanets.value() - 1]/2)*1.05);
    curveVertex(0, 0, (planetOrbWidth[setNumPlanets.value() - 1]/2)*1.05);
    endShape();
    pop();
  }
}