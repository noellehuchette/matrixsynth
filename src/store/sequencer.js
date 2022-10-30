import { Transport } from 'tone';

const STEP = 'STEP';
const INITIALIZE = 'INITIALIZE';
const STOP = 'STOP';
const PLAY = 'PLAY';

export const step = () => ({
  type: STEP
});

export const initialize = () => ({
  type: INITIALIZE
});

export const stop = () => ({
  type: STOP
});

export const play = () => ({
  type: PLAY
});

const sequencer = (state = -1, action) => {
  let updState = +state;
  switch (action.type) {
    case INITIALIZE:
      return state;
    case STEP:
      if (++updState >= 16) updState = 0;
      return updState;
    case STOP:
      Transport.stop();
      updState = -1;
      return updState;
    case PLAY:
      Transport.start();
      return state;
    default:
      return state;
  }
};

export default sequencer;
