console.clear();

const synthFM = new Tone.AMSynth();
synthFM.toDestination();

const now = Tone.now()



function playSound(){
    const loop = new Tone.Loop(time => {
        synthFM.triggerAttackRelease("G4", "8n", time)
        synthFM.triggerAttackRelease("B4", "8n", time + 0.5)
        synthFM.triggerAttackRelease("E5", "8n", time + 1)
        synthFM.triggerAttackRelease("B4", "8n", time + 1.5)
    }, "n").start(0);
    Tone.Transport.start()
}
 


















