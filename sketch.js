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
let filters=[];
let envelopes=[];
let samples=[];
let loops=[];
let playIsOff=true;
let bpm = 20;
//1= MEASURE, 4=BEAT
let planetRatios = [8, 7, 6, 5, 4, 3, 2, 1];
/*
let planetNotes = ["C2", "G2", "E3", "B3", "C4", "D4", "A4", "B4"];
let planetNotes2 = ["C1", "G1", "E2", "B2", "C3", "D3", "A3", "B3"];
*/
let planetNotes = ["B4", "A4", "D4", "C4", "B3", "E3", "G2", "C2"];
//let planetNotes2 = ["B3", "A3", "D3", "C3", "B2", "E2", "G1", "C1"];
let lineWobble = 0;
let wobbleArray = [];
//ENVIRONMENT
let border=10;
let topBorder=100;
let envWidth;
let envHeight;
let button=[];
let loadTimer;
let fontazzo;
let numSelected=0;
let pageStep=0;
let environmentSelectedImg;
//IMAGE PROCESSING
let mean;
let maximum;
//SOUNDPAGE CONTROLS
let soundPageChosenEnvButton;
let soundPageModalScaleSelector;
let soundPageWaveformSelector;
let soundPageParam2;
let soundPageParam3;
let soundPageParam4;
let soundPageParam5;
let soundPageGoToDrumMachine;





function preload() {

  imgEarth = loadImage('img/plani.jpg');
  imgSun = loadImage('img/sun.jpg');
  imgMoon = loadImage('img/moon.jpg');
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

  //SELECT ENVIRONMENT PAGE CONTROLS---------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------
    envWidth = (windowWidth-4*border-topBorder)/3;
    envHeight =(windowHeight-4*border-topBorder)/3;

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

  //CANVAS AND EASY CAM-------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------------
  createCanvas(windowWidth, windowHeight, WEBGL);

  frameRate(30);
  setAttributes('antialias', true);
  perspective(PI / 2, width / height, 0.1, 15000);
  textureWrap(CLAMP);

  button1 = createButton('2D');     // creazione bottoni per switching 2D/3D
  button1.position(20, 20);
  
  button2 = createButton('3D');
  button2.position(20, 85);

  button1.mouseClicked(set2d);      // clickando i bottoni si switchano gli stati della easycamera, dichiarati di seguito
  button2.mouseClicked(set3d);

  function set2d() {        // setter vista 2d
    easycam.setState(bi, 700)
    easycam.removeMouseListeners()
  }
  
  function set3d() {        // setter vista 3d (stato iniziale)
    easycam.attachMouseListeners(p5.renderer)
    easycam.setState(tri, 700)
  }

  //DRUM MACHINE CONTROLS -----------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------
  
  button3 = createButton('Play');
  button3.position(windowWidth-100, 20);
  button3.mouseClicked(function(){
    if(playIsOff){
      playIsOff=false;
      button3.html("Stop");
    } 
    else{
    playIsOff=true;
    button3.html("Play");
    }
  });

  setNumPlanets = createSlider(1, 8, 8, 1);
  setNumPlanets.position(200, 40);
  setNumPlanets.addClass("mySliders");
  setNumPlanets.addClass("planets-caption");

  setBPM = createSlider(20, 70, 35, 5);
  setBPM.position(550, 40);
  setBPM.addClass("mySliders");
  setBPM.addClass("speed-caption");

  //soundPAGE CONTROLS------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  soundPageChosenEnvButton = createImg('img/env/' + (1).toString(10) + '.jpg');

  soundPageModalScaleSelector=createSelect();
  soundPageModalScaleSelector.option('IONIAN');
  soundPageModalScaleSelector.option('DORIAN');
  soundPageModalScaleSelector.option('PHRYGIAN');
  soundPageModalScaleSelector.option('LYDIAN');
  soundPageModalScaleSelector.option('MIXOLYDIAN');
  soundPageModalScaleSelector.option('AEOLIAN');
  soundPageModalScaleSelector.option('LOCRIAN');
  soundPageModalScaleSelector.position(windowWidth-350, 200);

  soundPageWaveformSelector=createSelect();
  soundPageWaveformSelector.option('SINE');
  soundPageWaveformSelector.option('FMSINE');
  soundPageWaveformSelector.option('SAWTOOTH');
  soundPageWaveformSelector.option('TRIANGLE');
  soundPageWaveformSelector.option('SQUARE');
  soundPageWaveformSelector.option('PWM');
  soundPageWaveformSelector.option('PULSE');
  soundPageWaveformSelector.position(windowWidth-350, 250);

  soundPageParam2=createSlider(1, 10, 5, 1);
  soundPageParam2.position(windowWidth-450, 300);
  soundPageParam2.addClass("mySliders");
  soundPageParam2.addClass("delayTime-caption");

  soundPageParam3=createSlider(1, 10, 5, 1);
  soundPageParam3.position(windowWidth-450, 370);
  soundPageParam3.addClass("mySliders");
  soundPageParam3.addClass("delayAmount-caption");
  
  soundPageParam4=createSlider(1, 10, 5, 1);
  soundPageParam4.position(windowWidth-450, 440);
  soundPageParam4.addClass("mySliders");
  soundPageParam4.addClass("reverbAmount-caption");
  
  soundPageParam5=createSlider(1, 10, 5, 1);
  soundPageParam5.position(windowWidth-450, 510);
  soundPageParam5.addClass("mySliders");
  soundPageParam5.addClass("chordProgression-caption");
  
  soundPageGoToDrumMachine = createButton('DRUM MACHINE');
  soundPageGoToDrumMachine.position(windowWidth-420, 580);
  soundPageGoToDrumMachine.addClass("drumButton");

}


