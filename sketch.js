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
let easycam; 
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
//SOUNDPAGE CONTROLS
let soundPageChosenEnvButton;
let soundPageModalScaleSelector;
let soundPageWaveformSelector;
let soundPageParam2;
let soundPageParam3;
let soundPageParam4;
let soundPageParam5;
let soundPageGoToDrumMachine;
//SOUND VARIABLES
let reverb, pingpong;
let playIsOff=true;
let bpm = 20;
//1= MEASURE, 4=BEAT
//---------arp1,arp2,lead,chord4,chord3,chord2,chord1,bass--------------------------------------
let planetRatios = [32, 24, 2, 5, 4, 3, 2, 1];
let MAJOR=["C", "D", "E", "F", "G", "A", "B"]; //Cmajor
let MINOR=["B", "C#", "D", "E", "F#", "G", "A"]; //Bminor
let tetrad=[1, 3, 5, 8];
let progression1=[1, 5, 6, 4];
let progression2=[1, 4, 2, 5];
let progression3=[1, 4, 6, 5];
let progression4=[1, 6, 4];
let progression5=[1, 5];
//IMAGE PROCESSING
let mean;
let maximum;
let selectedMode = MAJOR;//-------------------------------------------------------------------------------------------------------------------
let selectedProgression = progression1;//-----------------------------------------------------------------------------------------------------
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
for(i=0; i<4; i++){
  chordNotes[i]=[];
  for(j=0; j<selectedProgression.length; j++){
    if(selectedProgression[j]-1+(tetrad[i]-1)<selectedMode.length){
      chordNotes[i][j]=selectedMode[selectedProgression[j]-1+(tetrad[i]-1)];
    }
    else{
      chordNotes[i][j]=selectedMode[selectedProgression[j]-1+(tetrad[i]-1)-7];
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
//SOUNDLINE WOBBLING
let lineWobble = 0;
let wobbleArray = [];






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
  soundPageModalScaleSelector.position(windowWidth-350, 100);

  soundPageWaveformSelector=createSelect();
  soundPageWaveformSelector.option('SINE');
  soundPageWaveformSelector.option('FMSINE');
  soundPageWaveformSelector.option('SAWTOOTH');
  soundPageWaveformSelector.option('TRIANGLE');
  soundPageWaveformSelector.option('SQUARE');
  soundPageWaveformSelector.option('PWM');
  soundPageWaveformSelector.option('PULSE');
  soundPageWaveformSelector.position(windowWidth-350, 150);

  soundPageParam2=createSlider(1, 10, 5, 1);
  soundPageParam2.position(windowWidth-450, 200);
  soundPageParam2.addClass("mySliders");
  soundPageParam2.addClass("delayTime-caption");

  soundPageParam3=createSlider(1, 10, 5, 1);
  soundPageParam3.position(windowWidth-450, 270);
  soundPageParam3.addClass("mySliders");
  soundPageParam3.addClass("delayAmount-caption");
  
  soundPageParam4=createSlider(1, 10, 5, 1);
  soundPageParam4.position(windowWidth-450, 340);
  soundPageParam4.addClass("mySliders");
  soundPageParam4.addClass("reverbAmount-caption");
  
  soundPageParam5=createSlider(1, 10, 5, 1);
  soundPageParam5.position(windowWidth-450, 410);
  soundPageParam5.addClass("mySliders");
  soundPageParam5.addClass("chordProgression-caption");
  
  soundPageGoToDrumMachine = createButton('DRUM MACHINE');
  soundPageGoToDrumMachine.position(windowWidth-420, 480);
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
    rotateY(frameCount * 0.0005);
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
    sphere(70); 
    rotateY(-frameCount * 0.005);
    rotateY(-PI);

    //LIGHT
    ambientLight(60);
    pointLight(255, 255, 255, 0, 0, 0);


    //--------------------------------------------------SET NUM PLANETS DEACTIVATED FOR SOUND DESIGN PURPOSES--------------------------------------------
    
    //CONTROLS AND DRAW PLANETS
    let val = setNumPlanets.value();    
    for(i=0; i<7; i++){
      planet(planetOrbWidth[i], planetOrbHeight[i], planetTilt[i], planetRotation[i], imgPlanets[i], planetDiameter[i], planetRatios[i]);
      if(i==2){   //MOON
        push();
        translate(-sin(2*Math.PI*(((Tone.Transport.seconds)*(Tone.Transport.bpm.value/60/4))*planetRatios[2])+PI)*500, 0, -[cos(2*Math.PI*(((Tone.Transport.seconds)*(Tone.Transport.bpm.value/60/4))*planetRatios[2])+PI)*333]);
        rotateY(-frameCount * 0.015);
        planet(100, 100, 0, 0.005, imgMoon, 15, 6);
        pop();
      }
      
      //---------------------------------------------------------MIXER--------------------------------------------------------------------------
      if(!playIsOff){
        bassSynth1.volume.value=-16;
        bassSynth2.volume.value=-16;
        bassSynth3.volume.value=-16;
        for (j=0; j<4; j++){
        chordSynths[j].volume.value=-24;
        }
        leadSynth.volume.value=-16;
        arp1Synth.volume.value=-36;
        arp2Synth.volume.value=-32;
      }
      else{
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

    setBPM.changed(function(){
      Tone.Transport.bpm.value=setBPM.value();
      Tone.Transport.stop();
      Tone.Transport.start();
    });
  }
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
      if (bassNotesIndex==bassNotes.length-1){bassNotesIndex=0; chordNotesIndex=0;}
      else{bassNotesIndex++; chordNotesIndex++;}
      bassEnvelope.triggerAttackRelease(planetRatios[7].toString()+"n", time);
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

chordLoops[0] = new Tone.Loop(time => {
  chordSynths[0].triggerAttackRelease(chordNotes[3][chordNotesIndex]+"3", planetRatios[6].toString()+"n", time);
  chordEnvelopes[0].triggerAttackRelease(planetRatios[6].toString()+"n", time);
}, planetRatios[6].toString()+"n").start(0);

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
  distance: 1800,
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