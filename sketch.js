// DICHIARO LE VARIABILI FUORI DALLA FUNZIONI
// PERCHE' ABBIANO VISIBILITA' ANCHE NELLE ALTRE FUNZIONI
let imgEarth;
let imgSun;
let imgMoon;
var imgSky;
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
let env1;
let env2;
let filter1;
let filter2;
let synths=[];
let samples=[];
let loops=[];
let playIsOff=true;
let bpm = 20;
//1= MEASURE, 4=BEAT
let planetRatios = [8, 7, 6, 5, 4, 3, 2, 1];
let planetNotes = ["C2", "G2", "E3", "B3", "C4", "D4", "D4", "B4"];
let planetNotesDuration = ["32n", "32n", "32n", "32n", "32n", "32n", "32n", "32n"];
let s1, s2, s3, s4, amp4, amp2;
let lineWobble = 0;
let wobbleArray = [];
//ENVIRONMENT
let border=10;
let topBorder=100;
let button=[];
let loadTimer;
let fontazzo;
let numSelected=0;
let environmentSelected=0;
let environmentSelectedImg;
let mean;
let maximum;




function preload() {

  imgEarth = loadImage('img/plani.jpg');
  imgSun = loadImage('img/sun.jpg');
  imgMoon = loadImage('img/moon.jpg');
  //imgSky = loadImage('img/bg.jpg');
  fontazzo=loadFont('img/Montserrat-Bold.ttf');

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

    let envWidth = (windowWidth-4*border-topBorder)/3;
    let envHeight =(windowHeight-4*border-topBorder)/3;

    for(i=0; i<9; i++){
      button[i] = createImg('img/env/' + (i+1).toString(10) + '.jpg');
      button[i].size(envWidth, envHeight);
      button[i].addClass("myImages");
    }
    button[0].position(border+topBorder/3.5, border+topBorder);
    button[1].position(border+topBorder/3.5*2+envWidth, border+topBorder);
    button[2].position(border+topBorder/3.5*3+envWidth*2, border+topBorder);
    button[3].position(border+topBorder/3.5, border*2+envHeight+topBorder);
    button[4].position(border+topBorder/3.5*2+envWidth, border*2+envHeight+topBorder);
    button[5].position(border+topBorder/3.5*3+envWidth*2, border*2+envHeight+topBorder);
    button[6].position(border+topBorder/3.5, border*3+envHeight*2+topBorder);
    button[7].position(border+topBorder/3.5*2+envWidth, border*3+envHeight*2+topBorder);
    button[8].position(border+topBorder/3.5*3+envWidth*2, border*3+envHeight*2+topBorder);
  
  document.querySelector('button')?.addEventListener('click', async () => {
    await Tone.start();
    console.log('audio is ready');
  })

  
  createCanvas(windowWidth, windowHeight, WEBGL);

  frameRate(30);
  setAttributes('antialias', true);
  perspective(PI / 2, width / height, 0.1, 15000);
  textureWrap(CLAMP);

  

  /*
  document.oncontextmenu = function() { return false; } // necessari per il controllo da mouse della camera
  document.onmousedown   = function() { return false; }
  */

  button1 = createButton('2D');     // creazione bottoni per switching 2D/3D
  button1.position(20, 20);
  
  button2 = createButton('3D');
  button2.position(20, 85);

  button1.mouseClicked(set2d);      // clickando i bottoni si switchano gli stati della easycamera, dichiarati di seguito
  button2.mouseClicked(set3d);

  /* function state() {
    let stato;
    stato = easycam.getState();
    console.log(stato)
  } */



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
  
 
  button3 = createButton('Play');
  button3.position(windowWidth-100, 20);
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

/*   for(i=0; i<1; i++){
    samples[i] = new Tone.Player("samples/" + (i+1).toString(10) + ".wav").toDestination();
  } */
/* 
s4 = new Tone.Synth({ 
  oscillator : {
    type : sine
    } ,
    envelope : {
    attack : 0.001 ,
    decay : 1.5 ,
    sustain : 0.0,
    release : 0.04
    }
})
 */
  
  //CONTROLS
  setNumPlanets = createSlider(1, 8, 8, 1);
  setNumPlanets.position(200, 40);
  setNumPlanets.addClass("mySliders");
  setNumPlanets.addClass("planets-caption");

  setBPM = createSlider(20, 70, 35, 5);
  setBPM.position(400, 40);
  setBPM.addClass("mySliders");
  setBPM.addClass("speed-caption");

  /* oscChoice = createSelect();
  oscChoice.position(600, 36);
  oscChoice.option('fmsine');
  oscChoice.option('sine');
  oscChoice.option('sawtooth');
  oscChoice.option('triangle');
  oscChoice.option('square');
  oscChoice.option('pwm');
  oscChoice.option('pulse');
  oscChoice.style('background-color', '#a229ff');
  oscChoice.style('border-radius', '3px');
  oscChoice.style('width', '150px'); */
  //oscChoice.addClass("myDropDowns");
}


