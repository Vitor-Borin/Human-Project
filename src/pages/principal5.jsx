import './principal.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import RobotBody from '../assets/roboanimation.gif';
import Tanque from '../assets/Tanque_4k_Animaton_Cabo5.gif';
import RobotImage from '../assets/robot.png';
import ChatBubble from '../components/ChatBubble';
import mysterySolved from '../sounds/mysterysolved.mp3';
import broken from '../sounds/broken.mp3';
import scream from '../sounds/scream.wav';

export default function Principal5() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showChatBubble, setShowChatBubble] = useState(false);
  const [showChatBubble2, setShowChatBubble2] = useState(false);
  const [showChatBubble3, setShowChatBubble3] = useState(false);
  const [showChatBubble4, setShowChatBubble4] = useState(false);
  const [showChatBubble5, setShowChatBubble5] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(false);
  const musicRef = useRef(null);
  const brokenAudioRef = useRef(null);
  const screamAudioRef = useRef(null);

  // Show chat bubble when entering this phase (but not when returning from games)
  useEffect(() => {
    const isReturningFromGame = new URLSearchParams(location.search).get('from') === 'game';
    
    if (!isReturningFromGame) {
      const timer = setTimeout(() => {
        setShowChatBubble(true);
        // Start playing mystery solved sound when first chat bubble appears
        try {
          const audio = new Audio(mysterySolved);
          audio.loop = true;
          audio.volume = 0.35;
          audio.play().catch(()=>{});
          musicRef.current = audio;
        } catch {}
      }, 2000); // 2 second delay

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="principal-container">
      {/* Tanque behind robot, above cabos (no cabos in this screen) */}
      <img 
        src={Tanque} 
        alt="Tanque" 
        className="tanque-image" 
      />
      {/* Robot body image on top - no Cabo images, all phases completed */}
      <img 
        src={RobotBody} 
        alt="Robot Body" 
        className="robot-image"
      />

      {/* No phase buttons - all phases completed */}

      {/* Chat bubble that appears after Game5 completion */}
      {showChatBubble && (
        <div className="principal-chat-container">
          <ChatBubble
            characterName="A Destruidora"
            message="Aquela memória... Eu... Eu me lembro. Meus M-meus pais, meu irmão! Argh-"
            characterImage={RobotImage}
            onComplete={() => {
              setShowChatBubble(false);
              setShowChatBubble2(true);
            }}
            typingSpeed={40}
            showDelay={300}
            buttonDelay={1000}
          />
        </div>
      )}

      {/* Second chat bubble */}
      {showChatBubble2 && (
        <div className="principal-chat-container">
          <ChatBubble
            characterName="A Destruidora"
            message="[ERROR] [ERROR] Sistema corrompido-"
            characterImage={RobotImage}
            onComplete={() => {
              setShowChatBubble2(false);
              setShowChatBubble3(true);
            }}
            typingSpeed={40}
            showDelay={300}
            buttonDelay={1000}
          />
        </div>
      )}

      {/* Third chat bubble */}
      {showChatBubble3 && (
        <div className="principal-chat-container">
          <ChatBubble
            characterName="A Destruidora"
            message=" O- o quê está acontecendo comigo?... [FALHAS] [FALHAS] [ABORTAR OPERAÇÃO]" 
            characterImage={RobotImage}
            onComplete={() => {
              setShowChatBubble3(false);
              setShowChatBubble4(true);
            }}
            typingSpeed={40}
            showDelay={300}
            buttonDelay={1000}
          />
        </div>
      )}

      {/* Fourth chat bubble */}
      {showChatBubble4 && (
        <div className="principal-chat-container">
          <ChatBubble
            characterName="A Destruidora"
            message="..."
            characterImage={RobotImage}
            onComplete={() => {
              setShowChatBubble4(false);
              setShowChatBubble5(true);
            }}
            typingSpeed={40}
            showDelay={300}
            buttonDelay={1000}
          />
        </div>
      )}

      {/* Fifth chat bubble */}
      {showChatBubble5 && (
        <div className="principal-chat-container">
          <ChatBubble
            characterName="A Destruidora"
            message="AAARGH- EU ME LEMBRO! Me deixe ir! Eu não quero mais! AAH-"
            characterImage={RobotImage}
            onComplete={() => {
              setShowChatBubble5(false);
              // Start white screen transition after a delay
              setTimeout(() => {
                // Stop the mystery solved music when white fade starts
                if (musicRef.current) {
                  musicRef.current.pause();
                  musicRef.current.currentTime = 0;
                  musicRef.current = null;
                }
                
                // Play broken.mp3 and scream.wav simultaneously when white fade starts
                try {
                  const brokenAudio = new Audio(broken);
                  brokenAudio.volume = 0.5;
                  brokenAudio.play().catch(() => {});
                  brokenAudioRef.current = brokenAudio;
                } catch {}
                
                try {
                  const screamAudio = new Audio(scream);
                  screamAudio.volume = 0.6;
                  screamAudio.play().catch(() => {});
                  screamAudioRef.current = screamAudio;
                } catch {}
                
                setShowWhiteScreen(true);
                // Navigate to principal6 after white screen is fully visible
                setTimeout(() => {
                  navigate('/principal6');
                }, 2000); // 2 seconds for white screen to be fully visible
              }, 3000); // 3 second delay before white screen
            }}
            typingSpeed={40}
            showDelay={300}
            buttonDelay={1000}
          />
        </div>
      )}

      {/* White screen transition */}
      {showWhiteScreen && (
        <div className="white-screen-transition"></div>
      )}
    </div>
  );
}
