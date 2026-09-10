'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { StartScreen } from '@/components/screens/01_StartScreen';
import { HowToPlayScreen } from '@/components/screens/03_HowToPlay';
import { GameMapScreen } from '@/components/screens/04_GameMap';
import { Zone1Container } from '@/components/screens/05_Zone1Lab/Zone1Container';
import { Zone2Container } from '@/components/screens/06_Zone2FoodChain/Zone2Container';
import { Zone3Container } from '@/components/screens/07_Zone3Decay/Zone3Container';
import { Zone4Container } from '@/components/screens/08_Zone4FoodWebForest/Zone4Container';
import { FoodFactoryGame } from '@/components/screens/09_BonusFoodFactory/FoodFactoryGame';
import { RapidFireQuiz } from '@/components/screens/10_RapidFire/RapidFireQuiz';
import { RiskRoundGame } from '@/components/screens/11_RiskRound/RiskRoundGame';
import { EcosystemEmergency } from '@/components/screens/12_FinalChallenge/EcosystemEmergency';
import { FinalScoreScreen } from '@/components/screens/13_FinalScore/FinalScoreScreen';
import { LearningSummary } from '@/components/screens/14_LearningSummary/LearningSummary';

export default function Home() {
  const { stage } = useGame();

  switch (stage) {
    case 'start':
      return <StartScreen />;
    case 'how-to-play':
      return <HowToPlayScreen />;
    case 'map':
      return <GameMapScreen />;
    case 'zone-1':
      return <Zone1Container />;
    case 'zone-2':
      return <Zone2Container />;
    case 'zone-3':
      return <Zone3Container />;
    case 'zone-4':
      return <Zone4Container />;
    case 'bonus':
      return <FoodFactoryGame />;
    case 'rapid-fire':
      return <RapidFireQuiz />;
    case 'risk':
      return <RiskRoundGame />;
    case 'final-challenge':
      return <EcosystemEmergency />;
    case 'final-score':
      return <FinalScoreScreen />;
    case 'summary':
      return <LearningSummary />;
    default:
      return <StartScreen />;
  }
}
