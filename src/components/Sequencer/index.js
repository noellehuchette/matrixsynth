import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { start, Transport, Loop, Synth, Draw, Part, Reverb } from 'tone';
import { step, initialize, stop, play } from '../../store/sequencer';
import './style.css';

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
    // synths[syn] = new Synth().toDestination();
    synths[syn] = new Synth().connect(reverb);
  }
  return synths;
};

Transport.loop = true;
Transport.setLoopPoints(0, '1m');
const synths = buildSynths();

const Sequencer = () => {
  // load saved info
  let storedPattern = window.localStorage.getItem('matrixpattern');
  let storedTempo = window.localStorage.getItem('tempo');

  // redux connectivity
  const seqStep = useSelector((state) => state.sequencer);
  const dispatch = useDispatch();

  // build synths
  // const synths = useRef(buildSynths());

  // state variables
  const [init, setInit] = useState(false);
  const [playing, setPlaying] = useState(false);
  let [pattern, setPattern] = useState(
    storedPattern ? JSON.parse(storedPattern) : initPattern()
  );

  let [parts, setParts] = useState([]);
  const [tempo, setTempo] = useState(storedTempo ? +storedTempo : 120);

  if (!playing && seqStep > -1) {
    dispatch(stop());
  }

  // pattern change
  useEffect(() => {
    parts.forEach((part) => {
      part.dispose();
    });
    synths.forEach((synth, idx) => {
      let arrangement = [];
      pattern[idx].forEach((step, beat) => {
        if (step) {
          arrangement.push({ time: { '16n': +beat }, note: notes[idx] });
        }
      });
      parts.push(
        new Part((time, value) => {
          synth.triggerAttackRelease(value.note, '32n.', time);
        }, arrangement).start(0)
      );
    });
    setParts(parts);
    window.localStorage.setItem('matrixpattern', JSON.stringify(pattern));
  }, [pattern]);

  // tempo change
  useEffect(() => {
    Transport.bpm.value = tempo;
    window.localStorage.setItem('tempo', tempo);
  }, [tempo]);

  // app functions

  const initSeq = () => {
    dispatch(initialize());
    start();
    const tracking = new Loop((time) => {
      Draw.schedule(() => dispatch(step()), time);
    }, '16n').start(0);
    setInit(true);
    dispatch(stop());
  };

  const toggleTransport = () => {
    if (playing) {
      setPlaying(false);
      dispatch(stop());
    } else {
      setPlaying(true);
      dispatch(play());
    }
  };

  const toggleSquare = (x, y) => {
    pattern[y][x] = +!pattern[y][x];
    setPattern(
      pattern.map((row) => {
        return [...row];
      })
    );
  };

  const clearPattern = () => {
    setPattern(initPattern());
  };

  const tempoAdjust = (e) => {
    setTempo(e.target.value);
  };

  return (
    <div className="sequencer-block">
      <h3>matrix sequencer</h3>
      <div className="matrix">
        {pattern.map((row, y) => (
          <div className="tonerow" key={`row${y}`}>
            {row.map((val, x) => (
              <div
                key={`square${x}${y}`}
                className={
                  'tonesquare ' +
                  (x === seqStep ? 'live ' : '') +
                  (val ? 'filled' : '')
                }
                onClick={() => toggleSquare(x, y)}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="controls">
        <label htmlFor="tempo-slider">TEMPO: {`${tempo}`} BPM</label>
        <input
          type="range"
          name="tempo-slider"
          min="10"
          max="250"
          step="2"
          value={tempo}
          onChange={tempoAdjust}
        />
      </div>
      <div className="transport">
        {init ? (
          <button onClick={toggleTransport}>{playing ? 'STOP' : 'PLAY'}</button>
        ) : (
          <button onClick={initSeq}>INIT</button>
        )}
        <button onClick={clearPattern}>CLEAR PATTERN</button>
      </div>
    </div>
  );
};

export default Sequencer;
