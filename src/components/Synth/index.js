import React, { useEffect, useState } from 'react';
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
  const [fil, setFil] = useState(synths[0].fil.type);
  const [roll, setRoll] = useState(synths[0].fil.rolloff);
  const [freq, setFreq] = useState(synths[0].fil.frequency.value);
  const [ampA, setAmpA] = useState(synths[0].amp.attack);
  const [ampD, setAmpD] = useState(synths[0].amp.decay);
  const [ampS, setAmpS] = useState(synths[0].amp.sustain);
  const [ampR, setAmpR] = useState(synths[0].amp.release);

  const handleOsc = (e) => {
    dispatch(changeOsc(e.target.value));
    setOsc(e.target.value);
  };

  const handleFilter = (e) => {
    switch (e.target.name) {
      case 'filt-type':
        dispatch(changeFilter(e.target.value, roll, freq));
        setFil(e.target.value);
        return;
      case 'filt-roll':
        dispatch(changeFilter(fil, e.target.value, freq));
        setRoll(e.target.value);
        return;
      case 'filt-cutoff':
        dispatch(changeFilter(fil, roll, e.target.value));
        setFreq(e.target.value);
        return;
      default:
        return;
    }
  };

  const handleAmp = (e) => {
    switch (e.target.name) {
      case 'amp-atk':
        dispatch(changeAmp(e.target.value, ampD, ampS, ampR));
        setAmpA(e.target.value);
        return;
      case 'amp-dcy':
        dispatch(changeAmp(ampA, e.target.value, ampS, ampR));
        setAmpD(e.target.value);
        return;
      case 'amp-sus':
        dispatch(changeAmp(ampA, ampD, e.target.value, ampR));
        setAmpS(e.target.value);
        return;
      case 'amp-rel':
        dispatch(changeAmp(ampA, ampD, ampS, e.target.value));
        setAmpR(e.target.value);
        return;
      default:
        console.log(e.target.value);
        return;
    }
  };

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
                  value={fil}
                  onChange={handleFilter}
                >
                  <option value="lowpass">Low pass</option>
                  <option value="bandpass">Band pass</option>
                  <option value="highpass">High pass</option>
                </select>
                <select
                  name="filt-roll"
                  id="filt-roll"
                  value={roll}
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
                value={freq}
                onChange={handleFilter}
              />
            </div>
          </fieldset>
        </div>
        <div className="amp-controls">
          <fieldset>
            <legend>Amp Envelope</legend>
            <div className="amp-envelope">
              <label htmlFor="amp-attack">Attack: {ampA}</label>
              <input
                type="range"
                id="amp-attack"
                name="amp-atk"
                min="0"
                max="1"
                step="0.01"
                value={ampA}
                onChange={handleAmp}
              />
              <label htmlFor="amp-decay">Decay: {ampD}</label>
              <input
                type="range"
                id="amp-decay"
                name="amp-dcy"
                min="0"
                max="1"
                step="0.01"
                value={ampD}
                onChange={handleAmp}
              />
              <label htmlFor="amp-sustain">
                Sustain: {Math.round(ampS * 100)}%
              </label>
              <input
                type="range"
                id="amp-sustain"
                name="amp-sus"
                min="0"
                max="1"
                step="0.01"
                value={ampS}
                onChange={handleAmp}
              />
              <label htmlFor="amp-release">Release: {ampR}</label>
              <input
                type="range"
                id="amp-release"
                name="amp-rel"
                min="0"
                max="1"
                step="0.01"
                value={ampR}
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
