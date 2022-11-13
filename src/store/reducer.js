import { combineReducers } from 'redux';
import sequencer from './sequencer';
import synthesizer from './synth';

export default combineReducers({
  sequencer,
  synthesizer
});