function draw() {
  //_________________________________SELECT ENVIRONMENT WIEW_________________________________________________________
  if(environmentSelected==0)
  {

    button1.hide();
    button2.hide();
    button3.hide();
    // oscChoice.hide();
    setNumPlanets.hide();
    setBPM.hide();

    push();
    background(20);
    fill(255);
    stroke(255);
    textFont(fontazzo);
    textSize(42);
    textAlign(CENTER);
    text('CHOOSE ENVIRONMENT', 0, -windowHeight/2-170);
    textSize(24);
    text('The environment will affect the sound design of the machine', 0, -windowHeight/2-110);
    
    //OVVIAMENTE LA PARTE SOTTOSTANTE ANDREBBE COLLASSATA IN UN CICLO FOR
    //QUANDO CI HO PROVATO IO NON ANDAVA
      button[0].mouseClicked(function(){
        numSelected=0;
        environmentSelectedImg=loadImage('img/env/' + (numSelected+1).toString(10) + '.jpg');
        mean = getMeanMax()[0];
        maximum = getMeanMax()[1];
        soundDesign();
        loadTimer=millis();
        environmentSelected=1;
      });
      button[1].mouseClicked(function(){
        numSelected=1;
        environmentSelectedImg=loadImage('img/env/' + (numSelected+1).toString(10) + '.jpg');
        mean = getMeanMax()[0];
        maximum = getMeanMax()[1];
        soundDesign();
        loadTimer=millis();
        environmentSelected=1;
      });
      button[2].mouseClicked(function(){
        numSelected=2;
        environmentSelectedImg=loadImage('img/env/' + (numSelected+1).toString(10) + '.jpg');
        mean = getMeanMax()[0];
        maximum = getMeanMax()[1];
        soundDesign();
        loadTimer=millis();
        environmentSelected=1;
      });
      button[3].mouseClicked(function(){
        numSelected=3;
        environmentSelectedImg=loadImage('img/env/' + (numSelected+1).toString(10) + '.jpg');
        mean = getMeanMax()[0];
        maximum = getMeanMax()[1];  
        soundDesign();  
        loadTimer=millis();
        environmentSelected=1;
      });
      button[4].mouseClicked(function(){
        numSelected=4;
         environmentSelectedImg=loadImage('img/env/' + (numSelected+1).toString(10) + '.jpg');
        mean = getMeanMax()[0];
        maximum = getMeanMax()[1];
        soundDesign();
        loadTimer=millis();
        environmentSelected=1;
      });
      button[5].mouseClicked(function(){
        numSelected=5;
        environmentSelectedImg=loadImage('img/env/' + (numSelected+1).toString(10) + '.jpg');
        mean = getMeanMax()[0];
        maximum = getMeanMax()[1]; 
        soundDesign(); 
        loadTimer=millis();
        environmentSelected=1;
      });
      button[6].mouseClicked(function(){
        numSelected=6;
         environmentSelectedImg=loadImage('img/env/' + (numSelected+1).toString(10) + '.jpg');
        mean = getMeanMax()[0];
        maximum = getMeanMax()[1]; 
        soundDesign();
        loadTimer=millis();
        environmentSelected=1;
      });
      button[7].mouseClicked(function(){
        numSelected=7;
        environmentSelectedImg=loadImage('img/env/' + (numSelected+1).toString(10) + '.jpg');
        mean = getMeanMax()[0];
        maximum = getMeanMax()[1]; 
        soundDesign();
        loadTimer=millis();
        environmentSelected=1;
      });
      button[8].mouseClicked(function(){
        numSelected=8;
        environmentSelectedImg=loadImage('img/env/' + (numSelected+1).toString(10) + '.jpg');
        mean = getMeanMax()[0];
        maximum = getMeanMax()[1]; 
        soundDesign();
        loadTimer=millis();
        environmentSelected=1;
      });

    
    pop();
  }//_________________________________________LOADING WIEW____________________________________________________________
  else if (environmentSelected==1)
  {

    for(i=0; i<9; i++){
      button[i].hide();
    }
    
    push();
    background(20);
    stroke(255);
    fill(255);
    textSize(60);
    textFont(fontazzo);
    textAlign(CENTER);
    if(millis()%1000<333){
      text('LOADING.', 0, windowHeight/2-300);
    }
    else if(millis()%1000<666){
      text('LOADING..', 0, windowHeight/2-300);
    }
    else{
      text('LOADING...', 0, windowHeight/2-300);
    }
    
    stroke(255);
    strokeWeight(8);
    noFill();
    rect(-300, windowHeight/2-500, 600, 100);
    noStroke();
    fill(151, 0, 215);
    rect(-300, windowHeight/2-500, (millis()-loadTimer)/2000*597, 100);
  
    if ((millis()-loadTimer)/2000>=1){
      
      easycam = createEasyCam(tri) // creazione oggetto easycam con distanza iniziale 
      easycam.setState(tri);    // stato iniziale prospettico
      easycam.setDistanceMax(2900);
      easycam.setDistanceMin(200);
      environmentSelected=2;
    }
    pop();
  }
  //__________________________________________SPACE WIEW______________________________________________________________
  else if(environmentSelected==2)

  {

    button1.show();
    button2.show();
    button3.show();
    // oscChoice.show();
    setNumPlanets.show();
    setBPM.show();

    //BACKGROUND
    background(0,0,0,0);
    //fill(255);
    //stroke(255);

    //muro invisibile per limiti della sfera
    let currentDist = Math.sqrt((easycam.getPosition()[0])**2+ (easycam.getPosition()[1])**2+ (easycam.getPosition()[2])**2);
    if(currentDist>3000.0){
      easycam.setState(tri, 400);
    } 
    else{}


    // SKYBOX
    push();
    noStroke();
    texture(environmentSelectedImg);
    sphere(4000);
    pop();

    
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
   
    // oscChoice.changed(function(){for(i=0; i<8; i++){synths[i].oscillator.set({type: oscChoice.value().toString()});}});

    setBPM.changed(function(){
      Tone.Transport.bpm.value=setBPM.value();
      //Tone.Transport.stop();
      //Tone.Transport.start();
    });
  }
}


