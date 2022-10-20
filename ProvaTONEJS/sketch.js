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
















