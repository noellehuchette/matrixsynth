import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { start, Transport, Loop, Synth, Draw, Part, Reverb } from 'tone';
import { step, initialize, stop, play } from '../../store/sequencer';

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

// blank pattern
const initPattern = () => {
  return [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
};

// build synth instances
const buildSynths = () => {
  const synths = [];
  const reverb = new Reverb({ wet: 0.75 }).toDestination();
  for (let syn = 0; syn < 16; syn++) {
    synths[syn] = new Synth().connect(reverb);
  }
  return synths;
};

const Sequencer = (props) => {
  // load saved info
  let stored = window.localStorage.getItem('matrixpattern');
  const step = useSelector((state) => state.sequencer);

  // redux functions
  const dispatch = useDispatch();

  // state variables
  const [init, setInit] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [pattern, setPattern] = useState(
    stored ? JSON.parse(stored) : initPattern()
  );
  const [synths, setSynths] = useState(buildSynths());
  const [parts, setParts] = useState([]);
  const [tempo, setTempo] = useState(120);

  // page load
  useEffect(() => {
    dispatch(initialize());
    Transport.bpm.value = tempo;
  }, []);

  // play state change

  // pattern change

  // tempo change

  // app functions

  const initSeq = () => {
    const iniTone = true;
    Transport.loop = true;
    Transport.setLoopPoints(0, '1m');
    const tracking = new Loop((time) => {
      Draw.schedule(() => step(), time);
    }, '16n').start(0);
    setInit(true);
    dispatch(stop());
  };

  const setPart = (pattern) => {
    let { synths, parts } = this.state;
    parts.forEach((part) => part.dispose());
    parts = [];
    synths.forEach((synth, idx) => {
      let arrangement = [];
      pattern[idx].forEach((step, beat) => {
        if (step)
          arrangement.push({ time: { '16n': +beat }, note: notes[idx] });
      });
      parts.push(
        new Part((time, value) => {
          synth.triggerAttackRelease(value.note, '32n.', time);
        }, arrangement).start(0)
      );
    });
    this.setState({ parts });
    window.localStorage.setItem('matrixpattern', JSON.stringify(pattern));
  };

  return (
    <div className="sequencer-block">
      <div className="matrix">MS</div>
    </div>
  );
};

export default Sequencer;
