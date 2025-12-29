import React, { useState } from 'react';
import { LandingPage } from './daw/LandingPage';
import { DAWInterface } from './daw/DAWInterface';

const HERO_IMAGE = 'https://d64gsuwffb70l.cloudfront.net/6951db99354ded782498388f_1766972419220_cbbfdb2f.jpg';
const WAVE_IMAGE = 'https://d64gsuwffb70l.cloudfront.net/6951db99354ded782498388f_1766972438300_dbc886b2.png';

const AppLayout: React.FC = () => {
  const [showDAW, setShowDAW] = useState(false);

  if (showDAW) {
    return <DAWInterface onBack={() => setShowDAW(false)} />;
  }

  return (
    <LandingPage
      onStartProject={() => setShowDAW(true)}
      heroImage={HERO_IMAGE}
      waveImage={WAVE_IMAGE}
    />
  );
};

export default AppLayout;
