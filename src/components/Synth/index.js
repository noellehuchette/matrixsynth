import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Tone from 'tone';
import './style.css';

const Synth = () => {
  return (
    <div className="synth-block">
      <div className="synth controls"></div>
    </div>
  );
};

export default Synth;
