console.clear();

const synthFM = new Tone.NoiseSynth();
synthFM.toDestination();

const now = Tone.now();

var melody = ["G4", "E4", "B5"];
var rhythm = ["4n", "4n", "4n"];

var arpeggio = mergeDurationsAndPitch(rhythm, melody);


function playSound(){
    const loop = new Tone.Loop(time => {
        var part = new Tone.Part(
            function(time, value){
                synthFM.triggerAttackRelease(value.note, value.duration, time);
            }, arpeggio).start(0);
    }, "2n + 4n").start(0);
    Tone.Transport.start();
}
 

function playSo(){
    var part = new Tone.Part(
        function(time, value){
            synthFM.triggerAttackRelease(value.note, value.duration, time);
        }, arpeggio).start(0);
}



const chordSynth = new Tone.PolySynth().toDestination();
// set the attributes across all the voices using 'set'
chordSynth.set({ detune: -1200 });

var tonic = 'C4';
var chord = [];

function buildMajorChord(tonic){
    console.log(tonic);
    let notes = ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5'];
    let t = notes.indexOf(tonic);
    chord = [notes[t], notes[t+3], notes[t+7]];
    return chord;
}


function playChord(tonic){
    let chord = buildMajorChord(tonic);
    const chordSynth = new Tone.PolySynth().toDestination();
    // set the attributes across all the voices using 'set'
    chordSynth.set({ detune: -1200 });
    // play a chord
    chordSynth.triggerAttackRelease(chord, 1);
}








