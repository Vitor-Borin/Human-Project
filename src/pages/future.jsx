import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './future.css';
import typingSound from '../sounds/typing.wav';

export default function Future() {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const typingAudioRef = useRef(null);

  const texts = [
    "Helena foi perdoada, mas não sem consequências. Cumpriu alguns anos de serviço comunitário, ajudando aqueles que haviam sido afetados direta ou indiretamente por suas ações — e, para sua surpresa, descobriu que ajudar os outros a fazia sentir-se viva novamente, com propósito. Enquanto isso, o mundo começava a se reconstruir. O controle da IA maligna havia chegado ao fim, e a humanidade finalmente respirava livre do peso de uma inteligência que quase a aprisionou.", 
    
    "O governo e as organizações internacionais passaram a criar novas leis e protocolos rigorosos, medidas de prevenção e supervisão, para garantir que uma tragédia como essa jamais se repetisse. Aprenderam que o avanço tecnológico precisa sempre andar lado a lado com a ética, a responsabilidade e a humanidade.", 
    
    "Nossos heróis receberam homenagens imortais: estátuas erguidas em suas cidades, medalhas de honra entregues, e seus nomes gravados na história como aqueles que se recusaram a desistir quando tudo parecia perdido. Cada um deles havia provado que a coragem, a empatia e a determinação humana são forças capazes de superar até os sistemas mais perfeitos e calculistas.",

    "Helena, por fim, reconectou-se com sua família, sentindo novamente o calor daquilo que mais amava. Aos poucos, a vida retomava seu curso, cheia de pequenas alegrias, esperança e a promessa de um futuro melhor. Ela sabia que, apesar do passado sombrio, havia encontrado redenção — e, junto dela, o mundo havia encontrado a chance de começar de novo.",

    "E assim, a humanidade aprendeu uma lição valiosa: mesmo diante de máquinas, de poder e de caos, o que nos torna verdadeiramente fortes é aquilo que carregamos em nossos corações.",

    "O fim."
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
            // All phrases done, navigate to credits page with delay
            setTimeout(() => {
              navigate('/credits');
            }, 3000); // 3 second delay after last phrase
          }
        }, 1000);
        
        return () => clearTimeout(fadeTimer);
      }, 2000); // Wait 2 seconds before fading
      
      return () => clearTimeout(waitTimer);
    }
  }, [charIndex, textIndex, isFading, texts, navigate]);

  return (
    <div className="future-page">
      <div className="container">
        <h1 className={`text ${isFading ? 'fade-out' : ''}`}>
          {displayText}
        </h1>
      </div>
    </div>
  );
}
