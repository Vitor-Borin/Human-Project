import { useState, useEffect } from 'react';
import { BrowserRouter, Routes,Route} from 'react-router-dom';

import MotionHuman from './pages/MotionHuman';
import Intro from './pages/intro';
import Characters from './pages/characters';
import Dialogue from './pages/dialogue';
import Principal from './pages/principal';
import Principal1 from './pages/principal1';
import Principal2 from './pages/principal2';
import Principal3 from './pages/principal3';
import Principal4 from './pages/principal4';
import Principal5 from './pages/principal5';
import Principal6 from './pages/principal6';
import Interaction from './pages/interaction';
import Future from './pages/future';
import Credits from './pages/credits';
import Animation from './pages/animation';
import Animation1 from './pages/animation1';
import Animation2 from './pages/animation2';
import Animation3 from './pages/animation3';
import Animation4 from './pages/animation4';
import Animation5 from './pages/animation5';
import Game1 from './pages/Game1';
import Game2 from './pages/Game2';
import Game3 from './pages/Game3';
import Game4 from './pages/Game4';
import Game5 from './pages/Game5';

import './App.css'

function App() {
  // Reset game progress every time the app starts
  useEffect(() => {
    localStorage.removeItem('completedPhases');
    localStorage.removeItem('dialogueCompleted');
    localStorage.removeItem('chatBubbleShown');
    localStorage.removeItem('game1Visited');
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MotionHuman/>}/>
        <Route path="/intro" element={<Intro/>}/>
        <Route path="/characters" element={<Characters/>}/>
        <Route path="/dialogue" element={<Dialogue/>}/>
        <Route path="/principal" element={<Principal/>}/>
        <Route path="/principal1" element={<Principal1/>}/>
        <Route path="/principal2" element={<Principal2/>}/>
        <Route path="/principal3" element={<Principal3/>}/>
        <Route path="/principal4" element={<Principal4/>}/>
        <Route path="/principal5" element={<Principal5/>}/>
        <Route path="/principal6" element={<Principal6/>}/>
        <Route path="/interaction" element={<Interaction/>}/>
        <Route path="/future" element={<Future/>}/>
        <Route path="/credits" element={<Credits/>}/>
        <Route path="/video" element={<Future/>}/>
        <Route path="/animation" element={<Animation/>}/>
        <Route path="/animation1" element={<Animation1/>}/>
        <Route path="/animation2" element={<Animation2/>}/>
        <Route path="/animation3" element={<Animation3/>}/>
        <Route path="/animation4" element={<Animation4/>}/>
        <Route path="/animation5" element={<Animation5/>}/>
        <Route path="/game1" element={<Game1/>}/>
        <Route path="/game2" element={<Game2/>}/>
        <Route path="/game3" element={<Game3/>}/>
        <Route path="/game4" element={<Game4/>}/>
        <Route path="/game5" element={<Game5/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
