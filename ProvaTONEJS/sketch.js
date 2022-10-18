console.clear();

const synth = new Tone.Synth();
synth.toDestination();

synth.triggerAttackRelease('C4', '4n');