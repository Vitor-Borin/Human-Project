import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Game3.css';
import game3bg from '../assets/game3bg.png';
import Real1 from '../assets/Real1.png';
import Real2 from '../assets/Real2.png';
import Real3 from '../assets/Real3.png';
import Real4 from '../assets/Real4.png';
import Real5 from '../assets/Real5.png';
import Real6 from '../assets/Real6.png';
import Real7 from '../assets/Real7.png';
import Real8 from '../assets/Real8.png';
import Real9 from '../assets/Real9.png';
import Real10 from '../assets/Real10.png';
import AI1 from '../assets/AI1.png';
import AI2 from '../assets/AI2.png';
import AI3 from '../assets/AI3.png';
import AI4 from '../assets/AI4.png';
import AI5 from '../assets/AI5.png';
import AI6 from '../assets/AI6.png';
import AI7 from '../assets/AI7.png';
import AI8 from '../assets/AI8.png';
import AI9 from '../assets/AI9.png';
import AI10 from '../assets/AI10.png';
import O from '../assets/O.png';
import X from '../assets/X.png';
import BackBtn from '../assets/backbtn.png';
import frameCorrect from '../assets/frameCorrect.png';
import frameCorrect2 from '../assets/frameCorrect2.png';
import frameWrong from '../assets/frameWrong.png';
import frameWrong2 from '../assets/frameWrong2.png';
import frameNeutral from '../assets/frameNeutral.png';
import frameNeutral2 from '../assets/frameNeutral2.png';
import completedSound from '../sounds/completed.wav';
import correctSound from '../sounds/correct.wav';
import errorSound from '../sounds/error.mp3';
import soundtrackPhase3 from '../sounds/soundtrackphase3.mp3';
import ChatBubble from '../components/ChatBubble';
import PhoneSimulator from '../components/PhoneSimulator';
import VitorDg from '../assets/vitorDg.png';
import Robot from '../assets/robot.png';
import CellBtn from '../assets/cell.png';

