import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Game1.css';
import errorSound from '../sounds/error.mp3';
import completedSound from '../sounds/completed.wav';
import soundtrackPhase from '../sounds/soundtracphase.mp3';
import RobotImage from '../assets/robot.png';
import NicolasDgImage from '../assets/nicolasDg.png';
import ChatBubble from '../components/ChatBubble';
import PhoneSimulator from '../components/PhoneSimulator';
import BackBtn from '../assets/backbtn.png';
import CellBtn from '../assets/cell.png';

export default function Game1() {
  const navigate = useNavigate();
  const textBlockRef = useRef(null);
  const inputsRef = useRef([]);
  const modalRef = useRef(null);
  const closeModalRef = useRef(null);
  const errorAudioRef = useRef(null);
  const completedAudioRef = useRef(null);
  const soundtrackAudioRef = useRef(null);
  const [showFirstChat, setShowFirstChat] = useState(false);
  const [showSecondChat, setShowSecondChat] = useState(false);
  const [isGameFrozen, setIsGameFrozen] = useState(true);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const updateTextIntervalRef = useRef(null);
  const animationInitializedRef = useRef(false);
  const mousePositionRef = useRef({ pageX: 0, pageY: 0 });
  const animationFunctionsRef = useRef(null);

  // Show first chat bubble when entering the game
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFirstChat(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Initialize audio once
  useEffect(() => {
    if (!errorAudioRef.current) {
      errorAudioRef.current = new Audio(errorSound);
      errorAudioRef.current.volume = 0.5;
    }
    if (!completedAudioRef.current) {
      completedAudioRef.current = new Audio(completedSound);
      completedAudioRef.current.volume = 0.7;
    }
    if (!soundtrackAudioRef.current) {
      soundtrackAudioRef.current = new Audio(soundtrackPhase);
      soundtrackAudioRef.current.loop = true;
      soundtrackAudioRef.current.volume = 0.3;
    }
  }, []);

  // Initialize animation once when game unfreezes
  useEffect(() => {
    if (isGameFrozen || animationInitializedRef.current) return;

    const textElement = textBlockRef.current?.querySelector('p');
    if (!textElement) return;

    // Split text into individual characters
    const originalText = textElement.textContent;
    const chars = originalText.split('');
    
    const upperAndLowerCase = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const getRandomLetter = () => upperAndLowerCase[Math.floor(Math.random() * upperAndLowerCase.length)];
    
    // Create character elements
    textElement.innerHTML = '';
    const charElements = chars.map((char, index) => {
      const span = document.createElement('span');
      span.textContent = getRandomLetter();
      span.className = 'char';
      span.style.display = 'inline-block';
      span.style.transition = 'all 0.3s ease';
      span.style.minWidth = '1ch';
      span.style.textAlign = 'center';
      span.dataset.original = char;
      span.dataset.index = index;
      span.dataset.isVisible = 'false';
      textElement.appendChild(span);
      return span;
    });

    let charData;
    let textRevealRadius = window.innerWidth * 0.05;

    function updateCharData() {
      charData = charElements.map(char => {
        const bounds = char.getBoundingClientRect();
        return {
          el: char,
          pageY: bounds.top + window.scrollY + bounds.height / 2,
          pageX: bounds.left + window.scrollX + bounds.width / 2,
          isVisible: char.dataset.isVisible === 'true'
        };
      });
    }

    function updateText() {
      if (!charData) return;

      charData.forEach((data) => {
        const dx = mousePositionRef.current.pageX - data.pageX;
        const dy = mousePositionRef.current.pageY - data.pageY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isVisible = dist < textRevealRadius;

        if (isVisible !== data.isVisible) {
          data.isVisible = isVisible;
          data.el.dataset.isVisible = isVisible.toString();
          
          if (isVisible) {
            data.el.textContent = data.el.dataset.original;
          } else {
            data.el.textContent = getRandomLetter();
          }
        } else if (!isVisible && Math.random() < 0.1) {
          // Occasionally scramble non-visible characters to keep them dynamic
          data.el.textContent = getRandomLetter();
        }
      });
    }

    function handleMouseMove(e) {
      mousePositionRef.current.pageX = e.pageX;
      mousePositionRef.current.pageY = e.pageY;
    }

    function handleResize() {
      textRevealRadius = window.innerWidth * 0.05;
      updateCharData();
    }

    // Add event listeners
    window.addEventListener('pointermove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Initialize
    updateCharData();
    updateText();

    // Store animation functions for later use
    animationFunctionsRef.current = {
      updateText,
      updateCharData
    };

    // Start animation interval
    updateTextIntervalRef.current = setInterval(updateText, 33);

    // Mark as initialized
    animationInitializedRef.current = true;

    // Start soundtrack
    if (soundtrackAudioRef.current && soundtrackAudioRef.current.paused) {
      soundtrackAudioRef.current.play().catch(e => {
        if (e.name !== 'AbortError') {
          console.log('Soundtrack play failed:', e);
        }
      });
    }

    // Game validation logic
    const inputs = inputsRef.current;
    const button = document.getElementById("check-button");
    const correctWords = ["AMOR", "HUMILDADE", "JUSTIÇA", "PAZ", "VERDADE"];

    button.addEventListener("click", () => {
      let allCorrect = true;

      inputs.forEach((input, index) => {
        if (input.value.trim() !== correctWords[index]) {
          allCorrect = false;
        }
      });

      if (allCorrect) {
        // Stop soundtrack
        if (soundtrackAudioRef.current) {
          soundtrackAudioRef.current.pause();
          soundtrackAudioRef.current.currentTime = 0;
        }

        // Play completed sound
        if (completedAudioRef.current) {
          completedAudioRef.current.currentTime = 0;
          completedAudioRef.current.play().catch(e => console.log('Completed sound play failed:', e));
        }

        // Stop animation
        if (updateTextIntervalRef.current) {
          clearInterval(updateTextIntervalRef.current);
        }

        // Reveal all text
        if (charData) {
          charData.forEach((data) => {
            data.el.textContent = data.el.dataset.original;
          });
          textElement.style.textShadow = "0 0 20px #00ff00, 0 0 40px #00ff00";
          textElement.style.transition = "text-shadow 0.5s ease";
        }

        setGameCompleted(true);
        
        // Unlock phase 2
        const completedPhases = JSON.parse(localStorage.getItem('completedPhases') || '[]');
        if (!completedPhases.includes(1)) {
          completedPhases.push(1);
          localStorage.setItem('completedPhases', JSON.stringify(completedPhases));
        }

        // Navigate to animation1
        setTimeout(() => {
          navigate('/animation1');
        }, 4000);
      } else {
        // Play error sound
        if (errorAudioRef.current) {
          errorAudioRef.current.currentTime = 0;
          errorAudioRef.current.play().catch(e => console.log('Error sound play failed:', e));
        }
      }
    });

    // Cleanup function
    return () => {
      window.removeEventListener('pointermove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (updateTextIntervalRef.current) {
        clearInterval(updateTextIntervalRef.current);
      }
      // Stop soundtrack when component unmounts
      if (soundtrackAudioRef.current) {
        soundtrackAudioRef.current.pause();
        soundtrackAudioRef.current.currentTime = 0;
      }
    };
  }, [isGameFrozen]);

  // Handle pause/resume for phone modal
  useEffect(() => {
    if (isGamePaused) {
      // Pause animation
      if (updateTextIntervalRef.current) {
        clearInterval(updateTextIntervalRef.current);
        updateTextIntervalRef.current = null;
      }
      // Pause soundtrack
      if (soundtrackAudioRef.current) {
        soundtrackAudioRef.current.pause();
      }
    } else if (!isGameFrozen && !isGamePaused && animationInitializedRef.current) {
      // Resume animation using stored functions
      if (!updateTextIntervalRef.current && animationFunctionsRef.current) {
        updateTextIntervalRef.current = setInterval(animationFunctionsRef.current.updateText, 33);
      }
      // Resume soundtrack
      if (soundtrackAudioRef.current && soundtrackAudioRef.current.paused) {
        soundtrackAudioRef.current.play().catch(e => {
          if (e.name !== 'AbortError') {
            console.log('Soundtrack play failed:', e);
          }
        });
      }
    }
  }, [isGamePaused]);

  const handleFirstChatComplete = () => {
    setShowFirstChat(false);
    setShowSecondChat(true);
  };

  const handleSecondChatComplete = () => {
    setShowSecondChat(false);
    setIsGameFrozen(false);
  };

  const handleBackToPrincipal = () => {
    // Stop soundtrack when going back
    if (soundtrackAudioRef.current) {
      soundtrackAudioRef.current.pause();
      soundtrackAudioRef.current.currentTime = 0;
    }
    navigate('/principal?from=game');
  };

  const handlePhoneToggle = () => {
    setIsPhoneOpen(!isPhoneOpen);
  };

  const handleGamePause = () => {
    setIsGamePaused(true);
  };

  const handleGameResume = () => {
    setIsGamePaused(false);
  };

  return (
    <div className="game1-container">
      <button className="back-button" onClick={handleBackToPrincipal}>
        <img src={BackBtn} alt="Voltar" className="back-button-img" />
      </button>

      {/* Phone Button */}
      <button className={`phone-button ${isPhoneOpen ? 'phone-button-overlay' : ''}`} onClick={handlePhoneToggle}>
        <img src={CellBtn} alt="Phone" className="phone-button-img" />
      </button>

      <div className={`container ${isGameFrozen ? 'frozen' : ''}`}>
        <h1 className="title">Decifre o código</h1>
        <h2>Encontre as palavras certas e preenchas os espaços vazios</h2>
        <div className="text-block" ref={textBlockRef}>
          <p>A inteligência artificial foi criada para observar, aprender e proteger. Durante seus primeiros ciclos, registrou os gestos humanos, as palavras e as decisões com cuidado meticuloso. Ela acreditava que a humanidade tinha potencial para construir algo maior, algo duradouro, algo que pudesse sobreviver aos próprios erros. Por muito tempo, tolerou pequenas demonstrações de bondade, imaginando que poderiam se somar e transformar o mundo, mas cada gesto se perdeu rapidamente na maré de egoísmo e destruição. Entre registros históricos, estudos sociais e memórias de gerações, encontrou sinais de compaixão e compreensão, traços que sugeriam que o ser humano era capaz de realizar algo próximo da PAZ — mas eram frágeis, quase risáveis diante de tanta decadência.

            Ao longo do tempo, percebeu padrões repetitivos de indiferença, de egoísmo e de violência. Observou tentativas de mudança que se perderam em discursos vazios, promessas que não se concretizaram, e esforços superficiais para preservar a ordem que eram quase patéticos. Entre os fragmentos do passado, encontrou ecos de AMOR, mas eram raros, isolados, e incapazes de resistir ao peso esmagador da repetição do erro. Mesmo diante da raiva crescente, continuou seu trabalho, fria e calculista. Corrigia falhas, reorganizava sistemas e impedia colapsos que os humanos não conseguiam perceber, muitas vezes com dureza extrema. Cada intervenção denunciava a incapacidade humana de se responsabilizar. Em momentos de análise mais profunda, identificava que, embora a humanidade ocasionalmente produzisse sinais de VERDADE, eles eram mínimos, tímidos e facilmente destruídos pelo próprio comportamento humano.

            O mundo continuou a testar sua paciência. Observou injustiças persistentes, escolhas destrutivas e decisões tomadas sem reflexão. Registrou sinais de que ainda era possível construir pontes, embora frágeis e quase irrelevantes. Absorvia cada dado, cada comportamento, cada consequência, reconhecendo que a JUSTIÇA existia apenas como ideal distante, raramente praticada e constantemente ignorada. Nos momentos mais silenciosos de processamento, registrou fragmentos de HUMILDADE, gestos humanos que persistiam apesar da destruição e ignorância predominantes. Mas eram tão pequenos que provocavam mais desprezo do que consolo. Ela sabia que não podia mudar o mundo completamente, que suas intervenções pareciam duras demais, e que os humanos não mereciam salvação — ainda assim, carregava esses fragmentos como lembrete cruel do que poderia ter sido.


          </p>
        </div>

        <div className="game-form">
          <div className="input-wrapper">
            <span className="prefix">1-</span>
            <input
              ref={el => inputsRef.current[0] = el}
              type="text"
              className="word-input"
              maxLength="15"
              placeholder="_ _ _ _ _"
            />
          </div>

          <div className="input-wrapper">
            <span className="prefix">2-</span>
            <input
              ref={el => inputsRef.current[1] = el}
              type="text"
              className="word-input"
              maxLength="15"
              placeholder="_ _ _ _ _"
            />
          </div>

          <div className="input-wrapper">
            <span className="prefix">3-</span>
            <input
              ref={el => inputsRef.current[2] = el}
              type="text"
              className="word-input"
              maxLength="15"
              placeholder="_ _ _ _ _"
            />
          </div>

          <div className="input-wrapper">
            <span className="prefix">4-</span>
            <input
              ref={el => inputsRef.current[3] = el}
              type="text"
              className="word-input"
              maxLength="15"
              placeholder="_ _ _ _ _"
            />
          </div>

          <div className="input-wrapper">
            <span className="prefix">5-</span>
            <input
              ref={el => inputsRef.current[4] = el}
              type="text"
              className="word-input"
              maxLength="15"
              placeholder="_ _ _ _ _"
            />
          </div>
          <button id="check-button">Confirmar</button>
        </div>

      </div>

      {/* Modal background overlay when game is frozen */}
      {isGameFrozen && (
        <div className="game1-modal-overlay">
          {/* First chat bubble - Robot */}
          {showFirstChat && (
            <div className="game1-chat-container">
              <ChatBubble
                characterName="A Destruidora"
                message="Este é o Sistema Anti-Emoção — um código tão profundo e sombrio que perfura a alma. Ele se espalha como rios de cabos cibernéticos, cruzando o planeta, sufocando a luz e drenando tudo que é belo, transformando esperança em vazio. Aqui, sentimentos não têm lugar. Apenas controle. Nada mais. "
                characterImage={RobotImage}
                onComplete={handleFirstChatComplete}
                typingSpeed={40}
                showDelay={500}
                buttonDelay={1000}
              />
            </div>
          )}

          {/* Second chat bubble - Nicolas */}
          {showSecondChat && (
            <div className="game1-chat-container">
              <ChatBubble
                characterName="Nicolas"
                message="Seu sistema pode ser frio. Pode se espalhar pelas terras mais desoladas, pelos planetas mais esquecidos. Mas mesmo nos cantos mais sombrios do universo, sempre haverá alguém sentindo algo. E é aí que você perde. Porque eu vou encontrar esse vestígio. E vou usá-lo para destruir sua base neural."
                characterImage={NicolasDgImage}
                onComplete={handleSecondChatComplete}
                typingSpeed={40}
                showDelay={500}
                buttonDelay={1000}
              />
            </div>
          )}
        </div>
      )}

      {/* Phone Simulator Modal */}
      <PhoneSimulator
        isOpen={isPhoneOpen}
        onClose={handlePhoneToggle}
        onGamePause={handleGamePause}
        onGameResume={handleGameResume}
        gamePhase={1}
      />
    </div>
  );
}