import './principal.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Humana from '../assets/Humana.png';
import TanqueQuebrado from '../assets/Tanque_Quebrado_.png';
import RobotImage from '../assets/robot.png';
import ChatBubble from '../components/ChatBubble';
import YasDg from '../assets/yasDg.png';
import Grupo from '../assets/grupo.png';
// No background music in principal6

export default function Principal6() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showChatBubble, setShowChatBubble] = useState(false);
  const [showChatBubble2, setShowChatBubble2] = useState(false);
  const [showChatBubble3, setShowChatBubble3] = useState(false);
  const [showChatBubble4, setShowChatBubble4] = useState(false);
  const [showChatBubble5, setShowChatBubble5] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Show first chat bubble when entering this phase
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChatBubble(true);
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`principal-container ${isFadingOut ? 'fade-out' : ''}`}>
      {/* Tanque quebrado behind human, above cabos (no cabos in this screen) */}
      <img 
        src={TanqueQuebrado} 
        alt="Tanque Quebrado" 
        className="tanque-image" 
      />
      {/* Human image on top - no Cabo images, all phases completed */}
      <img 
        src={Humana} 
        alt="Humana" 
        className="humana-image"
      />

      {/* No phase buttons - all phases completed */}

      {/* First chat bubble */}
      {showChatBubble && (
        <div className="principal-chat-container">
          <ChatBubble
            characterName="Yasmin"
            message="Eu consegui! Destruí o último sistema!"
            characterImage={YasDg}
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
            characterName="???"
            message="O-o quê... onde estou?"
            characterImage={Humana}
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
            characterName="Yasmin"
            message="Quem está falando? Você está aprisionada pela IA?"
            characterImage={YasDg}
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
            characterName="Yasmin"
            message="Pessoal, todos se reúnam na base mãe, agora só precisamos destruir o Cortéx Central e libertar a humanidade! E parece ter uma refém presa no local!"
            characterImage={YasDg}
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
            characterName="Nicolas, Ana Clara, Vitor e Winny"
            message="(Estamos indo!!)"
            characterImage={Grupo}
            onComplete={() => {
              setShowChatBubble5(false);
              // Start fade-out transition
              setIsFadingOut(true);
              // Navigate to interaction page after fade-out completes
              setTimeout(() => {
                navigate('/interaction');
              }, 1500); // 1.5 second delay for smooth transition
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
