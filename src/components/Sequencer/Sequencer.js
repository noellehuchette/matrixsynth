import React, { Component } from 'react';
import { connect } from 'react-redux';
import Square from './Square';
import { start, Transport, Loop, Synth, Time } from 'tone';
import { step, initialize, stop } from '../../store/sequencer';
import './sequencer.css';

const notes = [
    'D5',
    'C4',
    'A4',
    'G4',
    'F4',
    'D4',
    'C3',
    'A3',
    'G3',
    'F3',
    'D3',
    'C2',
    'A2',
    'G2',
    'F2',
    'D2',
];

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
    for (let syn = 0; syn < 16; syn++) {
        synths[syn] = new Synth().toDestination();
    }
    return synths;
};

class Sequencer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempo: 130,
            synths: [],
            iniTone: false,
            playing: false,
            pattern: initPattern(),
            loop: {},
        };
        this.init = this.init.bind(this);
        this.toggleSquare = this.toggleSquare.bind(this);
        this.toggleTransport = this.toggleTransport.bind(this);
        this.clearPattern = this.clearPattern.bind(this);
    }

    componentDidMount() {
        this.props.initialize(0);
        const synths = buildSynths();
        Transport.bpm.value = this.state.tempo;
        this.setState({ synths });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.playing && (this.props.sequencer !== prevProps.sequencer || !prevState.playing)) {
            const { synths, pattern } = this.state;
            const step = this.props.sequencer;
            synths.forEach((synth, note) => {
                if(pattern[note][step]) {
                    synth.triggerAttackRelease(notes[note], '8n', Transport.immediate());
                }
            });
        }
    }

    init() {
        const { step } = this.props;
        start();
        Transport.stop();
        this.props.stop();
        const iniTone = true;
        Transport.loop = true;
        Transport.setLoopPoints(0, '4m');
        let beat = new Loop((time) => {
            step();
        }, '4n').start(0);
        this.setState({ iniTone });
    }

    toggleTransport() {
        if (this.state.playing) {
            Transport.stop();
            let playing = false;
            this.setState({ playing });
            this.props.stop();
        }
        else {
            Transport.start();
            let playing = !this.state.playing;
            this.setState({ playing });
        }
    }

    toggleSquare(x, y) {
        let pattern = this.state.pattern;
        pattern[y][x] = +!pattern[y][x];
        this.setState({ pattern });
    }

    clearPattern() {
        let pattern = initPattern();
        this.setState({ pattern });
    }

    render() {
        const step = this.props.sequencer || 0;
        const { pattern, iniTone, playing } = this.state;
        return (
            <div>
                <div>
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
                <div>
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
    };
};

export default connect(mapState, mapDispatch)(Sequencer);