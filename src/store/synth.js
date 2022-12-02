import * as Tone from 'tone';

// sequencer scale
const notes = [
  'D5',
  'C5',
  'A4',
  'G4',
  'F4',
  'D4',
  'C4',
  'A3',
  'G3',
  'F3',
  'D3',
  'C3',
  'A2',
  'G2',
  'F2',
  'D2'
];

const INITIALIZE = 'INITIALIZE';
const CHANGE_OSC = 'CHANGE_OSC';
const CHANGE_FILTER = 'CHANGE_FILTER';
const CHANGE_AMP = 'CHANGE_AMP';

export const changeOsc = (osc) => ({
  type: CHANGE_OSC,
  osc
});

export const changeFilter = (filter, rolloff, cutoff) => ({
  type: CHANGE_FILTER,
  filter,
  rolloff,
  cutoff
});

export const changeAmp = (atk, dcy, sus, rel) => ({
  type: CHANGE_AMP,
  atk,
  dcy,
  sus,
  rel
});

const buildSynths = () => {
  const oscillators = [];
  const filters = [];
  const amplifiers = [];
  const synths = [];

  const reverb = new Tone.Reverb({
    wet: 0.5,
    decay: 1
  }).toDestination();
  for (let syn = 0; syn < 16; syn++) {
    // synths[syn] = new Tone.Synth().connect(reverb);
    amplifiers[syn] = new Tone.AmplitudeEnvelope({
      attack: 0.01,
      decay: 0.1,
      sustain: 0.3,
      release: 0.7
    }).connect(reverb);
    filters[syn] = new Tone.Filter({
      Q: 0,
      frequency: 2500,
      type: 'lowpass',
      rolloff: -12
    }).connect(amplifiers[syn]);
    oscillators[syn] = new Tone.OmniOscillator(
      notes[syn],
      'fatsawtooth'
    ).connect(filters[syn]);
    synths.push({
      osc: oscillators[syn],
      fil: filters[syn],
      amp: amplifiers[syn]
    });
  }
  return synths;
};

const synthesizer = (state = buildSynths(), action) => {
  switch (action.type) {
    case INITIALIZE:
      state.forEach((synth) => {
        synth.osc.start();
      });
      return state;
    case CHANGE_OSC:
      state.forEach((synth) => {
        synth.osc.set({
          type: action.osc
        });
      });
      return state;
    case CHANGE_FILTER:
      state.forEach((synth) => {
        synth.fil.set({
          type: action.filter,
          rolloff: action.rolloff,
          frequency: action.cutoff
        });
      });
      return state;
    case CHANGE_AMP:
      state.forEach((synth) => {
        synth.amp.set({
          attack: action.atk,
          decay: action.dcy,
          sustain: action.sus,
          release: action.rel
        });
      });
    default:
      return state;
  }
};

export default synthesizer;