function draw() {
  //_________________________________SELECT ENVIRONMENT PAGE_________________________________________________________
  if(pageStep==0)
  {

    button1.hide();
    button2.hide();
    button3.hide();
    // oscChoice.hide();
    setNumPlanets.hide();
    setBPM.hide();
    soundPageChosenEnvButton.hide();
    soundPageModalScaleSelector.hide();
    soundPageGoToDrumMachine.hide();
    soundPageWaveformSelector.hide();
    soundPageParam2.hide();
    soundPageParam3.hide();
    soundPageParam4.hide();
    soundPageParam5.hide();

    for(i=0; i<9; i++){
      button[i].size(envWidth, envHeight);
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
    
    for(i=0; i<9; i++){
      button[i].show();
    }


    push();
    background(20);
    fill(255);
    stroke(255);
    textFont(fontazzo);
    textSize(60);
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
        pageStep=1;
      });
      button[1].mouseClicked(function(){
        numSelected=1;
        environmentSelectedImg=loadImage('img/env/' + (numSelected+1).toString(10) + '.jpg');
        mean = getMeanMax()[0];
        maximum = getMeanMax()[1];
        pageStep=1;
      });
      button[2].mouseClicked(function(){
        numSelected=2;
        environmentSelectedImg=loadImage('img/env/' + (numSelected+1).toString(10) + '.jpg');
        mean = getMeanMax()[0];
        maximum = getMeanMax()[1];
        pageStep=1;
      });
      button[3].mouseClicked(function(){
        numSelected=3;
        environmentSelectedImg=loadImage('img/env/' + (numSelected+1).toString(10) + '.jpg');
        mean = getMeanMax()[0];
        maximum = getMeanMax()[1];  
        pageStep=1;
      });
      button[4].mouseClicked(function(){
        numSelected=4;
         environmentSelectedImg=loadImage('img/env/' + (numSelected+1).toString(10) + '.jpg');
        mean = getMeanMax()[0];
        maximum = getMeanMax()[1];
        pageStep=1;
      });
      button[5].mouseClicked(function(){
        numSelected=5;
        environmentSelectedImg=loadImage('img/env/' + (numSelected+1).toString(10) + '.jpg');
        mean = getMeanMax()[0];
        maximum = getMeanMax()[1]; 
        pageStep=1;
      });
      button[6].mouseClicked(function(){
        numSelected=6;
         environmentSelectedImg=loadImage('img/env/' + (numSelected+1).toString(10) + '.jpg');
        mean = getMeanMax()[0];
        maximum = getMeanMax()[1]; 
        pageStep=1;
      });
      button[7].mouseClicked(function(){
        numSelected=7;
        environmentSelectedImg=loadImage('img/env/' + (numSelected+1).toString(10) + '.jpg');
        mean = getMeanMax()[0];
        maximum = getMeanMax()[1]; 
        pageStep=1;
      });
      button[8].mouseClicked(function(){
        numSelected=8;
        environmentSelectedImg=loadImage('img/env/' + (numSelected+1).toString(10) + '.jpg');
        mean = getMeanMax()[0];
        maximum = getMeanMax()[1]; 
        pageStep=1;
      });

    
    pop();
  }//_________________________________SOUND DESIGN PAGE______________________________________________________________
  else if (pageStep==1)
  {
    push();
    background(20);
    stroke(255);
    fill(255);
    textSize(60);
    textFont(fontazzo);
    textAlign(CENTER);
    text('THE ENVIRONMENT GENERATED THE FOLLOWING PARAMETERS', 0, -windowHeight/2-170);
    textSize(24);
    text('Adjust the parameters as you wish before continuing to the drum machine', 0, -windowHeight/2-110);
    text('Click the image to change environment', -(envWidth*1.75/2), 360);
    
    for(i=0; i<9; i++){
      button[i].hide();
    }
  
    soundPageGoToDrumMachine.show();
    soundPageGoToDrumMachine.mouseClicked(function(){
      soundDesign();
      loadTimer=millis();
      pageStep=2;
    });

    soundPageModalScaleSelector.show(); //MODAL SCALE
    soundPageWaveformSelector.show(); //WAVEFORM
    soundPageParam2.show(); //DELAY TIME
    soundPageParam3.show(); //DELAY AMOUNT
    soundPageParam4.show(); //REVERB AMOUNT
    soundPageParam5.show(); //ENVELOPE RATIOS

    soundPageChosenEnvButton=button[numSelected];
    soundPageChosenEnvButton.size(envWidth*1.75, envHeight*1.75);
    soundPageChosenEnvButton.position(100, 200);
    soundPageChosenEnvButton.show();
    soundPageChosenEnvButton.mouseClicked(function(){
      pageStep=0;
    });
    
    pop();
  }//_________________________________________LOADING PAGE____________________________________________________________
  else if (pageStep==2)
  {
    soundPageModalScaleSelector.hide();
    soundPageGoToDrumMachine.hide();
    soundPageWaveformSelector.hide();
    soundPageParam2.hide();
    soundPageParam3.hide();
    soundPageParam4.hide();
    soundPageParam5.hide();

    soundPageChosenEnvButton.hide();
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
    strokeWeight(5);
    noFill();
    rect(-300, windowHeight/2-500, 600, 100);
    noStroke();
    fill(255, 255, 255, 100);
    rect(-300, windowHeight/2-500, (millis()-loadTimer)/2000*597, 100);
  
    if ((millis()-loadTimer)/2000>=1){
      
      easycam = createEasyCam(tri) // creazione oggetto easycam con distanza iniziale 
      easycam.setState(tri);    // stato iniziale prospettico
      easycam.setDistanceMax(2900);
      easycam.setDistanceMin(200);
      pageStep=3;
    }
    pop();
  }//__________________________________________SPACE PAGE______________________________________________________________
  else if(pageStep==3)
  {

    button1.show();
    button2.show();
    button3.show();
    // oscChoice.show();
    setNumPlanets.show();
    setBPM.show();

    //BACKGROUND
    background(0,0,0,0);

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
      Tone.Transport.stop();
      Tone.Transport.start();
    });
  }
}


