import * as Tone from './Tone/Tone.js'
// è solo una prova di come fare a separare i file m non fa nulla per ora 


export default class Planet{

  constructor(orbitWidth, orbitHeight, tilt, rotation, skin, diameter, modifier, wobbleArray){
    this.orbitWidth = orbitWidth;
    this.orbitHeight = orbitHeight;
    this.tilt = tilt;
    this.rotation = rotation;
    this.skin = skin;
    this.diameter = diameter;
    this.modifier = modifier;
    this.wobbleArray = wobbleArray;
  }
    
  drawOrbit(){
    rotateX(PI/2);
    noFill();
    stroke(255); 
    strokeWeight(2);
    ellipse(0, 0, orbitWidth*2, orbitHeight*2, 50);
    rotateX(-PI/2);
  }

  revolveAndRotate(){
    var revolutionRate = (2*(Math.PI)*(((Tone.Transport.seconds)*(Tone.Transport.bpm.value/60/4))*modifier));
    console.log(Tone.Clock.seconds);
    translate(sin(revolutionRate)*orbitWidth, 0, cos(revolutionRate)*orbitHeight);
    rotateZ(tilt);
    rotateY(frameCount * rotation);
  }

  drawPlanet(){
     //TEXTURE
     texture(skin);
     //COLORE ROSSO QUANDO PASSA PER L'AZIMUTH
     if(sin(revolutionRate)<=0.2 && sin(revolutionRate)>=-0.2 && cos(revolutionRate)>=0.8){
       emissiveMaterial(255, 50, 50);
       this.wobbleArray[modifier-1] = 1;
     }
     else{
       this.wobbleArray[modifier-1] = 0;
     }
     noStroke();
     sphere(diameter);
  }

  getWobbleArray(){
    return this.wobbleArray;
  }


}