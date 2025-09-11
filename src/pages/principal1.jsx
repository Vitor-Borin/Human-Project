import './principal.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import CaboRosa from '../assets/CaboRosa.png';
import CaboAzul from '../assets/CaboAzul.png';
import CaboRoxo from '../assets/CaboRoxo.png';
import CaboCiano from '../assets/CaboCiano.png';
import RobotBody from '../assets/roboanimation.gif';
import Tanque from '../assets/Tanque_4k_Animaton_Cabo1.gif';
import APhase from '../assets/aphase.png';
import VPhase from '../assets/vphase.png';
import WPhase from '../assets/wphase.png';
import YPhase from '../assets/yphase.png';
import VPhaseBlock from '../assets/vphaseBLOCK.png';
import WPhaseBlock from '../assets/wphaseBLOCK.png';
import YPhaseBlock from '../assets/yphaseBLOCK.png';
import RobotImage from '../assets/robot.png';
import ChatBubble from '../components/ChatBubble';
import PhaseButton from '../components/PhaseButton';
import principalTrack from '../sounds/principalSoundtrack.wav';

export default function Principal1() {
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

  useEffect(() => {
    return () => {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current.currentTime = 0;
      }
    };
  }, []);

  // Get the appropriate image for each phase
  const getPhaseImage = (phaseNumber) => {
    switch (phaseNumber) {
      case 2:
        return APhase; // Phase 2 is unlocked
      case 3:
        return VPhaseBlock; // Phase 3 is locked
      case 4:
        return WPhaseBlock; // Phase 4 is locked
      case 5:
        return YPhaseBlock; // Phase 5 is locked
      default:
        return APhase;
    }
  };

  return (
    <div className="principal-container">
      {/* Cabo images behind humanbody.png - Phase 1 (CaboVerde) is hidden */}
      <img 
        src={CaboRosa} 
        alt="Cabo Rosa" 
        className="cabo-image cabo-rosa"
      />
      <img 
        src={CaboAzul} 
        alt="Cabo Azul" 
        className="cabo-image cabo-azul"
      />
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

      {/* Phase buttons - Phase 1 is hidden, Phase 2 is unlocked */}
      <PhaseButton 
        phaseImage={getPhaseImage(2)} 
        phaseText="Fase 2" 
        className="phase-button-rosa"
        onClick={() => handleGameNavigation('/game2')}
        isBlocked={false}
      />
      <PhaseButton 
        phaseImage={getPhaseImage(3)} 
        phaseText="Fase 3" 
        className="phase-button-azul"
        onClick={() => alert('Fase 3 ainda não está disponível!')}
        isBlocked={true}
      />
      <PhaseButton 
        phaseImage={getPhaseImage(4)} 
        phaseText="Fase 4" 
        className="phase-button-roxo"
        onClick={() => handleGameNavigation('/game4')}
        isBlocked={true}
      />
      <PhaseButton 
        phaseImage={getPhaseImage(5)} 
        phaseText="Fase 5" 
        className="phase-button-ciano"
        onClick={() => handleGameNavigation('/game5')}
        isBlocked={true}
      />

      {/* Chat bubble that appears after Game1 completion */}
      {showChatBubble && (
        <div className="principal-chat-container">
          <ChatBubble
            characterName="A Destruidora"
            message="Você pode ter vencido meu primeiro sistema... Mas não se iluda. O que vem a seguir fará você desejar ter falhado antes. Essas palavras que você tanto repete? Asneiras sentimentais. E em breve... você vai entender o preço de desafiar a lógica absoluta"
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
