console.clear();

const synth = new Tone.Synth();
synth.toDestination();

function playSound(){
    synth.triggerAttackRelease('C4', '4n');
}
 






















