import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Tone from 'tone';

class Synth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            init: false,
            drone: false,
            cutoff: 880,
            env: {
                attack: 0.1,
                decay: 0.3,
                sustain: 0.5,
                release: 0.5,
            },
        };
    }

    componentDidMount() {

    }

    init() {
        Tone.start();
        this.setState({ init: true });
    }

    buildSynth() {
        
    }

    handleChange() {

    }

    render() {
        return (
            <div>
                <button>init</button>
                <button>drone</button>
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

export default connect(mapState, mapDispatch)(Synth);