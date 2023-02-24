var k = localStorage.getItem("k");
var m = localStorage.getItem("m");
var p = localStorage.getItem("p");
var t = localStorage.getItem("t");


// DICHIARO LE VARIABILI FUORI DALLA FUNZIONI
// PERCHE' ABBIANO VISIBILITA' ANCHE NELLE ALTRE FUNZIONI
let imgEarth;
let imgSun;
let imgMoon;
var imgSky;
let imgPlanets = [];
let sunDim = 200; 
//let planetOrbWidth = [170, 300, 500, 800, 1050, 1300, 1600, 1900];
let planetOrbHeight = [sunDim+57, 50+sunDim+108, 150+sunDim+149, 180+sunDim+227, sunDim+588, sunDim+866.5, sunDim+1166, sunDim+1366];
let planetOrbWidth = planetOrbHeight.map(x => x * 1.5);
let planetTilt = [0, 0, -25, 0, 0, 0, 0, 0];
let planetRotation = [0.005, 0.01, 0.015, 0.020, 0.025 , 0.030 , 0.035 , 0.040]; 
let planetDiameter = [24, 50 , 63, 33, 140, 116, 50, 48];
let bool = false;
let easycam;

//SOUND VARIABLES
let reverb, pingpong;
let playIsOff=true;
let bpm = 20;
//1= MEASURE, 4=BEAT
//---------arp1,arp2,lead,chord4,chord3,chord2,chord1,bass--------------------------------------
let planetRatios = [32, 24, 2, 5, 4, 3, 2, 1];

