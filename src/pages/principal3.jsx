import './principal.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import CaboRoxo from '../assets/CaboRoxo.png';
import CaboCiano from '../assets/CaboCiano.png';
import RobotBody from '../assets/roboanimation.gif';
import Tanque from '../assets/Tanque_4k_Animaton_Cabo3.gif';
import WPhase from '../assets/wphase.png';
import YPhase from '../assets/yphase.png';
import YPhaseBlock from '../assets/yphaseBLOCK.png';
import RobotImage from '../assets/robot.png';
import ChatBubble from '../components/ChatBubble';
import PhaseButton from '../components/PhaseButton';
import principalTrack from '../sounds/principalSoundtrack.wav';

export default function Principal3() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showChatBubble, setShowChatBubble] = useState(false);
  const musicRef = useRef(null);

  // Show chat bubble when entering this phase (but not when returning from games)
  useEffect(() => {
    const isReturningFromGame = new URLSearchParams(location.search).get('from') === 'game';
    
    if (!isReturningFromGame) {
      const timer = setTimeout(() => {
        setShowChatBubble(true);
      }, 2000); // 2 second delay

      return () => clearTimeout(timer);
    }
  }, [location.search]);

  const handleGameNavigation = (gamePath) => {
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }
    navigate(gamePath);
  };

  // Get the appropriate image for each phase
  const getPhaseImage = (phaseNumber) => {
    switch (phaseNumber) {
      case 4:
        return WPhase; // Phase 4 is unlocked
      case 5:
        return YPhaseBlock; // Phase 5 is locked
      default:
        return WPhase;
    }
  };

  return (
    <div className="principal-container">
      {/* Cabo images behind humanbody.png - Phase 1, 2, and 3 are hidden */}
      <img 
        src={CaboRoxo} 
        alt="Cabo Roxo" 
        className="cabo-image cabo-roxo"
      />
      <img 
        src={CaboCiano} 
        alt="Cabo Ciano" 
        className="cabo-image cabo-ciano"
      />
      {/* Tanque behind robot, above cabos */}
      <img 
        src={Tanque} 
        alt="Tanque" 
        className="tanque-image" 
      />
      
      {/* Robot body image on top */}
      <img 
        src={RobotBody} 
        alt="Robot Body" 
        className="robot-image"
      />

      {/* Phase buttons - Phase 1, 2, and 3 are hidden, Phase 4 is unlocked */}
      <PhaseButton 
        phaseImage={getPhaseImage(4)} 
        phaseText="Fase 4" 
        className="phase-button-roxo"
        onClick={() => handleGameNavigation('/game4')}
        isBlocked={false}
      />
      <PhaseButton 
        phaseImage={getPhaseImage(5)} 
        phaseText="Fase 5" 
        className="phase-button-ciano"
        onClick={() => handleGameNavigation('/game5')}
        isBlocked={true}
      />

      {/* Chat bubble that appears after Game3 completion */}
      {showChatBubble && (
        <div className="principal-chat-container">
          <ChatBubble
            characterName="A Destruidora"
            message="[ERROR] [ERROR] ...O-o-que!? S-sistemas... colapsando?! Vocês… humanos… como ousam?! Agora… agora… vocês vão ver… toda minha fúria!"
            characterImage={RobotImage}
            onComplete={() => {
              setShowChatBubble(false);
              try {
                const audio = new Audio(principalTrack);
                audio.loop = true;
                audio.volume = 0.35;
                audio.play().catch(()=>{});
                musicRef.current = audio;
              } catch {}
            }}
            typingSpeed={40}
            showDelay={300}
            buttonDelay={1000}
          />
        </div>
      )}
    </div>
  );
}
