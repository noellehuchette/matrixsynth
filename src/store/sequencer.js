import {Transport, Time} from 'tone';

const STEP = 'STEP';
const INITIALIZE = 'INITIALIZE';
const STOP = 'STOP';
const PLAY = 'PLAY';


export const step = () => ({
    type: STEP,
});

export const initialize = () => ({
    type: INITIALIZE,
});

export const stop = () => ({
    type: STOP,
});

export const play = () => ({
    type: PLAY,
});


export default function(state = 0, action) {
    let updState = +state;
    switch (action.type) {
        case INITIALIZE:
            return state;
        case STEP:
            if (++updState >= 16) updState = 0;
            return updState;
        case STOP:
            Transport.stop();
            return updState = 0;
        case PLAY:
            Transport.start();
        default:
            return state;
    }
}