function soundDesign(){

  reverb = new Tone.Reverb({
    decay: 10,
    wet: 0.6,
  });
  
  pingpong = new Tone.PingPongDelay({
    delayTime: 0.4, 
    feedback: 0.5, 
    wet: 0.3});
  

  for(i=0; i<8; i++){

    filters[i] = new Tone.Filter(400, "lowpass");

    envelopes[i] = new Tone.FrequencyEnvelope({
      attack: (planetRatios[i]*2).toString()+"n",
      decay: (planetRatios[i]*4).toString()+"n",
          sustain: 0,
          release: 0,
          baseFrequency: "C0",
          octaves: 7,
          attackCurve: "sine",
    });

    envelopes[i].connect(filters[i].frequency);

    synths[i] = new Tone.Synth({oscillator: {type : "sawtooth"}});
    synths[i].chain(filters[i], reverb, pingpong, Tone.Destination);
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

  loops[0] = new Tone.Loop(time => {
    synths[0].triggerAttackRelease(planetNotes[0], planetRatios[0].toString()+"n", time);
    envelopes[0].triggerAttackRelease(planetRatios[0].toString()+"n", time);
  }, planetRatios[0].toString()+"n").start(0);

  loops[1] = new Tone.Loop(time => {
    synths[1].triggerAttackRelease(planetNotes[1], planetRatios[1].toString()+"n", time);
    envelopes[1].triggerAttackRelease(planetRatios[1].toString()+"n", time);
  }, planetRatios[1].toString()+"n").start(0);

  loops[2] = new Tone.Loop(time => {
    synths[2].triggerAttackRelease(planetNotes[2], planetRatios[2].toString()+"n", time);
    envelopes[2].triggerAttackRelease(planetRatios[2].toString()+"n", time);
  }, planetRatios[2].toString()+"n").start(0);

  loops[3] = new Tone.Loop(time => {
    synths[3].triggerAttackRelease(planetNotes[3], planetRatios[3].toString()+"n", time);
    envelopes[3].triggerAttackRelease(planetRatios[3].toString()+"n", time);
  }, planetRatios[3].toString()+"n").start(0);

  loops[4] = new Tone.Loop(time => {
    synths[4].triggerAttackRelease(planetNotes[4], planetRatios[4].toString()+"n", time);
    envelopes[4].triggerAttackRelease(planetRatios[4].toString()+"n", time);
  }, planetRatios[4].toString()+"n").start(0);

  loops[5] = new Tone.Loop(time => {
    synths[5].triggerAttackRelease(planetNotes[5], planetRatios[5].toString()+"n", time);
    envelopes[5].triggerAttackRelease(planetRatios[5].toString()+"n", time);
  }, planetRatios[5].toString()+"n").start(0);

  loops[6] = new Tone.Loop(time => {
    synths[6].triggerAttackRelease(planetNotes[6], planetRatios[6].toString()+"n", time);
    envelopes[6].triggerAttackRelease(planetRatios[6].toString()+"n", time);
  }, planetRatios[6].toString()+"n").start(0);

  loops[7] = new Tone.Loop(time => {
    synths[7].triggerAttackRelease(planetNotes[7], planetRatios[7].toString()+"n", time);
    envelopes[7].triggerAttackRelease(planetRatios[7].toString()+"n", time);
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