export default function Game3() {
  const navigate = useNavigate();
  const [currentRound, setCurrentRound] = useState(1);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(10);
  const [showLossModal, setShowLossModal] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [imagePositions, setImagePositions] = useState({ realOnLeft: true, aiOnLeft: false });
  const [clickedImage, setClickedImage] = useState(null); // Track which image was clicked
  const [isGameFrozen, setIsGameFrozen] = useState(true);
  const [showFirstChat, setShowFirstChat] = useState(true);
  const [showSecondChat, setShowSecondChat] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const soundtrackRef = useRef(null);
  const timerRef = useRef(null);

  // Create 10 rounds of images with random frames
  const imageRounds = [
    { 
      real: Real1, 
      ai: AI1, 
      realNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      aiNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      realCorrectFrame: Math.random() < 0.5 ? frameCorrect : frameCorrect2, 
      aiWrongFrame: Math.random() < 0.5 ? frameWrong : frameWrong2 
    },
    { 
      real: Real2, 
      ai: AI2, 
      realNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      aiNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      realCorrectFrame: Math.random() < 0.5 ? frameCorrect : frameCorrect2, 
      aiWrongFrame: Math.random() < 0.5 ? frameWrong : frameWrong2 
    },
    { 
      real: Real3, 
      ai: AI3, 
      realNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      aiNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      realCorrectFrame: Math.random() < 0.5 ? frameCorrect : frameCorrect2, 
      aiWrongFrame: Math.random() < 0.5 ? frameWrong : frameWrong2 
    },
    { 
      real: Real4, 
      ai: AI4, 
      realNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      aiNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      realCorrectFrame: Math.random() < 0.5 ? frameCorrect : frameCorrect2, 
      aiWrongFrame: Math.random() < 0.5 ? frameWrong : frameWrong2 
    },
    { 
      real: Real5, 
      ai: AI5, 
      realNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      aiNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      realCorrectFrame: Math.random() < 0.5 ? frameCorrect : frameCorrect2, 
      aiWrongFrame: Math.random() < 0.5 ? frameWrong : frameWrong2 
    },
    { 
      real: Real6, 
      ai: AI6, 
      realNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      aiNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      realCorrectFrame: Math.random() < 0.5 ? frameCorrect : frameCorrect2, 
      aiWrongFrame: Math.random() < 0.5 ? frameWrong : frameWrong2 
    },
    { 
      real: Real7, 
      ai: AI7, 
      realNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      aiNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      realCorrectFrame: Math.random() < 0.5 ? frameCorrect : frameCorrect2, 
      aiWrongFrame: Math.random() < 0.5 ? frameWrong : frameWrong2 
    },
    { 
      real: Real8, 
      ai: AI8, 
      realNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      aiNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      realCorrectFrame: Math.random() < 0.5 ? frameCorrect : frameCorrect2, 
      aiWrongFrame: Math.random() < 0.5 ? frameWrong : frameWrong2 
    },
    { 
      real: Real9, 
      ai: AI9, 
      realNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      aiNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      realCorrectFrame: Math.random() < 0.5 ? frameCorrect : frameCorrect2, 
      aiWrongFrame: Math.random() < 0.5 ? frameWrong : frameWrong2 
    },
    { 
      real: Real10, 
      ai: AI10, 
      realNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      aiNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      realCorrectFrame: Math.random() < 0.5 ? frameCorrect : frameCorrect2, 
      aiWrongFrame: Math.random() < 0.5 ? frameWrong : frameWrong2 
    }
  ];

  const [currentImages, setCurrentImages] = useState(imageRounds[0]);

  // Function to randomize image positions
  const randomizePositions = () => {
    const realOnLeft = Math.random() < 0.5;
    setImagePositions({ realOnLeft, aiOnLeft: !realOnLeft });
  };

  // Debug logging and initial setup
  useEffect(() => {
    console.log('Game3 component mounted');
    console.log('Images loaded:', { game3bg, Real1, Real2, Real3, Real4, Real5, Real6, Real7, Real8, Real9, Real10, AI1, AI2, AI3, AI4, AI5, AI6, AI7, AI8, AI9, AI10, O, X, BackBtn });
    console.log('Current state:', { currentRound, lives, timeLeft, currentImages });
    randomizePositions(); // Randomize positions for first round
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameCompleted || showLossModal || isGameFrozen) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - lose a life and advance round
          handleTimeout();
          return 10; // Reset timer for next round
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameCompleted, showLossModal, currentRound, isGameFrozen]);

  // Enable audio context on first user interaction
  useEffect(() => {
    const enableAudio = () => {
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('keydown', enableAudio);
    };

    document.addEventListener('click', enableAudio);
    document.addEventListener('keydown', enableAudio);

    return () => {
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('keydown', enableAudio);
    };
  }, []);

  // Start soundtrack after chat sequence is complete
  useEffect(() => {
    if (!isGameFrozen && !showFirstChat && !showSecondChat) {
      if (!soundtrackRef.current) {
        soundtrackRef.current = new Audio(soundtrackPhase3);
        soundtrackRef.current.loop = true;
        soundtrackRef.current.volume = 0.4;
        soundtrackRef.current.play().catch(e => console.log('Could not play soundtrack:', e));
      }
    }
  }, [isGameFrozen, showFirstChat, showSecondChat]);

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
              handleTimeout();
              return 10;
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

  const handleCorrectAnswer = () => {
    // Play correct sound
    const audio = new Audio(correctSound);
    audio.volume = 0.7;
    audio.play().catch(e => console.log('Could not play correct sound:', e));

    // Show feedback immediately
    setIsCorrectAnswer(true);

    // Check if all rounds completed
    if (currentRound >= 10) {
      // Game completed - all rounds done
      setGameCompleted(true);
      
      // Stop soundtrack
      if (soundtrackRef.current) {
        soundtrackRef.current.pause();
        soundtrackRef.current.currentTime = 0;
      }

      // Play completed sound
      const completedAudio = new Audio(completedSound);
      completedAudio.volume = 0.7;
      completedAudio.play().catch(e => console.log('Could not play completed sound:', e));

      // Unlock phase 4 when phase 3 is completed
      const completedPhases = JSON.parse(localStorage.getItem('completedPhases') || '[]');
      if (!completedPhases.includes(3)) {
        completedPhases.push(3);
        localStorage.setItem('completedPhases', JSON.stringify(completedPhases));
      }

      // Navigate to animation3 after delay
      setTimeout(() => {
        navigate('/animation3');
      }, 3000);
    } else {
      // Move to next round after short delay to show border feedback
      setTimeout(() => {
        // Temporarily disable transition for instant reset
        const timerFill = document.querySelector('.timer-fill');
        if (timerFill) {
          timerFill.style.transition = 'none';
        }
        
        setCurrentRound(prev => prev + 1);
        setCurrentImages(imageRounds[currentRound]); // Next round images
        setTimeLeft(10);
        setIsCorrectAnswer(null);
        setClickedImage(null); // Reset clicked image
        randomizePositions(); // Randomize positions for next round
        
        // Re-enable transition after reset
        setTimeout(() => {
          if (timerFill) {
            timerFill.style.transition = 'width 1s linear';
          }
        }, 50);
      }, 800); // Short delay to show border feedback
    }
  };

  const handleTimeout = () => {
    // Play error sound
    const audio = new Audio(errorSound);
    audio.volume = 0.7;
    audio.play().catch(e => console.log('Could not play error sound:', e));
    
    // Reveal the correct frames for both images
    setIsCorrectAnswer('timeout');
    
    const newLives = lives - 1;
    setLives(newLives);
    
    if (newLives <= 0) {
      // Game over - show loss modal after revealing frames
      setTimeout(() => {
        setShowLossModal(true);
        // Stop soundtrack
        if (soundtrackRef.current) {
          soundtrackRef.current.pause();
          soundtrackRef.current.currentTime = 0;
        }
      }, 2000); // Show frames for 2 seconds before game over
    } else {
      // Check if we're on round 10 - if so, player wins even if they missed it (they have lives left)
      if (currentRound >= 10) {
        // Show glow effect for winning with lives left
        setIsCorrectAnswer(true);
        
        // Game completed - player wins because they have lives left
        setGameCompleted(true);
        
        // Stop soundtrack
        if (soundtrackRef.current) {
          soundtrackRef.current.pause();
          soundtrackRef.current.currentTime = 0;
        }

        // Play completed sound
        const completedAudio = new Audio(completedSound);
        completedAudio.volume = 0.7;
        completedAudio.play().catch(e => console.log('Could not play completed sound:', e));

        // Unlock phase 4 when phase 3 is completed
        const completedPhases = JSON.parse(localStorage.getItem('completedPhases') || '[]');
        if (!completedPhases.includes(3)) {
          completedPhases.push(3);
          localStorage.setItem('completedPhases', JSON.stringify(completedPhases));
        }

        // Navigate to animation3 after delay
        setTimeout(() => {
          navigate('/animation3');
        }, 3000);
      } else {
        // Move to next round after revealing frames
        setTimeout(() => {
          // Temporarily disable transition for instant reset
          const timerFill = document.querySelector('.timer-fill');
          if (timerFill) {
            timerFill.style.transition = 'none';
          }
          
          setCurrentRound(prev => prev + 1);
          setCurrentImages(imageRounds[currentRound]); // Next round images
          setTimeLeft(10);
          setIsCorrectAnswer(null);
          setClickedImage(null); // Reset clicked image
          randomizePositions(); // Randomize positions for next round
          
          // Re-enable transition after reset
          setTimeout(() => {
            if (timerFill) {
              timerFill.style.transition = 'width 1s linear';
            }
          }, 50);
        }, 2000); // Show frames for 2 seconds before next round
      }
    }
  };

  const handleWrongAnswer = () => {
    setIsCorrectAnswer(false);
    
    // Play error sound
    const audio = new Audio(errorSound);
    audio.volume = 0.7;
    audio.play().catch(e => console.log('Could not play error sound:', e));
    
    const newLives = lives - 1;
    setLives(newLives);
    
    if (newLives <= 0) {
      // Game over - show loss modal
      setShowLossModal(true);
      // Stop soundtrack
      if (soundtrackRef.current) {
        soundtrackRef.current.pause();
        soundtrackRef.current.currentTime = 0;
      }
    } else {
      // Check if we're on round 10 - if so, player wins even if they missed it (they have lives left)
      if (currentRound >= 10) {
        // Show glow effect for winning with lives left
        setIsCorrectAnswer(true);
        
        // Game completed - player wins because they have lives left
        setGameCompleted(true);
        
        // Stop soundtrack
        if (soundtrackRef.current) {
          soundtrackRef.current.pause();
          soundtrackRef.current.currentTime = 0;
        }

        // Play completed sound
        const completedAudio = new Audio(completedSound);
        completedAudio.volume = 0.7;
        completedAudio.play().catch(e => console.log('Could not play completed sound:', e));

        // Unlock phase 4 when phase 3 is completed
        const completedPhases = JSON.parse(localStorage.getItem('completedPhases') || '[]');
        if (!completedPhases.includes(3)) {
          completedPhases.push(3);
          localStorage.setItem('completedPhases', JSON.stringify(completedPhases));
        }

        // Navigate to animation3 after delay
        setTimeout(() => {
          navigate('/animation3');
        }, 3000);
      } else {
        // Move to next round after short delay to show wrong frame feedback
        setTimeout(() => {
          // Temporarily disable transition for instant reset
          const timerFill = document.querySelector('.timer-fill');
          if (timerFill) {
            timerFill.style.transition = 'none';
          }
          
          setCurrentRound(prev => prev + 1);
          setCurrentImages(imageRounds[currentRound]); // Next round images
          setTimeLeft(10);
          setIsCorrectAnswer(null);
          setClickedImage(null); // Reset clicked image
          randomizePositions(); // Randomize positions for next round
          
          // Re-enable transition after reset
          setTimeout(() => {
            if (timerFill) {
              timerFill.style.transition = 'width 1s linear';
            }
          }, 50);
        }, 800); // Short delay to show wrong frame feedback
      }
    }
  };

  const handleFirstChatComplete = () => {
    console.log('First chat completed');
    setShowFirstChat(false);
    setShowSecondChat(true);
  };

  const handleSecondChatComplete = () => {
    console.log('Second chat completed');
    setShowSecondChat(false);
    setIsGameFrozen(false);
  };

  const handleImageClick = (isReal, isLeftImage) => {
    if (isCorrectAnswer !== null || isGameFrozen) return; // Prevent multiple clicks or clicks during chat
    
    setClickedImage(isLeftImage ? 'left' : 'right');
    if (isReal) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }
  };

  const restartGame = () => {
    setShowLossModal(false);
    setLives(3);
    setCurrentRound(1);
    setTimeLeft(10);
    setIsCorrectAnswer(null);
    setGameCompleted(false);
    setClickedImage(null);
    
    // Regenerate round 1 images with new random frames
    const newRound1Images = {
      real: Real1,
      ai: AI1,
      realNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      aiNeutralFrame: Math.random() < 0.5 ? frameNeutral : frameNeutral2,
      realCorrectFrame: Math.random() < 0.5 ? frameCorrect : frameCorrect2,
      aiWrongFrame: Math.random() < 0.5 ? frameWrong : frameWrong2
    };
    setCurrentImages(newRound1Images);
    randomizePositions();
    
    // Restart soundtrack
    if (soundtrackRef.current) {
      soundtrackRef.current.currentTime = 0;
      soundtrackRef.current.play().catch(e => console.log('Could not restart soundtrack:', e));
    }
  };

  const handleBackToPrincipal = () => {
    // Stop soundtrack when going back
    if (soundtrackRef.current) {
      soundtrackRef.current.pause();
      soundtrackRef.current.currentTime = 0;
    }
    navigate('/principal2?from=game');
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
    <div className="game3-container">
      

      {/* Voltar button */}
      <button className="back-button" onClick={handleBackToPrincipal}>
        <img src={BackBtn} alt="Voltar" className="back-button-img" />
      </button>

      {/* Phone Button */}
      <button className={`phone-button ${isPhoneOpen ? 'phone-button-overlay' : ''}`} onClick={handlePhoneToggle}>
        <img src={CellBtn} alt="Phone" className="phone-button-img" />
      </button>
      
      {/* Lives indicator */}
      <div className="lives-container">
        {[1, 2, 3].map((life) => (
          <img 
            key={life}
            src={life <= lives ? O : X} 
            alt={life <= lives ? "Life" : "Lost Life"} 
            className="life-icon"
          />
        ))}
      </div>

      {/* Round indicator */}
      <div className="round-indicator">
        Round {currentRound}/10
      </div>

      {/* Game title */}
      <div className="game-title">
        Identifique qual é a imagem real
      </div>


      {/* Game area */}
      <div className="game-area2">
        {/* Left image */}
        <div 
          className={`image-container ${
            currentRound >= 10 && isCorrectAnswer === true ? 'final-glow' : ''
          }`}
          onClick={() => handleImageClick(imagePositions.realOnLeft, true)}
        >
          <div className="image-frame">
            <img 
              src={imagePositions.realOnLeft ? currentImages.real : currentImages.ai} 
              alt={imagePositions.realOnLeft ? "Real Image" : "AI Image"} 
              className="game-image"
              onError={(e) => {
                console.error('Error loading image:', e.target.src);
                e.target.style.display = 'none';
              }}
              onLoad={() => console.log('Image loaded successfully')}
            />
            <img 
              src={
                isCorrectAnswer === 'timeout' ? 
                  (imagePositions.realOnLeft ? 
                    (currentImages.realNeutralFrame === frameNeutral ? frameCorrect2 : frameCorrect) :
                    (currentImages.aiNeutralFrame === frameNeutral ? frameWrong2 : frameWrong)
                  ) :
                clickedImage === 'left' ? 
                  (imagePositions.realOnLeft ? 
                    (isCorrectAnswer === true ? 
                      (currentImages.realNeutralFrame === frameNeutral ? frameCorrect2 : frameCorrect) :
                      (currentImages.realNeutralFrame === frameNeutral ? frameCorrect2 : frameCorrect)
                    ) :
                    (isCorrectAnswer === true ? 
                      (currentImages.aiNeutralFrame === frameNeutral ? frameWrong2 : frameWrong) :
                      (currentImages.aiNeutralFrame === frameNeutral ? frameWrong2 : frameWrong)
                    )
                  ) :
                  (imagePositions.realOnLeft ? currentImages.realNeutralFrame : currentImages.aiNeutralFrame)
              }
              alt="Frame" 
              className="frame-image"
            />
          </div>
        </div>

        {/* Right image */}
        <div 
          className={`image-container ${
            currentRound >= 10 && isCorrectAnswer === true ? 'final-glow' : ''
          }`}
          onClick={() => handleImageClick(!imagePositions.realOnLeft, false)}
        >
          <div className="image-frame">
            <img 
              src={!imagePositions.realOnLeft ? currentImages.real : currentImages.ai} 
              alt={!imagePositions.realOnLeft ? "Real Image" : "AI Image"} 
              className="game-image"
              onError={(e) => {
                console.error('Error loading image:', e.target.src);
                e.target.style.display = 'none';
              }}
              onLoad={() => console.log('Image loaded successfully')}
            />
            <img 
              src={
                isCorrectAnswer === 'timeout' ? 
                  (!imagePositions.realOnLeft ? 
                    (currentImages.realNeutralFrame === frameNeutral ? frameCorrect2 : frameCorrect) :
                    (currentImages.aiNeutralFrame === frameNeutral ? frameWrong2 : frameWrong)
                  ) :
                clickedImage === 'right' ? 
                  (!imagePositions.realOnLeft ? 
                    (isCorrectAnswer === true ? 
                      (currentImages.realNeutralFrame === frameNeutral ? frameCorrect2 : frameCorrect) :
                      (currentImages.realNeutralFrame === frameNeutral ? frameCorrect2 : frameCorrect)
                    ) :
                    (isCorrectAnswer === true ? 
                      (currentImages.aiNeutralFrame === frameNeutral ? frameWrong2 : frameWrong) :
                      (currentImages.aiNeutralFrame === frameNeutral ? frameWrong2 : frameWrong)
                    )
                  ) :
                  (!imagePositions.realOnLeft ? currentImages.realNeutralFrame : currentImages.aiNeutralFrame)
              }
              alt="Frame" 
              className="frame-image"
            />
          </div>
        </div>
      </div>

      {/* Timer progress bar */}
      <div className="timer-container">
        <div className="timer-bar">
          <div 
            className="timer-fill" 
            style={{ width: `${(timeLeft / 10) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Modal background overlay when game is frozen */}
      {isGameFrozen && (
        <div className="game3-modal-overlay">
          {/* First chat bubble - Robot */}
          {showFirstChat && (
            <div className="game3-chat-container">
              <ChatBubble
                characterName="A Destruidora"
                message="Vamos ver se você consegue distinguir o real do artificial… Cada imagem, cada cena, cada detalhe foi criado para enganar sua mente humana limitada. Vocês não enxergam o mundo como ele realmente é. Se não conseguem distinguir o que é verdadeiro do que é simulado, não passarão desse sistema."
                characterImage={Robot}
                onComplete={handleFirstChatComplete}
                typingSpeed={40}
                showDelay={500}
                buttonDelay={1000}
              />
            </div>
          )}

          {/* Second chat bubble - Vitor */}
          {showSecondChat && (
            <div className="game3-chat-container">
              <ChatBubble
                characterName="Vitor"
                message="A realidade não é apenas o que vemos… É o que sentimos, é a intuição, é o coração humano que dá sentido ao que os olhos não conseguem captar. Nós podemos errar, mas também podemos enxergar além da aparência, aprender, sentir e transformar. E é isso que nos torna fortes, únicos… e invencíveis."
                characterImage={VitorDg}
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
        <div className="game3-modal-overlay">
          <div className="game3-chat-container">
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
        gamePhase={3}
      />
    </div>
  );
}