let chromas=["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

let myScale=[];
let majProf = [0, 2, 4, 5, 7, 9, 11];
let minProf = [0, 2, 3, 5, 7, 8, 10];
let maj = Boolean(parseInt(m));
console.log(maj);
let profile = [];
let key = parseInt(k);

for(i =0; i<7; i++){
  if(maj){
    profile = majProf;
  }
  else{
    profile = minProf; 
  }
  myScale[i]=chromas[key+profile[i]];
} 

console.log(myScale);

let tetrad = [1, 3, 5, 7];

let progression1 = [1, 5, 6, 4];
let progression2 = [1, 4, 2, 5];
let progression3 = [1, 4, 6, 5];
let progression4 = [1, 6, 4];
let progression5 = [1, 5];

let selectedProgression;

//IMAGE PROCESSING
let mean;
let maximum;
let selectedMode = myScale;//-------------------------------------------------------------------------------------------------------------------

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
let bassEnvelope, bassFilter, bassSynth1, bassSynth2, bassLoop;
let bassNotes=[];
for(i=0; i<selectedProgression.length; i++){
  bassNotes[i]=selectedMode[selectedProgression[i]-1];
}

//CHORD
let chordSynths=[];
let chordFilters=[];
let chordEnvelopes=[];
let chordLoops=[];
let chordNotes=[];
for(i = 0; i < 4; i++) {
  chordNotes[i] = [];
  for(j = 0; j < selectedProgression.length; j++){
    if (selectedProgression[j] - 1 + (tetrad[i] - 1) < selectedMode.length) {
      chordNotes[i][j] = selectedMode[selectedProgression[j] - 1 + (tetrad[i] - 1)];
    }
    else {
      chordNotes[i][j] = selectedMode[selectedProgression[j] - 1 + (tetrad[i] - 1) - 7];
    }
  }
}
//LEAD
let leadEnvelope, leadFilter, leadSynth, leadLoop;
let leadNotes=[];
for(i=0; i<selectedProgression.length; i++){
  leadNotes[i]=selectedMode[selectedProgression[i]-1];
}
//ARP1
let arp1Envelope, arp1Filter, arp1Synth, arp1Loop;
//ARP2
let arp2Envelope, arp2Filter, arp2Synth, arp2Loop;

//Planets menus
let tendina = [];
let slidVol = [];
let volumes = [-32, -36, -16, -24, -24, -24, -24, -16];
let lista = ["1", "4", "16", "32"];
let refreshed = false;
let idVol = ["instr1", "instr2", "instr3", "instr4", "instr5", "instr6", "instr7", "instr8"];

/* //SOUNDLINE WOBBLING
let lineWobble = 0;
let wobbleArray = []; */

function preload() {

  imgEarth = loadImage('Images/plani.jpg');
  imgSun = loadImage('Images/sun.jpg');
  imgMoon = loadImage('Images/moon.jpg');
  
  environmentSelectedImg=loadImage(localStorage.getItem("environment"))

  for(i=0; i<8; i++){
    imgPlanets[i] = loadImage('Images/' + (i+1).toString(10) + '.jpg');
  }

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    easycam.setViewport([0,0,windowWidth, windowHeight]); // adattamento viewport nel caso 
                                                          // di resizing per la easycam
}

  
function setup() {
  
    //CANVAS AND EASY CAM-------------------------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------------------------------------------
    createCanvas(windowWidth, windowHeight, WEBGL);
    easycam = createEasyCam() // creazione oggetto easycam con distanza iniziale 
    easycam.setState(tri);    // stato iniziale prospettico
    easycam.setDistanceMax(2900);
    easycam.setDistanceMin(200);
    soundDesign();
    
    frameRate(60);
    setAttributes('antialias', true);
    perspective(PI / 2, width / height, 0.1, 15000);
    textureWrap(CLAMP);
  
    button1 = createButton('2D');     // creazione bottoni per switching 2D/3D
    button1.position(windowWidth-100, 120);
    button1.addClass("home-btn");
    
    button2 = createButton('3D');
    button2.position(windowWidth-100, 185);
    button2.addClass("home-btn");
  
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
    button3.addClass("home-btn")
    button3.mouseClicked( function() {
      if(playIsOff){
        playIsOff=false;
        button3.html("Stop");
        refreshVolumes();
      } 
      else{
      playIsOff=true;
      button3.html("Play");
      }
    });



    //RATIO SELECTORS
    for(i=0; i<8; i++){ 
      tendina[i] = createSelect();
      tendina[i].position(30, 80 + i*60);
      for(let j= 0; j< lista.length; j++){
        tendina[i].option(lista[j]);
        }
      tendina[i].addClass("home-btn");
      tendina[i].addClass("hide");
      tendina[i].style('height', '3vw');
      tendina[i].style('width', '3vw');
      tendina[i].changed(changeRatio);
    }

    //VOLUME SLIDERS
    for(i=0; i<8; i++){ 
      slidVol[i] = createSlider(-100, -16, volumes[i], 1);

      slidVol[i].position(80, 510 - i*60);
      slidVol[i].addClass("slider");
      slidVol[i].addClass("hide");
      slidVol[i].addClass("volume");
      slidVol[i].id(idVol[7-i]);
      slidVol[i].style('height', '3vw');
      slidVol[i].style('width', '8vw');
      //slidVol[i].style('background-color', '#000000');

      slidVol[i].changed(changeVolume);
    }

    //MENU
    menuButton = createButton('Menu');
    let hiddenMenu = true;
    menuButton.position(20, 20);
    menuButton.addClass("home-btn")
    menuButton.style('height', '3vw');
    menuButton.style('width', '6vw');
    menuButton.mouseClicked( function() {
      if(hiddenMenu){
        hiddenMenu = false;
        menuButton.html("Hide");
        for(i=0; i<8; i++){ 
          tendina[i].addClass("show");
          slidVol[i].addClass("show");
          tendina[i].removeClass("hide");
          slidVol[i].removeClass("hide");
        }
      } 
      else{
        hiddenMenu = true;
        menuButton.html("Menu");
        for(i=0; i<8; i++){ 
          tendina[i].addClass("hide");
          slidVol[i].addClass("hide");
          tendina[i].removeClass("show");
          slidVol[i].removeClass("show");
        }
      }
    });
    
  }


  function changeRatio(){
    console.log('Ratios');
    for(i=0; i<8; i++){ 
      planetRatios[i] = tendina[i].value();
      console.log(planetRatios[i]);
    }
    soundDesign();
  }
  
  function refreshVolumes(){
    console.log('Refreshed');
    bassSynth1.volume.value=volumes[0];
    bassSynth2.volume.value=volumes[0];
    bassSynth3.volume.value=volumes[0];
    for (j=0; j<4; j++){
    chordSynths[j].volume.value=volumes[j+1];
    }
    leadSynth.volume.value=volumes[5];
    arp1Synth.volume.value=volumes[6];
    arp2Synth.volume.value=volumes[7];
  }
  
  function changeVolume(){
    console.log('Volumes');
    for(i=0; i<8; i++){ 
      volumes[i] = slidVol[i].value();
      console.log(volumes[i]);
    }
    refreshVolumes();
  }


  function draw() {
  
      //BACKGROUND
      background(0,0,0,0);
  
      //muro invisibile per limiti della sfera
      let currentDist = Math.sqrt((easycam.getPosition()[0])**2+ (easycam.getPosition()[1])**2+ (easycam.getPosition()[2])**2);
      
      if (currentDist>3000.0) {
        easycam.setState(tri, 400);
      }      
  
      // SKYBOX
      push();
      noStroke();
      texture(environmentSelectedImg);
      rotateY(frameCount * 0.0005);
      sphere(4000);
      pop();
  
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
      for(i=0; i<8; i++){
        planet(planetOrbWidth[i], planetOrbHeight[i], planetTilt[i], planetRotation[i], imgPlanets[i], planetDiameter[i], planetRatios[i]);
        /* if(i==2){   //MOON
          push();
          translate(-sin(2*Math.PI*(((Tone.Transport.seconds)*(Tone.Transport.bpm.value/60/4))*planetRatios[2])+PI)*500, 0, -[cos(2*Math.PI*(((Tone.Transport.seconds)*(Tone.Transport.bpm.value/60/4))*planetRatios[2])+PI)*333]);
          rotateY(-frameCount * 0.015);
          planet(100, 100, 0, 0.005, imgMoon, 15, 6);
          pop();
        } */
        
        //---------------------------------------------------------MIXER--------------------------------------------------------------------------
        if(!playIsOff){
          Tone.Transport.start();
          //refreshVolumes();
          //refreshed = true;          
        }
        else{
          Tone.Transport.pause();
          bassSynth1.volume.value=-100;
          bassSynth2.volume.value=-100;
          bassSynth3.volume.value=-100;
          for (j=0; j<4; j++){
            chordSynths[j].volume.value=-100;
          }
          leadSynth.volume.value=-100;
          arp1Synth.volume.value=-100;
          arp2Synth.volume.value=-100;
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

      text("red", slidVol[1].x + slidVol[1].width);
      //text("green", gSlider.x * 2 + gSlider.width, 65);
      //text("blue", bSlider.x * 2 + bSlider.width, 95);


      
}


function soundDesign(){

    let bassNotesIndex=0;
    let chordNotesIndex=0;
    let leadNotesIndex=0;
    let arp1NotesIndex=0;
    let arp2NotesIndex=0;
    
      reverb = new Tone.Reverb({
        decay: 10,
        wet: 0.8,
      });
      
      pingpong = new Tone.PingPongDelay({
        delayTime: 0.4, 
        feedback: 0.5, 
        wet: 0.7});
      
    
    //BASSO
        bassFilter = new Tone.Filter(400, "lowpass");
    
        bassEnvelope = new Tone.FrequencyEnvelope({
          attack: (planetRatios[7]*4).toString()+"n",
          decay: (planetRatios[7]*2).toString()+"n",
              sustain: 0,
              release: 0,
              baseFrequency: "C0",
              octaves: 5,
              attackCurve: "sine",
        });
    
        bassEnvelope.connect(bassFilter.frequency);
    
        bassSynth1 = new Tone.Synth({oscillator: {type : "sawtooth", detune: "-10"}});
        bassSynth2 = new Tone.Synth({oscillator: {type : "sawtooth", detune: "10"}});
        bassSynth3 = new Tone.Synth({oscillator: {type : "fmsine"}});
        bassSynth1.chain(bassFilter, reverb, Tone.Destination);
        bassSynth2.chain(bassFilter, reverb, Tone.Destination);
        bassSynth3.chain(bassFilter, reverb, Tone.Destination);
        bassSynth1.volume.value=-100;
        bassSynth2.volume.value=-100;
        bassSynth3.volume.value=-100;
    
        bassLoop = new Tone.Loop(time => {
          bassSynth1.triggerAttackRelease(bassNotes[bassNotesIndex]+"1", planetRatios[7].toString()+"n", time);
          bassSynth2.triggerAttackRelease(bassNotes[bassNotesIndex]+"1", planetRatios[7].toString()+"n", time);
          bassSynth3.triggerAttackRelease(bassNotes[bassNotesIndex]+"1", planetRatios[7].toString()+"n", time);
          if (bassNotesIndex == bassNotes.length - 1) { bassNotesIndex = 0; chordNotesIndex = 0; }
          else{bassNotesIndex++; chordNotesIndex++;}
          bassEnvelope.triggerAttackRelease(planetRatios[7].toString()+"n", time);
          console.log(chordNotes);
        }, planetRatios[7].toString()+"n").start(0);
    
    
    //TETRADE CHORDS (ASYNC?)
    for(i=0; i<4; i++){
    
      chordFilters[i] = new Tone.Filter(400, "lowpass");
    
      for (j=6; j>2; j--)
      {
        chordEnvelopes[i] = new Tone.FrequencyEnvelope({
          attack: (planetRatios[j]*2).toString()+"n",
          decay: (planetRatios[j]*4).toString()+"n",
              sustain: 0,
              release: 0,
              baseFrequency: "C0",
              octaves: 5,
              attackCurve: "sine",
        });
      }
      chordEnvelopes[i].connect(chordFilters[i].frequency);
    
      chordSynths[i] = new Tone.Synth({oscillator: {type : "fmsine"}});
      chordSynths[i].chain(chordFilters[i], reverb, Tone.Destination);
      chordSynths[i].volume.value=-100;
    }

    if (Boolean(t)) {
      chordLoops[0] = new Tone.Loop(time => {
        chordSynths[0].triggerAttackRelease(chordNotes[3][chordNotesIndex]+"3", planetRatios[6].toString()+"n", time);
        chordEnvelopes[0].triggerAttackRelease(planetRatios[6].toString()+"n", time);
      }, planetRatios[6].toString()+"n").start(0);
    }
    else{
      chordLoops[0] = new Tone.Loop(time => {
        chordSynths[0].triggerAttackRelease(chordNotes[0][chordNotesIndex]+"4", planetRatios[6].toString()+"n", time);
        chordEnvelopes[0].triggerAttackRelease(planetRatios[6].toString()+"n", time);
      }, planetRatios[6].toString()+"n").start(0);      
    }
    
    chordLoops[1]= new Tone.Loop(time => {
      chordSynths[1].triggerAttackRelease(chordNotes[2][chordNotesIndex]+"3", planetRatios[5].toString()+"n", time);
      chordEnvelopes[1].triggerAttackRelease(planetRatios[5].toString()+"n", time);
    }, planetRatios[5].toString()+"n").start(0);
    
    chordLoops[2]= new Tone.Loop(time => {
      chordSynths[2].triggerAttackRelease(chordNotes[1][chordNotesIndex]+"3", planetRatios[4].toString()+"n", time);
      chordEnvelopes[2].triggerAttackRelease(planetRatios[4].toString()+"n", time);
    }, planetRatios[4].toString()+"n").start(0);
    
    chordLoops[3]= new Tone.Loop(time => {
      chordSynths[3].triggerAttackRelease(chordNotes[0][chordNotesIndex]+"3", planetRatios[3].toString()+"n", time);
      chordEnvelopes[3].triggerAttackRelease(planetRatios[3].toString()+"n", time);
    }, planetRatios[3].toString()+"n").start(0);
    
    //LEAD
    leadFilter = new Tone.Filter(400, "lowpass");
    
        leadEnvelope = new Tone.FrequencyEnvelope({
          attack: (planetRatios[2]*2).toString()+"n",
          decay: (planetRatios[2]*4).toString()+"n",
              sustain: 0,
              release: 0,
              baseFrequency: "C0",
              octaves: 5,
              attackCurve: "sine",
        });
    
    
        leadEnvelope.connect(leadFilter.frequency);
    
        leadSynth = new Tone.Synth({oscillator: {type : "fmsine"}});
        leadSynth.chain(leadFilter, reverb, pingpong, Tone.Destination);
        leadSynth.volume.value=-100;
    
        leadLoop = new Tone.Loop(time => {
          leadSynth.triggerAttackRelease(leadNotes[leadNotesIndex]+"4", planetRatios[2].toString()+"n", time);
          if (leadNotesIndex==leadNotes.length-1){leadNotesIndex=0;}
          else{leadNotesIndex++;}
          leadEnvelope.triggerAttackRelease(planetRatios[2].toString()+"n", time);
        }, planetRatios[2].toString()+"n").start(0);
    
    //DRY ARPEGGIATOR
    arp1Filter = new Tone.Filter(400, "lowpass");
    
        arp1Envelope = new Tone.FrequencyEnvelope({
          attack: (planetRatios[1]*8).toString()+"n",
          decay: (planetRatios[1]*4).toString()+"n",
              sustain: 0,
              release: 0,
              baseFrequency: "C0",
              octaves: 7,
              attackCurve: "sine",
        });
    
    
        arp1Envelope.connect(arp1Filter.frequency);
    
        arp1Synth = new Tone.Synth({oscillator: {type : "fmsine"}});
        arp1Synth.chain(arp1Filter, reverb, Tone.Destination);
        arp1Synth.volume.value=-100;
    
        arp1Loop = new Tone.Loop(time => {
          arp1Synth.triggerAttackRelease(chordNotes[arp1NotesIndex][chordNotesIndex]+"4", planetRatios[1].toString()+"n", time);
          if (arp1NotesIndex==2){arp1NotesIndex=0;}
          else{arp1NotesIndex++;}
          arp1Envelope.triggerAttackRelease(planetRatios[1].toString()+"n", time);
        }, planetRatios[1].toString()+"n").start(0);
    
    //WET ARPEGGIATOR
    arp2Filter = new Tone.Filter(400, "lowpass");
    
        arp2Envelope = new Tone.FrequencyEnvelope({
          attack: (planetRatios[0]*8).toString()+"n",
          decay: (planetRatios[0]*4).toString()+"n",
              sustain: 0,
              release: 0,
              baseFrequency: "C0",
              octaves: 7,
              attackCurve: "sine",
        });
    
    
        arp2Envelope.connect(arp2Filter.frequency);
    
        arp2Synth = new Tone.Synth({oscillator: {type : "fmsine"}});
        arp2Synth.chain(arp2Filter, reverb, Tone.Destination);
        arp2Synth.volume.value=-100;
    
        arp2Loop = new Tone.Loop(time => {
          arp2Synth.triggerAttackRelease(chordNotes[arp2NotesIndex][chordNotesIndex]+"4", planetRatios[0].toString()+"n", time);
          if (arp2NotesIndex==2){arp2NotesIndex=0;}
          else{arp2NotesIndex++;}
          arp2Envelope.triggerAttackRelease(planetRatios[0].toString()+"n", time);
        }, planetRatios[0].toString()+"n").start(0);
    
    
    
      //Tone.Transport.start();
      Tone.Transport.bpm.value=bpm;
}
    
    
function planet(orbitWidth, orbitHeight, tilt, rotation, skin, diameter, modifier){
     push();
    
     //ELLIPSE
        rotateX(PI/2);
        noFill();
        stroke(255, 160); 
        strokeWeight(1);
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
      return Math.floor(Math.random() * (max - min + 1) ) + min;
}
    
    
    let tri = {
      center: [0, 0, 0],
      distance: 2400,
      rotation: [1,-0.3 , 0, 0],
    }
    
    
    let bi = {
      center: [0, 0, 0],
      distance: 2000,
      rotation: [0.2, -0.2, 0, 0],
    }