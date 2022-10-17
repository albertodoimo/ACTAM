//DICHIARO LE IMMAGINI FUORI DALLA FUNZIONE
//PERCHE' ABBIANO VISIBILITA' ANCHE NELLE ALTRE FUNZIONI
let imgEarth;
let imgBackground;
let human;
let satellite;
let song;

//CARICO LE IMMAGINI
function preload() {
  imgEarth = loadImage('./plani.jpg');
  //SI PUO' FARE background(image) 
  //MA NON FUNZIONA, MAGARI PERCHE' SIAMO IN 3D
  imgBackground = loadImage('./bg.jpg');
  //IMPORTARE MODELLI 3D
  human = loadModel('./FinalBaseMesh.obj');
  satellite= loadModel('./satellite_obj.obj');
}



function setup() {
  createCanvas(1600, 720, WEBGL);
  textureWrap(CLAMP);
  //CAMERA
  video=createCapture(VIDEO);
  //FILE AUDIO
  song=createAudio('./song.mp3', play);
}

function play(){
  song.play();
}

function draw() {

//CAMERA
camera([0], [-1800], [3000], [0], [0], [0]);

//BACKGROUND
background(2);
orbitControl();

//STARS
fill(255);
stroke(255); 
for(i=0; i<100; i++)
{
  point(random()*50000-10000, random()*40000-10000);
}

//ELLIPSE
rotateX(PI/2);
noFill();
stroke(255); 
strokeWeight(5);
ellipse(0, 0, 2400, 1200, 50);
rotateX(-PI/2);

//SUN
noStroke();
rotateY(PI);
rotateY(frameCount * 0.005);
texture(video);
sphere(500);
rotateY(-frameCount * 0.005);
rotateY(-PI);

//LIGHT
ambientLight(60);
pointLight(255, 255, 255, 0, 0, 0);

//ROTATION
translate(sin(frameCount*0.01)*1200, 0, [cos(frameCount*0.01)*600]);
rotateZ(-25);
rotateY(frameCount * 0.01);

//AXIS
fill(255);
stroke(255); 
line(0, 400, 0, 0, -400,  0);

//EARTH
texture(imgEarth);
noStroke();
sphere(200);

//HUMAN
rotateZ(PI);
translate(0, 180, 0);
normalMaterial();
scale(50);
model(human);
rotateZ(-PI);

//SATELLITE
rotateZ(PI);
translate(sin(frameCount*0.01)*10, 0, [cos(frameCount*0.01)*10]);
rotateY(sin(frameCount*0.01)*10);
normalMaterial();
scale(1/3);
model(satellite);
rotateZ(-PI);

}