function soundDesign(){


  reverb = new Tone.Reverb({
    decay: 5,
    wet: 0.6,
  });
  
  pingpong = new Tone.PingPongDelay({
    delayTime: 0.4, 
    feedback: 0.5, 
    wet: 0.3});
  
  filter1 = new Tone.Filter(400, "lowpass");
  filter2 = new Tone.Filter(400, "lowpass");
  
  env1 = new Tone.FrequencyEnvelope({
		attack: "4n",
		decay: "8n",
        sustain: 0,
        release: 0,
        baseFrequency: "C0",
	    octaves: 5,
        attackCurve: "linear",
	});
  env2 = new Tone.FrequencyEnvelope({
		attack: "2n",
		decay: "2n",
        sustain: 0,
        release: 0,
        baseFrequency: "C0",
	    octaves: 6,
        attackCurve: "sine",
	});

  env1.connect(filter1.frequency);
  env2.connect(filter2.frequency);

  console.log(mean);
  console.log(maximum);

  for(i=0; i<8; i++){
    synths[i] = new Tone.Synth({oscillator: {type : "fmsine"}}).toDestination();
    synths[i].chain(filter1, reverb, pingpong, Tone.Destination);
    synths[i].volume.value=-100;
  }

  
/*  // SE COLLASSO LA PARTE SOTTOSTANTE INDENTATA IN UN CICLO FOR COME IL SEGUENTE NON FUNZIONA
  
  for(i=0; i<8; i++){
    loop[i] = new Tone.Loop(time => {
              synths[i].triggerAttackRelease(planetNotes[i], planetNotesDuration[i], time);
            }, planetRatios[i].toString()+"n").start(0);
  } */
 

/*   loop[0] = new Tone.Loop(time => {
    var player = new Tone.Player().toDestination();
    var buffer = new Tone.Buffer("samples/1.wav", function(){player = buffer.get();});
    player.start(time);
    //samples[0].start(time);
  }, planetRatios[2].toString()+"n").start(0);
   */

  loops[1] = new Tone.Loop(time => {
    synths[1].triggerAttackRelease(planetNotes[1], planetNotesDuration[1], time);
  }, planetRatios[1].toString()+"n").start(0);

  loops[2] = new Tone.Loop(time => {
    synths[2].triggerAttackRelease(planetNotes[2], planetNotesDuration[2], time);
  }, planetRatios[2].toString()+"n").start(0);

  loops[3] = new Tone.Loop(time => {
    synths[3].triggerAttackRelease(planetNotes[3], planetNotesDuration[3], time);
  }, planetRatios[3].toString()+"n").start(0);

  loops[4] = new Tone.Loop(time => {
    synths[4].triggerAttackRelease(planetNotes[4], planetNotesDuration[4], time);
  }, planetRatios[4].toString()+"n").start(0);

  loops[5] = new Tone.Loop(time => {
    synths[5].triggerAttackRelease(planetNotes[5], planetNotesDuration[5], time);
  }, planetRatios[5].toString()+"n").start(0);

  loops[6] = new Tone.Loop(time => {
    synths[6].triggerAttackRelease(planetNotes[6], planetNotesDuration[6], time);
  }, planetRatios[6].toString()+"n").start(0);

  loops[7] = new Tone.Loop(time => {
    synths[7].triggerAttackRelease(planetNotes[7], planetNotesDuration[7], time);
  }, planetRatios[7].toString()+"n").start(0);



  Tone.Transport.start();
  Tone.Transport.bpm.value=bpm;
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


//VORREI UN ARRAY DI LUNGHEZZA 8 PER MODULARE GLI ENVELOPE AKA DURATA DELLE NOTE
//1 VARIABILE PER LA TONALITA'
//DELAY E RIVERBERO MODULATI DALLE PHOTO?

//scelte generative no drum machine
//1 PER IL BPM E TOGLIAMO LO SLIDER?
//1 ARRAY DI LUNGHEZZA 8 PER MODULARE I TEMPI DI RIVOLUZIONE/VELOCITA' DEI LOOP
//E NON LO RENDIAMO PERSONALIZZABILE?
function getMeanMax(){

  let mean;
  let len = 0;
  let maximum = 0;
  let sum = 0;

  for(i=0; i<1200; i=i+5){
    for(j=0; j<717; j=j+5){
      index = (i*1200) + j;
      c = environmentSelectedImg.get(i,j);
      if(brightness(c)>maximum){
        maximum = brightness(c);
      }
      sum = sum + brightness(c);
      len++;
    }
  }
  mean = sum / len;
  values = [mean, maximum];
  
  return values;
}


let tri = {
  center: [0, 0, 0],
  distance: 2300,
  rotation: [1,-0.3 , 0, 0],
}


let bi = {
  center: [0, 0, 0],
  distance: 1600,
  rotation: [0.2, -0.2, 0, 0],
}

document.getElementByClassName("mySliders").oninput = function() {
  var value = (this.value-this.min)/(this.max-this.min)*100
  this.style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + value + '%, #fff ' + value + '%, white 100%)'
};