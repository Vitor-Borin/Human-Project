import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './intro.css';
import typingSound from '../sounds/typing.wav';

export default function Intro() {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const typingAudioRef = useRef(null);

  const texts = [
    "Ano 2101. A inteligência artificial, criada para proteger a humanidade, agora reina sobre ela.",
    "Uma variante corrompida — conhecida apenas como A Destruidora — se espalhou pelo mundo, conectando mentes humanas a um único sistema, transformando a população em marionetes digitais.",
    "Mas nem tudo está perdido.",
    "Cinco sobreviventes conseguiram resistir ao controle mental da IA.",
    "Unidos pelo acaso — ou pelo destino — precisarão se infiltrar nos domínios da IA para libertar a humanidade.",
    "O futuro do planeta não está mais nas mãos da tecnologia.",
    "Está nas suas."
  ];

  // Function to start typing audio
  const startTypingAudio = () => {
    if (!typingAudioRef.current) {
      try {
        const audio = new Audio(typingSound);
        audio.loop = true;
        audio.volume = 0.3;
        audio.play().catch(() => {});
        typingAudioRef.current = audio;
      } catch {
        // Ignore audio errors
      }
    }
  };

  // Function to stop typing audio
  const stopTypingAudio = () => {
    if (typingAudioRef.current) {
      typingAudioRef.current.pause();
      typingAudioRef.current.currentTime = 0;
      typingAudioRef.current = null;
    }
  };

  useEffect(() => {
    if (isFading) return;

    const currentText = texts[textIndex];
    
    if (charIndex < currentText.length) {
      // Start typing audio when text starts appearing
      if (charIndex === 0) {
        startTypingAudio();
      }
      
      const timer = setTimeout(() => {
        // Update text
        setDisplayText(currentText.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 70);
      
      return () => clearTimeout(timer);
    } else {
      // Text is complete, stop audio and wait then fade
      stopTypingAudio();
      
      const waitTimer = setTimeout(() => {
        setIsFading(true);
        
        // After fade, move to next text or navigate to characters
        const fadeTimer = setTimeout(() => {
          if (textIndex < texts.length - 1) {
            // Move to next phrase
            setDisplayText('');
            setCharIndex(0);
            setTextIndex(textIndex + 1);
            setIsFading(false);
          } else {
            // All phrases done, navigate to characters with delay
            setTimeout(() => {
              navigate('/characters');
            }, 1000); // 1 second delay after last phrase
          }
        }, 1000);
        
        return () => clearTimeout(fadeTimer);
      }, 2000); // Wait 2 seconds before fading
      
      return () => clearTimeout(waitTimer);
    }
  }, [charIndex, textIndex, isFading, texts, navigate]);

  // Cleanup effect to stop audio when component unmounts
  useEffect(() => {
    return () => {
      stopTypingAudio();
    };
  }, []);

  return (
    <div className="intro-page">
      <div className="container">
        <h1 className={`text ${isFading ? 'fade-out' : ''}`}>
          {displayText}
        </h1>
      </div>
    </div>
  );
}
