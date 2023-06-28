var k = localStorage.getItem("k");
var m = localStorage.getItem("m");
var p = localStorage.getItem("p");
var t = localStorage.getItem("t");

var guideflag2 = localStorage.getItem("guideflag2");

console.log(guideflag2);

addEventListener("dblclick", () => {easycam.setState(tri)});

ondblclick = () => {};

// DICHIARO LE VARIABILI FUORI DALLA FUNZIONI
// PERCHE' ABBIANO VISIBILITA' ANCHE NELLE ALTRE FUNZIONI
let imgEarth;
let imgSun;
let imgMoon;
var imgSky;
let imgPlanets = [];
let sunDim = 50;
//let planetOrbWidth = [170, 300, 500, 800, 1050, 1300, 1600, 1900];
let planetOrbHeight = [
  sunDim + 14,
  12.5 + sunDim + 27,
  37.5 + sunDim + 37.25,
  45 + sunDim + 56.75,
  sunDim + 147,
  sunDim + 216.625,
  sunDim + 291.5,
  sunDim + 341.5,
];
let planetOrbWidth = planetOrbHeight.map((x) => x * 1.5);
let planetTilt = [0, 0, -25, 0, 0, 0, 0, 0];
let planetRotation = [0.005, 0.01, 0.015, 0.02, 0.025, 0.03, 0.035, 0.04];
let planetDiameter = [6, 12.5, 15.75, 8.25, 35, 29, 12.5, 12];
let bool = false;
let easycam;

let revolutionRate = 0;
let movePlanet=0;
let playIsOff = true;
let planetRatios = [16, 8, 16, 2, 2, 2, 2, 1];

let chromas = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];
let chromas2 = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
];

let myScale = [];
let majProf = [0, 2, 4, 5, 7, 9, 11];
let minProf = [0, 2, 3, 5, 7, 8, 10];
let maj = Boolean(parseInt(m));
console.log(maj);
let profile = [];
let key = parseInt(k);

for (i = 0; i < 7; i++) {
  if (maj) {
    profile = majProf;
  } else {
    profile = minProf;
  }
  myScale[i] = chromas[key + profile[i]];
}

console.log(myScale);

let tetrad;
if(t=0){tetrad=[1, 3, 5, 8];}
else{tetrad=[1, 3, 5, 7];}

let progression1 = [1, 5, 6, 4];
let progression2 = [1, 4, 2, 5];
let progression3 = [1, 4, 6, 5];
let progression4 = [1, 6, 4];
let progression5 = [1, 5];

let progressionNames = [
  "I - V - VI - IV",
  "I - IV - II - V",
  "I - IV - VI - V",
  "I - VI - IV",
  "I - V",
];

//IMAGE PROCESSING
let mean;
let maximum;
let selectedMode = myScale; 
//-------------------------------------------------------------------------------------------------------------------
//SOUND
let context = new window.AudioContext();
let finalGain, bassGain, leadGain, arp1Gain, arp2Gain, delayGain, convolverGain;
let bassOsc, leadOsc, arp1Osc, arp2Osc;
let chordOsc=[];
let chordGain=[];
let msRep=8000;


switch (parseInt(p)) {
  case 1:
    selectedProgression = progression1;
    break;
  case 2:
    selectedProgression = progression2;
    break;
  case 3:
    selectedProgression = progression3;
    break;
  case 4:
    selectedProgression = progression4;
    break;
  case 5:
    selectedProgression = progression5;
    break;
}

//BASS
let bassNotes = [];
for (i = 0; i < selectedProgression.length; i++) {
  bassNotes[i] = getNoteFreq(selectedMode[selectedProgression[i] - 1], 2);
  
}

//CHORD
let chordNotes = [];
for (i = 0; i < 4; i++) {
  chordNotes[i] = [];
  for (j = 0; j < selectedProgression.length; j++) {
    if (selectedProgression[j] - 1 + (tetrad[i] - 1) < selectedMode.length) {
      chordNotes[i][j] = selectedMode[selectedProgression[j] - 1 + (tetrad[i] - 1)];
    } else {
      chordNotes[i][j] = selectedMode[selectedProgression[j] - 1 + (tetrad[i] - 1) - 7];
    }
  }
}

