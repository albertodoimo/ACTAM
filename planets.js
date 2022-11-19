//import * as Tone from 'tone'
// è solo una prova di come fare a separare i file m non fa nulla per ora 


module.exports = class planets{

  constructor(orbitWidth, orbitHeight, tilt, rotation, skin, diameter, modifier){
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
      /*fill(255);
      stroke(255); 
      line(0, 400, 0, 0, -400,  0); */ 

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

}