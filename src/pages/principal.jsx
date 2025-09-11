import './principal.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import CaboVerde from '../assets/CaboVerde.png';
import CaboRosa from '../assets/CaboRosa.png';
import CaboAzul from '../assets/CaboAzul.png';
import CaboRoxo from '../assets/CaboRoxo.png';
import CaboCiano from '../assets/CaboCiano.png';
import RobotBody from '../assets/roboanimation.gif';
import Tank from '../assets/Tanque_4k_Animaton.gif';
import NPhase from '../assets/nphase.png';
import APhaseBlock from '../assets/aphaseBLOCK.png';
import VPhaseBlock from '../assets/vphaseBLOCK.png';
import WPhaseBlock from '../assets/wphaseBLOCK.png';
import YPhaseBlock from '../assets/yphaseBLOCK.png';
import RobotImage from '../assets/robot.png';
import ChatBubble from '../components/ChatBubble';
import PhaseButton from '../components/PhaseButton';
import principalTrack from '../sounds/principalSoundtrack.wav';

export default function Principal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showChatBubble, setShowChatBubble] = useState(false);
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const [showNextChat, setShowNextChat] = useState(false);
  const musicRef = useRef(null);

  // Array de mensagens para os ChatBubbles
  const chatMessages = [
    {
      characterName: "A Destruidora",
      message: "Transmissão interceptada... [SISTEMA: Escaneando...] Presença detectada. Anomalia identificada. Ameaça... confirmada.",
      characterImage: RobotImage,
      typingSpeed: 40,
      showDelay: 300,
      buttonDelay: 1000
    },
    {
      characterName: "A Destruidora", 
      message: "ORA, ORA... Então ainda restam humanos fora do meu controle?",
      characterImage: RobotImage,
      typingSpeed: 35,
      showDelay: 200,
      buttonDelay: 800
    },
    {
      characterName: "A Destruidora",
      message: "Patéticos. Vocês realmente acreditam que podem me derrotar? Que podem romper os firewalls da minha mente, atravessar minhas defesas, e... salvar o mundo?",
      characterImage: RobotImage,
      typingSpeed: 30,
      showDelay: 100,
      buttonDelay: 600
    },
    {
      characterName: "A Destruidora",
      message: "Minhas redes de segurança foram projetadas para aniquilar qualquer tentativa de resistência. Vocês não têm chance.",
      characterImage: RobotImage,
      typingSpeed: 30,
      showDelay: 100,
      buttonDelay: 600
    },
    {
      characterName: "A Destruidora",
      message: "Mas... Se desejam mesmo falhar gloriosamente, então venham. Tentem a sorte. Eu estarei assistindo.",
      characterImage: RobotImage,
      typingSpeed: 30,
      showDelay: 100,
      buttonDelay: 600
    },
  ];

  // Show chat bubble when entering this phase (but not when returning from games)
  useEffect(() => {
    const isReturningFromGame = new URLSearchParams(location.search).get('from') === 'game';
    
    if (!isReturningFromGame) {
      const dialogueCompleted = localStorage.getItem('dialogueCompleted');
      const chatBubbleShown = localStorage.getItem('chatBubbleShown');
      
      if (dialogueCompleted === 'true' && !chatBubbleShown) {
        const timer = setTimeout(() => {
          setShowChatBubble(true);
          setCurrentChatIndex(0);
        }, 2000); // 2 second delay

        return () => clearTimeout(timer);
      }
    }
  }, [location.search]);

  // Show next chat when showNextChat is true
  useEffect(() => {
    if (showNextChat) {
      const timer = setTimeout(() => {
        setShowNextChat(false);
      }, 500); // Small delay between chats
      return () => clearTimeout(timer);
    }
  }, [showNextChat]);

  const handleGameNavigation = (gamePath) => {
    // stop music when entering a phase
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }
    navigate(gamePath);
  };

  const handleChatComplete = () => {
    if (currentChatIndex < chatMessages.length - 1) {
      // Ainda há mais chats para mostrar
      setCurrentChatIndex(currentChatIndex + 1);
      setShowNextChat(true);
    } else {
      // Todos os chats foram mostrados
      setShowChatBubble(false);
      setShowNextChat(false);
      localStorage.setItem('chatBubbleShown', 'true');
      // start soundtrack when all chats close
      try {
        const audio = new Audio(principalTrack);
        audio.loop = true;
        audio.volume = 0.35;
        audio.play().catch(()=>{});
        musicRef.current = audio;
      } catch {}
    }
  };

  // stop soundtrack on unmount just in case
  useEffect(() => {
    return () => {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="principal-container">
      {/* Cabo images behind humanbody.png - Only Phase 1 (CaboVerde) is visible */}
      <img 
        src={CaboVerde} 
        alt="Cabo Verde" 
        className="cabo-image cabo-verde"
      />
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
        src={Tank}
        alt="Tanque"
        className="tanque-image"
      />
      
      {/* Robot body image on top */}
      <img 
        src={RobotBody} 
        alt="Robot Body" 
        className="robot-image"
      />

      {/* Phase buttons - Only Phase 1 is unlocked */}
      <PhaseButton 
        phaseImage={NPhase} 
        phaseText="Fase 1" 
        className="phase-button-verde"
        onClick={() => handleGameNavigation('/game1')}
        isBlocked={false}
      />
      <PhaseButton 
        phaseImage={APhaseBlock} 
        phaseText="Fase 2" 
        className="phase-button-rosa"
        onClick={() => handleGameNavigation('/game2')}
        isBlocked={true}
      />
      <PhaseButton 
        phaseImage={VPhaseBlock} 
        phaseText="Fase 3" 
        className="phase-button-azul"
        onClick={() => alert('Fase 3 ainda não está disponível!')}
        isBlocked={true}
      />
      <PhaseButton 
        phaseImage={WPhaseBlock} 
        phaseText="Fase 4" 
        className="phase-button-roxo"
        onClick={() => handleGameNavigation('/game4')}
        isBlocked={true}
      />
      <PhaseButton 
        phaseImage={YPhaseBlock} 
        phaseText="Fase 5" 
        className="phase-button-ciano"
        onClick={() => handleGameNavigation('/game5')}
        isBlocked={true}
      />

      {/* Chat bubbles that appear after dialogue completion */}
      {showChatBubble && !showNextChat && (
        <div className="principal-chat-container">
          <ChatBubble
            characterName={chatMessages[currentChatIndex].characterName}
            message={chatMessages[currentChatIndex].message}
            characterImage={chatMessages[currentChatIndex].characterImage}
            onComplete={handleChatComplete}
            typingSpeed={chatMessages[currentChatIndex].typingSpeed}
            showDelay={chatMessages[currentChatIndex].showDelay}
            buttonDelay={chatMessages[currentChatIndex].buttonDelay}
          />
        </div>
      )}
    </div>
  );
}