//LEAD
let leadNotes = [];
let pentatonica;
if(t=0){pentatonica=[1, 3, 4, 5, 8];}
else{pentatonica=[1, 3, 4, 5, 7];}
for (i = 0; i < pentatonica.length; i++) {
  leadNotes[i] = getNoteFreq(selectedMode[pentatonica[i]-1], 4);
  leadNotes[i+pentatonica.length] = getNoteFreq(selectedMode[pentatonica[i]-1], 5);
}

//Stars variables
let s = 0;
let r_s = 2500;
let x_s,
  y_s,
  z_s,
  c_s = [];
let n_s = 150;
let white = [255, 255, 255];
let yellow = [255, 255, 180];
let cyan = [120, 180, 255];
let red = [255, 180, 180];
let colors = [white, white, white, yellow, cyan, red];

//Planets menus
let tempVol = [];
let muted = false;
let tendina = [];
let slidVol = [];
let volumes = [1, 0.05, 0.05, 0.05, 0.05, 0.3, 0.05, 0.1];
let lista = ["1", "2", "3", "4", "5", "8", "16"];
let refreshed = false;
let idVol = [
  "instr1",
  "instr2",
  "instr3",
  "instr4",
  "instr5",
  "instr6",
  "instr7",
  "instr8",
];
let idTend = ["pl1", "pl2", "pl3", "pl4", "pl5", "pl6", "pl7", "pl8"];

/* //SOUNDLINE WOBBLING
let lineWobble = 0;
let wobbleArray = []; */

