import './principal.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import CaboCiano from '../assets/CaboCiano.png';
import RobotBody from '../assets/roboanimation.gif';
import Tanque from '../assets/Tanque_4k_Animaton_Cabo4.gif';
import YPhase from '../assets/yphase.png';
import RobotImage from '../assets/robot.png';
import ChatBubble from '../components/ChatBubble';
import PhaseButton from '../components/PhaseButton';
import principalTrack from '../sounds/principalSoundtrack.wav';

export default function Principal4() {
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

  return (
    <div className="principal-container">
      {/* Cabo images behind humanbody.png - Only Phase 5 (CaboCiano) is visible */}
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

      {/* Phase buttons - Only Phase 5 is unlocked */}
      <PhaseButton 
        phaseImage={YPhase} 
        phaseText="Fase 5" 
        className="phase-button-ciano"
        onClick={() => handleGameNavigation('/game5')}
        isBlocked={false}
      />

      {/* Chat bubble that appears after Game4 completion */}
      {showChatBubble && (
        <div className="principal-chat-container">
          <ChatBubble
            characterName="A Destruidora"
            message="Meus sistemas de segurança... todos desativados, 0 qu3 V0c3$ fizeram.. [Error] [Error] [Ativando Cortéx Mental Privado]... O- o quê?"
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
