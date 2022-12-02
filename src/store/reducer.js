import { combineReducers } from 'redux';
import sequencer from './sequencer';
import synth from './synth';

export default combineReducers({
  sequencer,
  synth
});