function preload() {
  imgEarth = loadImage("Images/plani.jpg");
  imgSun = loadImage("Images/sun.jpg");
  imgMoon = loadImage("Images/moon.jpg");

  environmentSelectedImg = loadImage(localStorage.getItem("environment"));
  wrappedSelectedImg = loadImage(localStorage.getItem("wrapped"));

  for (i = 0; i < 8; i++) {
    imgPlanets[i] = loadImage("Images/" + (i + 1).toString(10) + ".jpg");
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  easycam.setViewport([0, 0, windowWidth, windowHeight]); // adattamento viewport nel caso
  // di resizing per la easycam
  for (i = 0; i < 8; i++) {
    tendina[i].position(windowWidth/50 , windowHeight/8 +  i * windowHeight/10);
    slidVol[i].position(windowWidth/20, (windowHeight/8 + 7 * windowHeight/10) -  i * windowHeight/10);
  }
}

function setup() {
  //CANVAS AND EASY CAM-------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------------
  createCanvas(windowWidth, windowHeight, WEBGL);
  easycam = createEasyCam(); // creazione oggetto easycam con distanza iniziale
  easycam.setState(tri); // stato iniziale prospettico
  easycam.setDistanceMax(725);
  easycam.setDistanceMin(sunDim + 50);
  soundDesign();

  frameRate(24);
  setAttributes("antialias", true);
  perspective(PI / 2, width / height, 0.1, 15000);
  textureWrap(CLAMP);

  button1 = createButton("2D"); // creazione bottoni per switching 2D/3D
  //button1.position(windowWidth - 100, 120);
  button1.addClass("style-btn");
  button1.addClass("position2D");

  button2 = createButton("3D");
  //button2.position(windowWidth - 100, 185);
  button2.addClass("style-btn");
  button2.addClass("position3D");

  button1.mouseClicked(set2d); // clickando i bottoni si switchano gli stati della easycamera, dichiarati di seguito
  button2.mouseClicked(set3d);

  function set2d() {
    // setter vista 2d
    easycam.setState(bi, 700);
    easycam.removeMouseListeners();
  }

  function set3d() {
    // setter vista 3d (stato iniziale)
    easycam.attachMouseListeners(p5.renderer);
    easycam.setState(tri, 700);
  }

  //CONTROLS -----------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------

  button3 = createButton("Play");
  //button3.position(windowWidth - 100, 20);
  button3.addClass("style-btn");
  button3.addClass("positionPlayStop");
  button3.mouseClicked(function () {
    if (playIsOff) {
      playIsOff = false;
      sync();
      //playSound();
      button3.html("Stop");
    } else {
      playIsOff = true;
      stopSound();
      finalGain.gain.value=0;
      delayGain.gain.value=0;
      button3.html("Play");
    }
  });

  //RATIO SELECTORS
  for (i = 0; i < 8; i++) {
    tendina[i] = createSelect();
    tendina[i].position(windowWidth/50 , windowHeight/8 +  i * windowHeight/10);
    tendina[i].addClass("style-btn");
    tendina[i].addClass("show");
    //tendina[i].addClass("positionMenu");
    tendina[i].id(idTend[i]);
    tendina[i].style("height", "3.8vw");
    tendina[i].style("width", "3.8vw");
    tendina[i].changed(changeRatio);
    for (let j = 0; j < lista.length; j++) {
      tendina[i].option(lista[j]);
    }
    tendina[i].selected(planetRatios[i]);
  }

  //VOLUME SLIDERS
  for (i = 0; i < 8; i++) {
    if(i==0){
      slidVol[i] = createSlider(0, 1, volumes[i], 0.001);
    }
    else if(i==5){
      slidVol[i] = createSlider(0, 0.5, volumes[i], 0.001);
    }
    else{
      slidVol[i] = createSlider(0, 0.3, volumes[i], 0.001);
    }

    slidVol[i].position(windowWidth/20, (windowHeight/8 + 7 * windowHeight/10) -  i * windowHeight/10);
    slidVol[i].addClass("slider");
    slidVol[i].addClass("show");
    slidVol[i].addClass("volume");
    slidVol[i].addClass("positionMenu");
    slidVol[i].id(idVol[7 - i]);
    slidVol[i].style("height", "3vw");
    slidVol[i].style("width", "10vw");
    slidVol[i].style("margin")
    //slidVol[i].style('background-color', '#000000');

    slidVol[i].changed(changeVolume);
  }

  //MENU
  menuButton = createButton("Hide");
  let hiddenMenu = false;
  //menuButton.position(20, 20);
  menuButton.addClass("style-btn");
  menuButton.addClass("positionMenu");
  menuButton.style("height", "3vw");
  menuButton.style("width", "6.5vw");
  menuButton.mouseClicked(function () {
    if (hiddenMenu) {
      hiddenMenu = false;
      menuButton.html("Hide");
      for (i = 0; i < 8; i++) {
        tendina[i].addClass("show");
        slidVol[i].addClass("show");
        tendina[i].removeClass("hide");
        slidVol[i].removeClass("hide");
      }
    } else {
      hiddenMenu = true;
      menuButton.html("Menu");
      for (i = 0; i < 8; i++) {
        tendina[i].addClass("hide");
        slidVol[i].addClass("hide");
        tendina[i].removeClass("show");
        slidVol[i].removeClass("show");
      }
    }
  });

  //MUTE
  button4 = createButton("Mute");
  button4.addClass("style-btn");
  button4.addClass("positionMute");
  button4.style("height", "3vw");
  button4.style("width", "6.5vw");
  button4.mouseClicked(function () {
    if (!muted) {
      muted = true;
      button4.html("Unmute");
      for (i = 0; i < 8; i++) {
        tempVol[i] = slidVol[i].value();
        volumes[i] = 0;
        slidVol[i].value(0);
      }
    } else {
      muted = false;
      button4.html("Mute");
      for (i = 0; i < 8; i++) {
        volumes[i] = tempVol[i];
        slidVol[i].value(tempVol[i]);
      }
    }
    //refreshVolumes();
  });

  document.getElementById("key2").textContent =
    "Detected key: " + " " + chromas2[k];

  if (m == 0) {
    document.getElementById("mode2").textContent = "Detected mode: " + "Minor";
  } else {
    document.getElementById("mode2").textContent = "Detected mode: " + "Major";
  }

  document.getElementById("prog2").textContent =
    "Detected progression: " + progressionNames[p - 1];

  if (t == 0) {
    document.getElementById("tetrad2").textContent =
      "Detected chord type: " + "Standard";
  } else {
    document.getElementById("tetrad2").textContent =
      "Detected chord type: " + "Seventh";
  }
}

function changeRatio() {
  console.log("Ratios");
  for (i = 0; i < 8; i++) {
    planetRatios[i] = tendina[i].value();
    console.log(planetRatios[i]);
  }
  playIsOff = true;
  button3.html("Play");
  stopSound();
  finalGain.gain.value=0;
  delayGain.gain.value=0;
}
/*
function refreshVolumes() {
  console.log("Refreshed");
  bassGain.gain.linearRampToValueAtTime(volumes[0], 0.1);
  for(i=0; i<4; i++){
    chordGain[i].gain.linearRampToValueAtTime(volumes[i+1], 0.1);
  }
  leadGain.gain.linearRampToValueAtTime(volumes[5], 0.1);
  arp1Gain.gain.linearRampToValueAtTime(volumes[6], 0.1);
  arp2Gain.gain.linearRampToValueAtTime(volumes[7], 0.1);
}
*/
function changeVolume() {
  muted = false;
  button4.html("Mute");
  console.log("Volumes");
  
  for (i = 0; i < 8; i++) {
    volumes[i] = slidVol[i].value();
    console.log(volumes[i]);
  }
  
  //refreshVolumes();
}

function draw() {
  //BACKGROUND
  background(0, 0, 0, 0);


  //muro invisibile per limiti della sfera
  let currentDist = Math.sqrt(
    easycam.getPosition()[0] ** 2 +
      easycam.getPosition()[1] ** 2 +
      easycam.getPosition()[2] ** 2
  );

  if (currentDist > 3000.0) {
    easycam.setState(tri, 400);
  }

  // SKYBOX
     if(s%20 == 0){
    x_s = [];
    y_s = [];
    z_s = [];  
    for (i=0; i<50; i++){
      x_s.push(random(-4000, 4000));
      y_s.push(random(-4000, 4000));
      z_s.push(random(-4000, 4000));
    }
     push();
    noStroke();
    texture(wrappedSelectedImg);
    rotateY(frameCount * 0.0005);
    sphere(4000);
    pop(); 
    s = 0;
  } 
/*
  if (s == 0) {
    s++;
    x_s = [];
    y_s = [];
    z_s = [];
    c_s = [];
    for (i = 0; i < n_s; i++) {
      x_s[i] = random(-r_s * 1.2, r_s * 1.2);
      y_s[i] = random(-r_s, r_s);
      z_s[i] = random(-r_s, r_s);
      c_s[i] = white;
    }
  }

  for (i = 0; i < n_s; i++) {
    if (i % (n_s / 4) == 0) {
      x_s.push(random(-r_s * 1.2, r_s * 1.2));
      y_s.push(random(-r_s, r_s));
      z_s.push(random(-r_s, r_s));
      x_s.shift();
      y_s.shift();
      z_s.shift();
      var col = random([0, 1, 2, 3, 4, 5]);
      c_s.push(colors[col]);
      c_s.shift();
    }

    var d_s = Math.sqrt(x_s[i] ** 2 + y_s[i] ** 2 + z_s[i] ** 2);
    if (d_s > 2900) {
      if (i < n_s / 10 || i > (9 * n_s) / 10) {
        strokeWeight(1);
        stroke(c_s[i], 80);
        fill(c_s[i], 80);
      } else {
        strokeWeight(random([3, 4]));
        stroke(c_s[i]);
        fill(c_s[i]);
      }

      point(x_s[i], y_s[i], z_s[i]);
      if (d_s < 3200) {
        var l = random([12, 13, 14]);
        strokeWeight(1);
        line(
          x_s[i] - l,
          y_s[i] - l,
          z_s[i] - l,
          x_s[i] + l,
          y_s[i] + l,
          z_s[i] + l
        );
        line(
          x_s[i] - l,
          y_s[i] - l,
          z_s[i] + l,
          x_s[i] + l,
          y_s[i] + l,
          z_s[i] - l
        );
        line(
          x_s[i] - l,
          y_s[i] + l,
          z_s[i] + l,
          x_s[i] + l,
          y_s[i] - l,
          z_s[i] - l
        );
      }
    }
  }
*/
  //SUN
  noStroke();
  rotateY(PI);
  rotateY(frameCount * 0.005);
  texture(imgSun);
  sphere(sunDim);
  rotateY(-frameCount * 0.005);
  rotateY(-PI);

  //LIGHT
  ambientLight(60);
  pointLight(255, 255, 255, 0, 0, 0);

  //--------------------------------------------------SET NUM PLANETS DEACTIVATED FOR SOUND DESIGN PURPOSES--------------------------------------------

  //CONTROLS AND DRAW PLANETS
  for (i = 0; i < 8; i++) {
    planet(
      planetOrbWidth[i],
      planetOrbHeight[i],
      planetTilt[i],
      planetRotation[i],
      imgPlanets[i],
      planetDiameter[i],
      planetRatios[i],
      movePlanet
    );
    /* if(i==2){   //MOON
          push();
          translate(-sin(2*Math.PI*(((Tone.Transport.seconds)*(Tone.Transport.bpm.value/60/4))*planetRatios[2])+PI)*500, 0, -[cos(2*Math.PI*(((Tone.Transport.seconds)*(Tone.Transport.bpm.value/60/4))*planetRatios[2])+PI)*333]);
          rotateY(-frameCount * 0.015);
          planet(100, 100, 0, 0.005, imgMoon, 15, 6);
          pop();
        } */

    //---------------------------------------------------------MIXER--------------------------------------------------------------------------
    if (!playIsOff) {
      //Tone.Transport.start();
      //refreshVolumes();
      //refreshed = true;
    } else {
      /*
      Tone.Transport.pause();
      bassSynth.volume.value = -100;
      for (j = 0; j < 4; j++) {
        chordSynths[j].volume.value = -100;
      }
      leadSynth.volume.value = -100;
      arp1Synth.volume.value = -100;
      arp2Synth.volume.value = -100;
      */
    }
  }
  /*
      for(i=val; i<8; i++){
        synths[i].volume.value=-100;
      }
       */
  // oscChoice.changed(function(){for(i=0; i<8; i++){synths[i].oscillator.set({type: oscChoice.value().toString()});}});

  /* setBPM.changed(function(){
        Tone.Transport.bpm.value=setBPM.value();
        Tone.Transport.stop();
        Tone.Transport.start();
      }); */

  //text("red", slidVol[1].x + slidVol[1].width);
  //text("green", gSlider.x * 2 + gSlider.width, 65);
  //text("blue", bSlider.x * 2 + bSlider.width, 95);
}

let chroma = "";
function getNoteFreq(chroma, scaleNum){
  //Example: getNote("C", 4)
  var index = 0;
  index = chromas.indexOf(chroma);
  var freq = 0;
  freq =  32.703 * Math.pow(2, (index/12) + (scaleNum-1)) ;
  return freq;
}

function sync() {
  console.log("sync?");
  if(
    !(
    (-0.05<sin(revolutionRate) && sin(revolutionRate)<0.05)
    &&
    cos(revolutionRate)>0.95
    )
    ){
      window.setTimeout(sync, 100); /* this checks the flag every 100 milliseconds*/
      document.getElementById("loading").textContent = "LOADING...";
    } 
    else {
      document.getElementById("loading").textContent = "";
      playSound();
      movePlanet=1;
      console.log("syncato!");
    }
}

function soundDesign() {
  //SOUND
  finalGain = context.createGain();
  finalGain.gain.value=0.3;

  bassOsc = context.createOscillator();
  bassGain = context.createGain();

  for(i=0; i<4; i++){
    chordOsc[i] = context.createOscillator();
    chordGain[i] = context.createGain();
    }

  leadOsc = context.createOscillator();
  leadGain = context.createGain();

  arp1Osc = context.createOscillator();
  arp1Gain = context.createGain();

  arp2Osc = context.createOscillator();
  arp2Gain = context.createGain();

  delay = context.createDelay(100); //100 (sec) è il max delay time, se non lo specifico è 1 sec
  delayGain = context.createGain();

  convolverGain = context.createGain();
  function impulseResponse(duration,decay){
    var lenght=context.sampleRate*duration;
    var impulse=context.createBuffer(1,lenght,context.sampleRate);
    var IR = impulse.getChannelData(0);
    for(var i=0; i<lenght; i++) IR[i]=(2*Math.random()-1)*Math.pow(1-i/lenght,decay);
    return impulse;
  }
  //Create impulse and convolver node
  var impulse = impulseResponse(5, 2) //1 second impulse with decay value of 2
  var convolver = new ConvolverNode(context,{buffer:impulse})
  convolverGain.gain.value=0.9;

  hi_filter= new BiquadFilterNode(context);

  //setup
  bassOsc.frequency.value=0;
  bassOsc.start();
  bassOsc.type="sine";
  leadOsc.frequency.value=0;
  leadOsc.start();
  leadOsc.type="sine";
  arp1Osc.frequency.value=0;
  arp1Osc.start();
  arp1Osc.type="sine";
  arp2Osc.frequency.value=0;
  arp2Osc.start();
  arp2Osc.type="sine";
  delay.delayTime.value=msRep/planetRatios[2]/1.5/1000;
  delayGain.gain.value=0.7;
  for(i=0; i<4; i++){
    chordOsc[i].frequency.value=0;
    chordOsc[i].start();
    chordOsc[i].type="square";
  }
  hi_filter.frequency.value=2000;

  //CONNETTO I NODI
  bassOsc.connect(bassGain);
  bassGain.connect(finalGain);

  leadOsc.connect(leadGain);
  leadGain.connect(finalGain);
  leadGain.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(delay);
  delay.connect(finalGain);

  leadGain.connect(convolver);
  delayGain.connect(convolver);
  convolver.connect(convolverGain);
  convolverGain.connect(finalGain);

for(i=0; i<4; i++){
  chordOsc[i].connect(chordGain[i]);
  chordGain[i].connect(convolver);
  chordGain[i].connect(finalGain);
}

arp1Osc.connect(arp1Gain);
arp1Gain.connect(finalGain);
arp1Gain.connect(delay);
//arp1Gain.connect(convolver);

arp2Osc.connect(arp2Gain);
arp2Gain.connect(finalGain);
//arp2Gain.connect(convolver);

finalGain.connect(hi_filter);
hi_filter.connect(context.destination);
//finalGain.connect(context.destination);

}

function quant(scale) 
{
  var a = Math.random()*(scale[scale.length-1]+1);
  var delta=1000;
  var quantizedNote=0;
  for(var i=0; i<scale.length; i++)
    {
      if(Math.abs(scale[i]-a)<delta)
        {
          delta=Math.abs(scale[i]-a);
          quantizedNote=scale[i];
        }
    }
  return quantizedNote
}    

function stopSound()
{
  clearInterval(bassLoop);
  clearInterval(chordLoop1);
  clearInterval(chordLoop2);
  clearInterval(chordLoop3);
  clearInterval(chordLoop4);
  clearInterval(leadLoop);
  clearInterval(arp1Loop);
  clearInterval(arp2Loop);
  bassGain.gain.linearRampToValueAtTime(0, 0.1);
  for(i=0; i<4; i++){
    chordGain[i].gain.linearRampToValueAtTime(0, 0.1);
  }
  leadGain.gain.linearRampToValueAtTime(0, 0.1);
  delayGain.gain.linearRampToValueAtTime(0, 0.1);
  arp1Gain.gain.linearRampToValueAtTime(0, 0.1);
  arp2Gain.gain.linearRampToValueAtTime(0, 0.1);
  movePlanet=0;
}

function playSound()
{
  context.resume();  
  finalGain.gain.value=0.2;
  delayGain.gain.value=0.7;
  bassLoop =  setInterval(playBass, msRep/planetRatios[7]);
  chordLoop1 = setInterval(playChord1, msRep/planetRatios[6]);
  chordLoop2 = setInterval(playChord2, msRep/planetRatios[5]);
  chordLoop3 = setInterval(playChord3, msRep/planetRatios[4]);
  chordLoop4 = setInterval(playChord4, msRep/planetRatios[3]);
  leadLoop=setInterval(playLead, msRep/planetRatios[2]);
  arp1Loop=setInterval(playArp1, msRep/planetRatios[1]);
  arp2Loop=setInterval(playArp2, msRep/planetRatios[0]);
}

let bassNotesIndex=0;
function playBass()
{
  bassGain.gain.value=0;
  bassOsc.frequency.value = bassNotes[bassNotesIndex];
  if(bassNotesIndex<bassNotes.length-1){bassNotesIndex++;}
  else{bassNotesIndex=0;}
  t0= context.currentTime;
  t1= t0+Number(msRep/planetRatios[7]/1000/2);  
  t2= t1+Number(msRep/planetRatios[7]/1000/2);
  bassGain.gain.linearRampToValueAtTime(volumes[0], t1);
  bassGain.gain.linearRampToValueAtTime(0, t2);
}

let chordNotesIndex=0;
function playChord1()
{
  if(bassNotesIndex==0){chordNotesIndex=bassNotes.length-1}
  else{chordNotesIndex=bassNotesIndex-1}

  chordGain[0].gain.value=0;
  chordOsc[0].frequency.value=getNoteFreq(chordNotes[3][chordNotesIndex], getRndInteger(4, 5));
  const t0= context.currentTime;
  t1= t0+Number(msRep/planetRatios[6]/1000/2);  
  t2= t1+Number(msRep/planetRatios[6]/1000/2);
  chordGain[0].gain.linearRampToValueAtTime(volumes[1], t1);
  chordGain[0].gain.linearRampToValueAtTime(0, t2);
}

function playChord2()
{
    chordGain[1].gain.value=0;
    chordOsc[1].frequency.value=getNoteFreq(chordNotes[2][chordNotesIndex], getRndInteger(4, 5));
    const t0= context.currentTime;
    t1= t0+Number(msRep/planetRatios[5]/1000/2);  
    t2= t1+Number(msRep/planetRatios[5]/1000/2);
    chordGain[1].gain.linearRampToValueAtTime(volumes[2], t1);
    chordGain[1].gain.linearRampToValueAtTime(0, t2);
}

function playChord3()
{
    chordGain[2].gain.value=0;
    chordOsc[2].frequency.value=getNoteFreq(chordNotes[1][chordNotesIndex], getRndInteger(4, 5));
    const t0= context.currentTime;
    t1= t0+Number(msRep/planetRatios[4]/1000/2);  
    t2= t1+Number(msRep/planetRatios[4]/1000/2);
    chordGain[2].gain.linearRampToValueAtTime(volumes[3], t1);
    chordGain[2].gain.linearRampToValueAtTime(0, t2);
}

function playChord4()
{
    chordGain[3].gain.value=0;
    chordOsc[3].frequency.value=getNoteFreq(chordNotes[0][chordNotesIndex], getRndInteger(4, 5));
    const t0= context.currentTime;
    t1= t0+Number(msRep/planetRatios[3]/1000/2);  
    t2= t1+Number(msRep/planetRatios[3]/1000/2);
    chordGain[3].gain.linearRampToValueAtTime(volumes[4], t1);
    chordGain[3].gain.linearRampToValueAtTime(0, t2);
}

function playLead()
{
  leadGain.gain.value=0;
  leadOsc.frequency.value = quant(leadNotes);
  const t0= context.currentTime;
  t1= t0+Number(msRep/planetRatios[2]/1000/4);  
  t2= t1+Number(msRep/planetRatios[2]/1000/4);
  leadGain.gain.linearRampToValueAtTime(volumes[5], t1);
  leadGain.gain.linearRampToValueAtTime(0, t2);
}

let arp1NotesIndex=0;
function playArp1(){
  arp1Gain.gain.value=0;
  arp1Osc.frequency.value = getNoteFreq(selectedMode[arp1NotesIndex], 5);
  if(arp1NotesIndex<selectedMode.length-1){arp1NotesIndex++;}
  else{arp1NotesIndex=0;}
  const t0= context.currentTime;
  t1= t0+Number(msRep/planetRatios[1]/1000/4);  
  t2= t1+Number(msRep/planetRatios[1]/1000/4);
  arp1Gain.gain.linearRampToValueAtTime(volumes[6], t1);
  arp1Gain.gain.linearRampToValueAtTime(0, t2);
}

let arp2NotesIndex=0;
function playArp2(){
  arp2Gain.gain.value=0;
  console.log(arp2NotesIndex);
  console.log(chordNotesIndex);
  console.log(chordNotes);
  console.log(chordNotes[arp2NotesIndex][chordNotesIndex]);
  arp2Osc.frequency.value=getNoteFreq(chordNotes[arp2NotesIndex][chordNotesIndex], 5);
  if(arp2NotesIndex<3){arp2NotesIndex++;}
  else{arp2NotesIndex=0;}
  const t0= context.currentTime;
  t1= t0+Number(msRep/planetRatios[0]/1000/4);  
  t2= t1+Number(msRep/planetRatios[0]/1000/4);
  arp2Gain.gain.linearRampToValueAtTime(volumes[7], t1);
  arp2Gain.gain.linearRampToValueAtTime(0, t2);
}

function planet(
  orbitWidth,
  orbitHeight,
  tilt,
  rotation,
  skin,
  diameter,
  modifier,
  movePlanet
) {
  push();

  //ELLIPSE
  rotateX(PI / 2);
  noFill();
  stroke(255, 160);
  strokeWeight(1);
  ellipse(0, 0, orbitWidth * 2, orbitHeight * 2, 50);
  rotateX(-PI / 2);

  //ROTATION
  //Tone.Transport.seconds  TRASCORRERE DEI SECONDI
  //Tone.Transport.bpm.value BPM
  //Tone.Transport.bpm.value/60/4 MEASURES PER SECOND (1n in Tone transport reference)
  //2*Math.PI


  revolutionRate = 2 * Math.PI *(context.currentTime/(msRep/modifier/1000));

  translate(
    sin(revolutionRate*movePlanet) * orbitWidth,
    0,
    cos(revolutionRate*movePlanet) * orbitHeight
  );
  rotateZ(tilt);
  rotateY(frameCount * rotation);

  //AXIS
  //fill(255);
  //stroke(255);
  //line(0, 400, 0, 0, -400,  0);

  //TEXTURE
  texture(skin);

  //COLORE ROSSO QUANDO PASSA PER L'AZIMUTH
  /* if(sin(revolutionRate)<=0.2 && sin(revolutionRate)>=-0.2 && cos(revolutionRate)>=0.8){
          emissiveMaterial(255, 50, 50);
          wobbleArray[modifier-1] = 1;
        }
        else{
          wobbleArray[modifier-1] = 0;
        } */
  noStroke();
  sphere(diameter);

  pop();
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let tri = {
  center: [0, 0, 0],
  distance: 600,
  rotation: [1, -0.3, 0, 0],
};

let bi = {
  center: [0, 0, 0],
  distance: 500,
  rotation: [0.2, -0.2, 0, 0],
};

// GUIDE TOUR

const tour = new Shepherd.Tour({
  useModalOverlay: true,
  defaultStepOptions: {
    classes: "shadow-md bg-purple-dark",
    scrollTo: false,
  },
});

// step #3
tour.addStep({
  id: "mixer",
  text: "mix the sounds here!",
  attachTo: {
    element: "#mixer",
    on: "right",
  },
  classes: "",
  buttons: [
    {
      text: "NEXT",
      action: tour.next,
    },
    {
      text: "EXIT",
      action: tour.complete,
      function() {
        localStorage.setItem("guideflag2", 0);
      },
    },
  ],
});

// step #4
tour.addStep({
  id: "step4",
  text: "extracted music parameters from the image",
  attachTo: {
    element: ".param2guide",
    on: "bottom",
  },
  classes: "",
  buttons: [
    {
      text: "NEXT",
      action: tour.next,
    },
    {
      text: "EXIT",
      action: tour.complete,
      function() {
        localStorage.setItem("guideflag2", 0);
      },
    },
  ],
});

// step #5
tour.addStep({
  id: "step5",
  text: "Click here to listen to sound",
  attachTo: {
    element: ".positionPlayStop",
    on: "left",
  },
  classes: "",
  buttons: [
    {
      text: "NEXT",
      action: tour.next,
    },
    {
      text: "EXIT",
      action: tour.complete,
      function() {
        localStorage.setItem("guideflag2", 0);
      },
    },
  ],
});

// step #6
tour.addStep({
  id: "2d",
  text: "Set 2d environment ",
  attachTo: {
    element: ".position2D",
    on: "left",
  },
  classes: "",
  buttons: [
    {
      text: "NEXT",
      action: tour.next,
    },
    {
      text: "EXIT",
      action: tour.complete,
      function() {
        localStorage.setItem("guideflag2", 0);
      },
    },
  ],
});

// step #7
tour.addStep({
  id: "3d",
  text: "Set 3d environment ",
  attachTo: {
    element: ".position3D",
    on: "bottom",
  },
  classes: "",
  buttons: [
    {
      text: "NEXT",
      action: tour.next,
    },
    {
      text: "EXIT",
      action: tour.complete,
    },
  ],
});

// step #8
tour.addStep({
  id: "3d",
  text: "Move in the 3D space using the mouse ",
  attachTo: {
    element: "",
    on: "",
  },
  classes: "",
  buttons: [
    {
      text: "EXIT",
      action: tour.complete,
    },
  ],
});
console.log(guideflag2);

if (guideflag2 == 1) {
  tour.start();
}
