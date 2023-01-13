import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeOsc, changeFilter, changeAmp } from '../../store/synth';
import * as Tone from 'tone';
import './style.css';

const Synth = () => {
  //load saved

  //redux connectivity
  const seqStep = useSelector((state) => state.sequencer);
  const dispatch = useDispatch();
  const synths = useSelector((state) => state.synth);

  //synth parameters

  const [osc, setOsc] = useState(synths[0].osc.type);

  const [filter, setFilter] = useState({
    fil: synths[0].fil.type,
    roll: synths[0].fil.rolloff,
    freq: synths[0].fil.frequency.value
  });

  const [amp, setAmp] = useState({
    atk: synths[0].amp.attack,
    dec: synths[0].amp.decay,
    sus: synths[0].amp.sustain,
    rel: synths[0].amp.release
  });

  const handleOsc = useCallback(
    (e) => {
      dispatch(changeOsc(e.target.value));
      setOsc(e.target.value);
    },
    [dispatch, setOsc]
  );

  const handleFilter = useCallback(
    (e) => {
      switch (e.target.name) {
        case 'filt-type':
          setFilter({ ...filter, fil: e.target.value });
          dispatch(changeFilter({ ...filter, fil: e.target.value }));
          return;
        case 'filt-roll':
          setFilter({ ...filter, roll: e.target.value });
          dispatch(changeFilter({ ...filter, roll: e.target.value }));
          return;
        case 'filt-cutoff':
          setFilter({ ...filter, freq: e.target.value });
          dispatch(changeFilter({ ...filter, freq: e.target.value }));
          return;
        default:
          return;
      }
    },
    [dispatch, filter, setFilter]
  );

  const handleAmp = useCallback(
    (e) => {
      switch (e.target.name) {
        case 'amp-atk':
          setAmp({ ...amp, atk: e.target.value });
          dispatch(changeAmp({ ...amp, atk: e.target.value }));
          return;
        case 'amp-dcy':
          setAmp({ ...amp, dec: e.target.value });
          dispatch(changeAmp({ ...amp, dec: e.target.value }));
          return;
        case 'amp-sus':
          setAmp({ ...amp, sus: e.target.value });
          dispatch(changeAmp({ ...amp, sus: e.target.value }));
          return;
        case 'amp-rel':
          setAmp({ ...amp, rel: e.target.value });
          dispatch(changeAmp({ ...amp, rel: e.target.value }));
          return;
        default:
          return;
      }
    },
    [dispatch, setAmp, amp]
  );

  return (
    <div className="synth-block">
      <div className="synth-controls">
        <div className="osc-controls">
          <fieldset>
            <legend>Oscillator</legend>
            <select
              name="oscillator"
              id="oscillator"
              value={osc}
              onChange={handleOsc}
            >
              <option value="fatsawtooth">Saw</option>
              <option value="fatsquare">Square</option>
              <option value="fattriangle">Triangle</option>
              <option value="fatsine">Sine</option>
            </select>
          </fieldset>
          <fieldset>
            <legend>Filter</legend>
            <div className="filter-params">
              <div className="filter-type">
                <select
                  name="filt-type"
                  id="filt-type"
                  value={filter.fil}
                  onChange={handleFilter}
                >
                  <option value="lowpass">Low pass</option>
                  <option value="bandpass">Band pass</option>
                  <option value="highpass">High pass</option>
                </select>
                <select
                  name="filt-roll"
                  id="filt-roll"
                  value={filter.roll}
                  onChange={handleFilter}
                >
                  <option value="-12">-12</option>
                  <option value="-24">-24</option>
                  <option value="-48">-48</option>
                </select>
              </div>
              <input
                name="filt-cutoff"
                type="number"
                id="filt-cutoff"
                min="10"
                max="20000"
                step="5"
                value={filter.freq}
                onChange={handleFilter}
              />
            </div>
          </fieldset>
        </div>
        <div className="amp-controls">
          <fieldset>
            <legend>Amp Envelope</legend>
            <div className="amp-envelope">
              <label htmlFor="amp-attack">Attack: {amp.atk}</label>
              <input
                type="range"
                id="amp-attack"
                name="amp-atk"
                min="0.01"
                max="1"
                step="0.01"
                value={amp.atk}
                onChange={handleAmp}
              />
              <label htmlFor="amp-decay">Decay: {amp.dec}</label>
              <input
                type="range"
                id="amp-decay"
                name="amp-dcy"
                min="0.01"
                max="1"
                step="0.01"
                value={amp.dec}
                onChange={handleAmp}
              />
              <label htmlFor="amp-sustain">
                Sustain: {Math.round(amp.sus * 100)}%
              </label>
              <input
                type="range"
                id="amp-sustain"
                name="amp-sus"
                min="0.01"
                max="1"
                step="0.01"
                value={amp.sus}
                onChange={handleAmp}
              />
              <label htmlFor="amp-release">Release: {amp.rel}</label>
              <input
                type="range"
                id="amp-release"
                name="amp-rel"
                min="0.01"
                max="1"
                step="0.01"
                value={amp.rel}
                onChange={handleAmp}
              />
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default Synth;
