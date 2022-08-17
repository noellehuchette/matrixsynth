import React, { Component } from 'react';
import { connect } from 'react-redux';
import Square from './Square';
import { start, Transport, Loop, Synth, Chorus, Draw, Part } from 'tone';
import { step, initialize, stop, play } from '../../store/sequencer';
import './sequencer.css';

const notes = ['D5','C5','A4','G4','F4','D4','C4','A3','G3','F3','D3','C3','A2','G2','F2','D2'];

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
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
};

const buildSynths = () => {
    const synths = [];
    const chorus = new Chorus(5, 5, 5).toDestination();
    for (let syn = 0; syn < 16; syn++) {
        synths[syn] = new Synth().connect(chorus);
    }
    return synths;
};

class Sequencer extends Component {
    constructor(props) {
        super(props);
        let pattern = window.localStorage.getItem('matrixpattern');
        this.state = {
            tempo: 120,
            synths: [],
            iniTone: false,
            playing: false,
            pattern: pattern ? JSON.parse(pattern) : initPattern(),
            parts: [],
        };
        this.init = this.init.bind(this);
        this.toggleSquare = this.toggleSquare.bind(this);
        this.toggleTransport = this.toggleTransport.bind(this);
        this.clearPattern = this.clearPattern.bind(this);
        this.setPart = this.setPart.bind(this);
        this.tempoAdjust = this.tempoAdjust.bind(this);
    }

    componentDidMount() {
        this.props.initialize();
        const synths = buildSynths();
        Transport.bpm.value = this.state.tempo;
        this.setState({ synths });
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.state.playing && this.props.sequencer > -1) {
            this.props.step();
            this.props.stop();
        }
        if (this.state.tempo !== prevState.tempo) {
            Transport.bpm.value = this.state.tempo;
        }
    }

    init() {
        const { step } = this.props;
        start();
        const iniTone = true;
        Transport.loop = true;
        Transport.setLoopPoints(0, '1m');
        let tracking = new Loop((time) => {
            Draw.schedule(() => step(), time);
        }, '16n').start(0);
        this.setState({ iniTone });
        this.setPart(this.state.pattern);
        this.props.stop();
    }

    toggleTransport() {
        if (this.state.playing) {
            this.props.stop();
            let playing = false;
            this.setState({ playing });
        }
        else {
            this.props.play();
            let playing = true;
            this.setState({ playing });
        }
    }

    toggleSquare(x, y) {
        let pattern = this.state.pattern;
        pattern[y][x] = +!pattern[y][x];
        this.setState({ pattern });
        this.setPart(pattern);
    }

    clearPattern() {
        let pattern = initPattern();
        this.setState({ pattern });
        this.setPart(pattern);
    }

    setPart(pattern) {
        let { synths, parts } = this.state;
        parts.forEach(part => part.dispose());
        parts = [];
        synths.forEach((synth, idx) => {
            let arrangement = [];
            pattern[idx].forEach((step, beat) => {
                if (step) arrangement.push({ time: { '16n': +beat }, note: notes[idx] });
            });
            parts.push(new Part(((time, value) => {
                synth.triggerAttackRelease(value.note, '32n.', time);
            }), arrangement).start(0));
        });
        this.setState({ parts });
        window.localStorage.setItem('matrixpattern', JSON.stringify(pattern));
    }


    tempoAdjust(e) {
        this.setState({ tempo: e.target.value });
        this.setPart(this.state.pattern);
    }

    render() {
        const step = this.props.sequencer || 0;
        const { pattern, iniTone, playing, tempo } = this.state;
        return (
            <div className='sequencer-block'>
                <h3>matrix sequencer</h3>
                <div className='matrix'>
                    {pattern.map((row,y) => (
                            <div className='tonerow' key={`yy${y}`}>
                                {row.map((val, x) => (
                                    <Square
                                      key={`xx${x}`}
                                      active={step === x}
                                      value={val}
                                      onClick={() => this.toggleSquare(x,y)}
                                    />
                                ))
                                }
                            </div>
                        ))}
                </div>
                <div className = 'controls'>
                    <label htmlFor='tempo-slider'>TEMPO: {`${tempo}`} BPM</label>
                    <input type='range' name='tempo-slider' min='20' max='420' step='2' value={tempo} onChange={this.tempoAdjust}/>
                </div>
                <div className='transport'>
                    {iniTone ?
                        <button onClick={this.toggleTransport}>{playing ? 'STOP' : 'PLAY'}</button>
                            :
                        <button onClick={this.init}>INIT</button>
                    }
                    <button onClick={this.clearPattern}>CLEAR PATTERN</button>
                </div>
            </div>
        );
    }
}

const mapState = (state) => {
    return {
        sequencer: state.sequencer,
    };
};

const mapDispatch = (dispatch) => {
    return {
        initialize: () => dispatch(initialize()),
        step: () => dispatch(step()),
        stop: () => dispatch(stop()),
        play: () => dispatch(play()),
    };
};

export default connect(mapState, mapDispatch)(Sequencer);