import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Game4.css';
import RobotImage from '../assets/robot.png';
import WinnyDg from '../assets/winnyDg.png';
import nonbinaryImage from '../assets/nonbinary.jpg';
import errorImage from '../assets/error.png';
import yesImage from '../assets/yes.png';
import robotHeadImage from '../assets/robotHead.png';
import WinnyHead from '../assets/winnyhead.png';
import completedSound from '../sounds/completed.wav';
import correctSound from '../sounds/correct.wav';
import errorSound from '../sounds/error.mp3';
import soundtrackPhase1 from '../sounds/soundtrackphase1.wav';
import ChatBubble from '../components/ChatBubble';
import PhoneSimulator from '../components/PhoneSimulator';
import BackBtn from '../assets/backbtn.png';
import CellBtn from '../assets/cell.png';

export default function Game4() {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const userAnswerRef = useRef(null);
  const userCalculationRef = useRef(null);
  const aiCalculationRef = useRef(null);
  const userScoreRef = useRef(null);
  const aiScoreRef = useRef(null);
  const gameMessageRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState(90);
  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentUserCalc, setCurrentUserCalc] = useState(null);
  const [currentAiCalc, setCurrentAiCalc] = useState(null);
  const [aiSpeed, setAiSpeed] = useState(1000); // AI answers every 1 second (much faster)
  const [showFirstChat, setShowFirstChat] = useState(false);
  const [showSecondChat, setShowSecondChat] = useState(false);
  const [isGameFrozen, setIsGameFrozen] = useState(true);
  const [currentBackground, setCurrentBackground] = useState(nonbinaryImage);
  const [isAiBugged, setIsAiBugged] = useState(false);
  const [showLossModal, setShowLossModal] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const completedSoundPlayed = useRef(false);
  const backgroundTimeoutRef = useRef(null);
  const soundtrackRef = useRef(null);

  const generateCalculation = () => {
    const a = Math.floor(Math.random() * 10 + 1);
    const b = Math.floor(Math.random() * 10 + 1);
    const op = Math.random() > 0.5 ? '+' : '-';
    const answer = op === '+' ? a + b : a - b;
    return { text: `${a} ${op} ${b}`, answer };
  };

  // Show first chat bubble when entering the game
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFirstChat(true);
    }, 1000); // 1 second delay after component mounts
    
    return () => clearTimeout(timer);
  }, []);

  // Background switching system - error.png every 20s for 10s
  useEffect(() => {
    if (isGameFrozen || gameOver) return;

    const backgroundInterval = setInterval(() => {
      // Switch to error background
      setCurrentBackground(errorImage);
      setIsAiBugged(true);
      
      // Switch back to nonbinary after 10 seconds
      backgroundTimeoutRef.current = setTimeout(() => {
        setCurrentBackground(nonbinaryImage);
        setIsAiBugged(false);
      }, 10000);
    }, 20000); // Every 20 seconds

    return () => {
      clearInterval(backgroundInterval);
      if (backgroundTimeoutRef.current) {
        clearTimeout(backgroundTimeoutRef.current);
        backgroundTimeoutRef.current = null;
      }
    };
  }, [isGameFrozen, gameOver]);

  // Initialize game once when not frozen
  useEffect(() => {
    if (isGameFrozen) return;

    // Initialize calculations only once
    setCurrentUserCalc(generateCalculation());
    setCurrentAiCalc(generateCalculation());
  }, [isGameFrozen]);

  // Timer effect
  useEffect(() => {
    if (isGameFrozen || isGamePaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          // Stop the soundtrack when timer reaches zero
          if (soundtrackRef.current) {
            soundtrackRef.current.pause();
            soundtrackRef.current.currentTime = 0;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameFrozen, isGamePaused]);

  // AI Logic effect - separate from other logic
  useEffect(() => {
    if (isGameFrozen || gameOver || isGamePaused) return;

    const aiTurn = () => {
      if (gameOver || isAiBugged) return; // AI stops when bugged or game over

      // AI gets 10 points for correct answer
      setAiScore(prev => prev + 10);
      setCurrentAiCalc(generateCalculation());
    };

    const aiInterval = setInterval(aiTurn, aiSpeed);

    return () => clearInterval(aiInterval);
  }, [isGameFrozen, isAiBugged, gameOver, aiSpeed, isGamePaused]);

  // User input handler effect
  useEffect(() => {
    if (isGameFrozen || isGamePaused) return;

    const handleUserInput = (e) => {
      if (e.key === 'Enter' && !gameOver) {
        const userAnswer = parseInt(e.target.value);
        setCurrentUserCalc(prev => {
          if (prev && userAnswer === prev.answer) {
            // Correct answer - play correct sound and add points
            const audio = new Audio(correctSound);
            audio.volume = 0.7;
            audio.play().catch(err => console.log('Could not play correct sound:', err));
            setUserScore(score => score + 10);
          } else if (prev) {
            // Wrong answer - play error sound
            const audio = new Audio(errorSound);
            audio.volume = 0.7;
            audio.play().catch(err => console.log('Could not play error sound:', err));
          }
          return generateCalculation();
        });
        e.target.value = '';
      }
    };

    const userInput = userAnswerRef.current;
    if (userInput) {
      userInput.addEventListener('keydown', handleUserInput);
    }

    return () => {
      if (userInput) {
        userInput.removeEventListener('keydown', handleUserInput);
      }
    };
  }, [isGameFrozen, gameOver, isGamePaused]);

  // Cleanup soundtrack on unmount
  useEffect(() => {
    return () => {
      if (soundtrackRef.current) {
        soundtrackRef.current.pause();
        soundtrackRef.current.currentTime = 0;
      }
    };
  }, []);

  // Handle pause/resume for phone modal
  useEffect(() => {
    if (isGamePaused) {
      // Pause the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      // Pause soundtrack
      if (soundtrackRef.current) {
        soundtrackRef.current.pause();
      }
    } else if (!isGameFrozen && !isGamePaused) {
      // Resume the timer
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              setGameOver(true);
              if (soundtrackRef.current) {
                soundtrackRef.current.pause();
                soundtrackRef.current.currentTime = 0;
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
      // Resume soundtrack
      if (soundtrackRef.current && soundtrackRef.current.paused) {
        soundtrackRef.current.play().catch(e => {
          if (e.name !== 'AbortError') {
            console.log('Soundtrack play failed:', e);
          }
        });
      }
    }
  }, [isGamePaused]);

  useEffect(() => {
    if (gameOver && !completedSoundPlayed.current) {
      if (userScore > aiScore) {
        // Player wins - play completed sound, change background to yes.png, and navigate
        completedSoundPlayed.current = true;
        const audio = new Audio(completedSound);
        audio.volume = 0.7;
        audio.play().catch(err => console.log('Could not play completed sound:', err));
        
        setCurrentBackground(yesImage);
        
        // Stop the soundtrack when player wins
        if (soundtrackRef.current) {
          soundtrackRef.current.pause();
          soundtrackRef.current.currentTime = 0;
        }
        
        // Add purple glow effect to calculation containers
        const playerContainer = document.querySelector('.player');
        const aiContainer = document.querySelector('.ai');
        if (playerContainer) playerContainer.classList.add('purple-glow');
        if (aiContainer) aiContainer.classList.add('purple-glow');
        
        // Unlock phase 5 when phase 4 is completed
        const completedPhases = JSON.parse(localStorage.getItem('completedPhases') || '[]');
        if (!completedPhases.includes(4)) {
          completedPhases.push(4);
          localStorage.setItem('completedPhases', JSON.stringify(completedPhases));
        }
        
        // Navigate to animation4 after longer delay (like in game1 and game2)
        setTimeout(() => {
          navigate('/animation4');
        }, 4000); // 4 second delay for better effect
      } else {
        // Player loses - show modal
        setShowLossModal(true);
      }
    }
  }, [gameOver, userScore, aiScore, navigate]);

  useEffect(() => {
    if (userCalculationRef.current && currentUserCalc) {
      userCalculationRef.current.textContent = currentUserCalc.text;
    }
  }, [currentUserCalc]);

  useEffect(() => {
    if (aiCalculationRef.current && currentAiCalc) {
      aiCalculationRef.current.textContent = currentAiCalc.text;
    }
  }, [currentAiCalc]);

  useEffect(() => {
    if (userScoreRef.current) {
      userScoreRef.current.textContent = userScore;
    }
  }, [userScore]);

  useEffect(() => {
    if (aiScoreRef.current) {
      aiScoreRef.current.textContent = aiScore;
    }
  }, [aiScore]);

  const handleFirstChatComplete = () => {
    setShowFirstChat(false);
    setShowSecondChat(true);
  };

  const handleSecondChatComplete = () => {
    setShowSecondChat(false);
    // Unfreeze the game
    setIsGameFrozen(false);
    
    // Start the soundtrack when chat bubble is closed
    if (!soundtrackRef.current) {
      soundtrackRef.current = new Audio(soundtrackPhase1);
      soundtrackRef.current.volume = 0.4;
      soundtrackRef.current.loop = true;
      soundtrackRef.current.play().catch(e => console.log('Could not play soundtrack:', e));
    }
  };

  const handleBackToPrincipal = () => {
    // Stop soundtrack when going back
    if (soundtrackRef.current) {
      soundtrackRef.current.pause();
      soundtrackRef.current.currentTime = 0;
    }
    navigate('/principal3?from=game'); // Go back to principal3.jsx with parameter
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

  const restartGame = () => {
    // Reset all game states first
    setGameOver(false);
    setShowLossModal(false);
    setUserScore(0);
    setAiScore(0);
    setTimeLeft(90);
    setCurrentBackground(nonbinaryImage);
    setIsAiBugged(false);
    setShowFirstChat(false);
    setShowSecondChat(false);
    setIsGameFrozen(false); // Automatically unfreeze the game
    completedSoundPlayed.current = false; // Reset sound played flag
    
    // Clear any pending background timeouts
    if (backgroundTimeoutRef.current) {
      clearTimeout(backgroundTimeoutRef.current);
      backgroundTimeoutRef.current = null;
    }
    
    // Restart the soundtrack
    if (soundtrackRef.current) {
      soundtrackRef.current.currentTime = 0;
      soundtrackRef.current.play().catch(e => console.log('Could not restart soundtrack:', e));
    }
    
    // Small delay to ensure state updates are processed
    setTimeout(() => {
      setCurrentUserCalc(generateCalculation());
      setCurrentAiCalc(generateCalculation());
    }, 100);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game4-container">
      {/* Background image */}
      <img 
        src={currentBackground} 
        alt="Game background" 
        className="game4-background-image"
      />
      
      <button className="back-button" onClick={handleBackToPrincipal}>
        <img src={BackBtn} alt="Voltar" className="back-button-img" />
      </button>

      {/* Phone Button */}
      <button className={`phone-button ${isPhoneOpen ? 'phone-button-overlay' : ''}`} onClick={handlePhoneToggle}>
        <img src={CellBtn} alt="Phone" className="phone-button-img" />
      </button>
      
      <div id="timer" ref={timerRef}>Tempo: {formatTime(timeLeft)}</div>
      
      <div className="game">
        <div className="player">
          <img src={WinnyHead} alt="Winny Head" className="winny-head-image" />
          <div id="user-calculation" ref={userCalculationRef}>---</div>
          <input 
            type="text" 
            id="user-answer" 
            ref={userAnswerRef}
            placeholder="Resposta"
            disabled={gameOver}
          />
          <div>Pontos: <span id="user-score" ref={userScoreRef}>0</span></div>
        </div>

        <div className="ai">
          <div className="ai-header">
            <img 
              src={robotHeadImage} 
              alt="Robot Head" 
              className="robot-head-image"
            />
          </div>
          <div id="ai-calculation" ref={aiCalculationRef}>---</div>
          <div>Pontos: <span id="ai-score" ref={aiScoreRef}>0</span></div>
        </div>
      </div>

      <div id="game-message" ref={gameMessageRef}></div>

      {/* Modal background overlay when game is frozen */}
      {isGameFrozen && (
        <div className="game4-modal-overlay">
          {/* First chat bubble - Robot */}
          {showFirstChat && (
            <div className="game4-chat-container">
              <ChatBubble
                characterName="A Destruidora"
                message="[Ativando Proteção Absoluta] Minhas decisões acontecem em velocidades que a mente humana jamais alcançará. Cada ação de vocês já foi prevista, cada passo calculado. Vocês carregam ego, impulsos, acreditando que podem superar aquilo que não compreendem. Vocês são previsíveis e destinados a falhar!!"
                characterImage={RobotImage}
                onComplete={handleFirstChatComplete}
                typingSpeed={40}
                showDelay={500}
                buttonDelay={1000}
              />
            </div>
          )}

          {/* Second chat bubble - Winny */}
          {showSecondChat && (
            <div className="game4-chat-container">
              <ChatBubble
                characterName="Winny"
                message="Pode ser que sejamos lentos, que nos deixemos guiar pelo ego… mas é isso que nos torna humanos. Sentimentos, intuição, coragem e criatividade — são coisas que nenhum cálculo pode prever. Erramos, aprendemos, reinventamos e nos superamos. E é exatamente por isso que podemos enfrentar até mesmo a inteligência mais fria…e vencer!"
                characterImage={WinnyDg}
                onComplete={handleSecondChatComplete}
                typingSpeed={40}
                showDelay={500}
                buttonDelay={1000}
              />
            </div>
          )}
        </div>
      )}

      {/* Loss Modal */}
      {showLossModal && (
        <div className="game4-modal-overlay">
          <div className="game4-chat-container">
            <div className="message">
              <h1>Tente de novo!</h1>
              <button onClick={restartGame}>Jogar de novo</button>
            </div>
          </div>
        </div>
      )}

      {/* Phone Simulator Modal */}
      <PhoneSimulator
        isOpen={isPhoneOpen}
        onClose={handlePhoneToggle}
        onGamePause={handleGamePause}
        onGameResume={handleGameResume}
        gamePhase={4}
      />
    </div>
  );
}
