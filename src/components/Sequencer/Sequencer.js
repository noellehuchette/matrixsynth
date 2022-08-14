import React, { Component } from 'react';
import { connect } from 'react-redux';
import Square from './Square';
import { init, toggleSquare, clearPattern } from '../../store/sequencer';
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

const initPattern = [
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

class Sequencer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            init: false,
            playing: false,
            pattern: initPattern,
            synths: [],
            liveStep: 0,
        };
    }

    componentDidMount() {

    }

    init() {
        this.setState({ init: true });
    }

    render() {
        const { init, playing, pattern, synths, liveStep } = this.state;
        return (
            <div>
                {pattern.map((row,y) => (
                        <div className='tonerow' key={`yy${y}`}>
                            {row.map((val, x) => (
                                <Square
                                  key={`xx${x}`}
                                  active={liveStep === x}
                                  value={val}
                                  onClick={() => pattern[y][x] = !pattern[y][x]}
                                />
                            ))
                            }
                        </div>
                    ))}
            </div>
        );
    }
}

const mapState = (state) => {
    return {

    };
};

const mapDispatch = (dispatch) => {
    return {

    };
};

export default connect(mapState, mapDispatch)(Sequencer);