import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Game2.css';
import RobotImage from '../assets/robot.png';
import Ana from '../assets/ana.png';
import ChatBubble from '../components/ChatBubble';
import PhoneSimulator from '../components/PhoneSimulator';
import BackBtn from '../assets/backbtn.png';
import CellBtn from '../assets/cell.png';
import completedSound from '../sounds/completed.wav';
import soundtrackPiano from '../sounds/SoundtrackPiano.wav';
import doSound from '../sounds/do.wav';
import reSound from '../sounds/re.wav';
import miSound from '../sounds/mi.wav';
import faSound from '../sounds/fa.wav';
import solSound from '../sounds/sol.wav';
import laSound from '../sounds/la.wav';
import siSound from '../sounds/si.wav';
import do5Sound from '../sounds/do5.wav';
import re5Sound from '../sounds/re5.m4a';
import mi5Sound from '../sounds/mi5.m4a';

export default function Game2() {
  const navigate = useNavigate();
  const gameAreaRef = useRef(null);
  const fallingNotesRef = useRef(null);
  const scoreDisplayRef = useRef(null);
  const overlayRef = useRef(null);
  const resultTextRef = useRef(null);
  const soundtrackRef = useRef(null);
  const noteIntervalRef = useRef(null);
  const animationFramesRef = useRef(new Set());
  const gameFunctionsRef = useRef(null);
  const gameTimerRef = useRef(null);
  const timerStartTimeRef = useRef(null);
  const timerRemainingTimeRef = useRef(60000);
  const [showFirstChat, setShowFirstChat] = useState(false);
  const [showSecondChat, setShowSecondChat] = useState(false);
  const [isGameFrozen, setIsGameFrozen] = useState(true);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const isGamePausedRef = useRef(false);

  const notes = ['1','2','3','4','5','6','7','8','9','0'];
  const noteColors = ['#FF31D9', '#31FF87', '#00FFF2', '#7300FF', '#001FEB'];
  
  // Sound mapping for each tile
  const noteSounds = {
    '1': doSound,
    '2': reSound,
    '3': miSound,
    '4': faSound,
    '5': solSound,
    '6': laSound,
    '7': siSound,
    '8': do5Sound,
    '9': re5Sound,
    '0': mi5Sound
  };

  // Show first chat bubble when entering the game
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFirstChat(true);
    }, 1000); // 1 second delay after component mounts
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only initialize game when not frozen
    if (isGameFrozen) return;

    // Initialize and start the soundtrack
    if (!soundtrackRef.current) {
      soundtrackRef.current = new Audio(soundtrackPiano);
      soundtrackRef.current.volume = 0.6; // Increased volume for better audio experience
      soundtrackRef.current.loop = true; // Loop the soundtrack
      soundtrackRef.current.play().catch(e => console.log('Could not play soundtrack:', e));
    }

    const keys = document.querySelectorAll('.key');
    const fallingNotes = fallingNotesRef.current;
    const scoreDisplay = scoreDisplayRef.current;
    const overlay = overlayRef.current;
    const resultText = resultTextRef.current;
    
    let score = 0;
    let targetScore = 500;
    let gameOver = false;

    const keyPositions = {
      '1': 0, '2': 1, '3': 2, '4': 3, '5': 4,
      '6': 5, '7': 6, '8': 7, '9': 8, '0': 9
    };

    function createFallingNote() {
      if (gameOver || isGamePausedRef.current) return;
      
      // Create 1-3 notes randomly (can be 1, 2, or 3 notes at once)
      const numNotes = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3 notes
      const usedPositions = new Set(); // Track used positions to avoid duplicates
      
      for (let i = 0; i < numNotes; i++) {
        let note, position;
        
        // Find an unused position
        do {
          note = notes[Math.floor(Math.random() * notes.length)];
          position = keyPositions[note];
        } while (usedPositions.has(position));
        
        usedPositions.add(position);
        
        const color = noteColors[Math.floor(Math.random() * noteColors.length)];
        const fallingNote = document.createElement('div');
        fallingNote.classList.add('falling-note');
        fallingNote.dataset.note = note;
        fallingNote.dataset.color = color;
        fallingNote.style.left = `${position * (100 / notes.length)}%`;
        fallingNote.style.width = `${100 / notes.length}%`;
        fallingNote.style.backgroundColor = color;
        fallingNotes.appendChild(fallingNote);

        // Animate each note independently
        let start = Date.now();
        const duration = 5000; // 5s para cair
        let animationId;
        
        function animate() {
          // Check if game is paused using ref for real-time updates
          if (isGamePausedRef.current) {
            // If paused, don't continue animation but don't remove the note
            // Just schedule the next frame to check again
            animationId = requestAnimationFrame(animate);
            animationFramesRef.current.add(animationId);
            return;
          }
          
          let elapsed = Date.now() - start;
          let progress = elapsed / duration;
          if (progress > 1) progress = 1;
          // Stop at green hit line (120px from bottom)
          const gameAreaHeight = gameAreaRef.current?.offsetHeight || 400;
          const hitLineHeight = 120; // Height from bottom where hit line is
          const maxTopPercent = ((gameAreaHeight - hitLineHeight) / gameAreaHeight) * 100;
          
          if (progress * 100 >= maxTopPercent) {
            fallingNote.style.top = `${maxTopPercent}%`;
          } else {
            fallingNote.style.top = `${progress * 100}%`;
          }
          if (progress < 1) {
            animationId = requestAnimationFrame(animate);
            animationFramesRef.current.add(animationId);
          } else {
            fallingNote.remove();
            if (animationId) {
              animationFramesRef.current.delete(animationId);
            }
          }
        }
        animationId = requestAnimationFrame(animate);
        animationFramesRef.current.add(animationId);
      }
    }

    // Store game functions for pause/resume
    gameFunctionsRef.current = {
      createFallingNote
    };

    // Criar notas a cada 1.5s
    noteIntervalRef.current = setInterval(createFallingNote, 1500);

    // Função para tocar tecla (teclado ou clique)
    function pressKey(key) {
      if (!notes.includes(key) || gameOver) return;
      
      const noteElement = document.querySelector(`[data-note="${key}"]`);
      if (noteElement) {
        // Add gray color effect
        noteElement.classList.add('active');
        setTimeout(() => noteElement.classList.remove('active'), 150);
      }
      
      // Also highlight the piano key
      const pianoKey = document.querySelector(`.key[data-note="${key}"]`);
      if (pianoKey) {
        pianoKey.classList.add('pressed');
        setTimeout(() => pianoKey.classList.remove('pressed'), 150);
      }

      // Verificar acertos
      const falling = document.querySelectorAll('.falling-note');
      let hitSuccessful = false;
      
      falling.forEach(note => {
        const noteRect = note.getBoundingClientRect();
        const lineRect = document.querySelector('.hit-line').getBoundingClientRect();
        if (
          note.dataset.note === key &&
          Math.abs(noteRect.top + noteRect.height - lineRect.top) < 25
        ) {
          // Play the corresponding note sound only when hit is successful
          const soundFile = noteSounds[key];
          if (soundFile) {
            const audio = new Audio(soundFile);
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Could not play note sound:', e));
          }
          
          // Pink notes (#FF31D9) are worth 15 points, others are 5 points
          const points = note.dataset.color === '#FF31D9' ? 20 : 10;
          score += points;
          scoreDisplay.textContent = `${score}/${targetScore} points`;
          note.remove();
          hitSuccessful = true;

          if (score >= targetScore) {
            console.log('Score reached target! Calling endGame(true)');
            endGame(true);
          }
        }
      });
    }

    // Eventos de teclado
    const handleKeyDown = (event) => {
      pressKey(event.key.toUpperCase());
    };

    document.addEventListener('keydown', handleKeyDown);

    // Eventos de clique do mouse
    keys.forEach(k => {
      k.addEventListener('click', () => {
        pressKey(k.dataset.note);
      });
    });

    // Fim de jogo
    function endGame(win) {
      gameOver = true;
      clearInterval(noteIntervalRef.current);
      clearTimeout(gameTimerRef.current);
      
      // Stop the soundtrack
      if (soundtrackRef.current) {
        soundtrackRef.current.pause();
        soundtrackRef.current.currentTime = 0; // Reset to beginning
      }
      
      if (win) {
        console.log('Game2 won! Starting win sequence...');
        
        // Play completed sound
        const audio = new Audio(completedSound);
        audio.volume = 0.7;
        audio.play().catch(e => console.log('Could not play sound:', e));
        
        // Add pink glow effect to game elements (safer approach)
        setTimeout(() => {
          try {
            const piano = document.querySelector('.piano');
            const hitLine = document.querySelector('.hit-line');
            const verticalLines = document.querySelectorAll('.vertical-line');
            const score = document.querySelector('.score');
            
            if (piano) piano.classList.add('pink-glow');
            if (hitLine) hitLine.classList.add('pink-glow');
            if (score) score.classList.add('pink-glow');
            verticalLines.forEach(line => line.classList.add('pink-glow'));
          } catch (e) {
            console.log('Glow effect error (non-critical):', e);
          }
        }, 100);
        
        // Unlock phase 3 when phase 2 is completed
        const completedPhases = JSON.parse(localStorage.getItem('completedPhases') || '[]');
        if (!completedPhases.includes(2)) {
          completedPhases.push(2);
          localStorage.setItem('completedPhases', JSON.stringify(completedPhases));
        }
        
        // Navigate to animation2 after a delay
        setTimeout(() => {
          console.log('Game2 navigating to animation2...');
          navigate('/animation2');
        }, 3000); // 3 second delay to see the glow effect
      } else {
        // Show try again modal only when losing
        overlay.classList.remove('hidden');
        resultText.textContent = "Tente de novo!";
      }
    }

    // Timer de jogo (60s para dar tempo de completar 200 pontos)
    timerStartTimeRef.current = Date.now();
    gameTimerRef.current = setTimeout(() => {
      if (!gameOver) {
        if (score >= 500) {
          endGame(true);
        } else {
          endGame(false);
        }
      }
    }, timerRemainingTimeRef.current);

    // Make endGame globally accessible
    window.endGame = endGame;

    // Reiniciar jogo
    window.restartGame = function() {
      score = 0;
      scoreDisplay.textContent = `${score}/${targetScore} points`;
      overlay.classList.add('hidden');
      gameOver = false;
      fallingNotes.innerHTML = ""; // limpa notas antigas
      noteInterval = setInterval(createFallingNote, 1000);
      
      // Reset timer
      clearTimeout(gameTimerRef.current);
      timerRemainingTimeRef.current = 60000;
      timerStartTimeRef.current = Date.now();
      gameTimerRef.current = setTimeout(() => {
        if (!gameOver) {
          if (score >= 500) {
            endGame(true);
          } else {
            endGame(false);
          }
        }
      }, timerRemainingTimeRef.current);
      
      // Restart the soundtrack
      if (soundtrackRef.current) {
        soundtrackRef.current.currentTime = 0;
        soundtrackRef.current.play().catch(e => console.log('Could not restart soundtrack:', e));
      }
    };

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(noteIntervalRef.current);
      if (gameTimerRef.current) {
        clearTimeout(gameTimerRef.current);
      }
      // Stop soundtrack on cleanup
      if (soundtrackRef.current) {
        soundtrackRef.current.pause();
        soundtrackRef.current.currentTime = 0;
      }
    };
  }, [isGameFrozen, navigate]);

  // Handle pause/resume for phone modal
  useEffect(() => {
    isGamePausedRef.current = isGamePaused;
    
    if (isGamePaused) {
      // Pause the game - stop creating new notes
      if (noteIntervalRef.current) {
        clearInterval(noteIntervalRef.current);
        noteIntervalRef.current = null;
      }
      // Pause timer
      if (gameTimerRef.current) {
        clearTimeout(gameTimerRef.current);
        // Calculate remaining time
        const elapsed = Date.now() - timerStartTimeRef.current;
        timerRemainingTimeRef.current = Math.max(0, timerRemainingTimeRef.current - elapsed);
        gameTimerRef.current = null;
      }
      // Don't cancel animation frames - let existing notes continue falling
      // Pause soundtrack
      if (soundtrackRef.current) {
        soundtrackRef.current.pause();
      }
    } else if (!isGameFrozen && !isGamePaused) {
      // Resume the game - restart creating notes using stored function
      if (!noteIntervalRef.current && gameFunctionsRef.current) {
        noteIntervalRef.current = setInterval(gameFunctionsRef.current.createFallingNote, 1500);
      }
      // Resume timer
      if (!gameTimerRef.current && timerRemainingTimeRef.current > 0) {
        timerStartTimeRef.current = Date.now();
        gameTimerRef.current = setTimeout(() => {
          // Check if game is still active and not paused
          if (!isGamePausedRef.current) {
            // Get current score from the DOM
            const scoreDisplay = scoreDisplayRef.current;
            const currentScore = scoreDisplay ? parseInt(scoreDisplay.textContent.split('/')[0]) : 0;
            
            if (currentScore >= 500) {
              // Call endGame function - we need to access it from the game logic
              if (window.endGame) {
                window.endGame(true);
              }
            } else {
              if (window.endGame) {
                window.endGame(false);
              }
            }
          }
        }, timerRemainingTimeRef.current);
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

  const handleFirstChatComplete = () => {
    setShowFirstChat(false);
    setShowSecondChat(true);
  };

  const handleSecondChatComplete = () => {
    setShowSecondChat(false);
    // Unfreeze the game
    setIsGameFrozen(false);
  };

  const handleBackToPrincipal = () => {
    // Stop soundtrack when going back
    if (soundtrackRef.current) {
      soundtrackRef.current.pause();
      soundtrackRef.current.currentTime = 0;
    }
    navigate('/principal1?from=game'); // Go back to principal1.jsx with parameter
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
    <div className="game2-container">
      <button className="back-button" onClick={handleBackToPrincipal}>
        <img src={BackBtn} alt="Voltar" className="back-button-img" />
      </button>

      {/* Phone Button */}
      <button className={`phone-button ${isPhoneOpen ? 'phone-button-overlay' : ''}`} onClick={handlePhoneToggle}>
        <img src={CellBtn} alt="Phone" className="phone-button-img" />
      </button>
      
      <div className="game-area" ref={gameAreaRef}>
        <div id="falling-notes" ref={fallingNotesRef}></div>
        <div className="vertical-lines">
          {notes.map((_, index) => (
            <div 
              key={index} 
              className="vertical-line" 
              style={{ left: `${(index + 1) * (100 / notes.length)}%` }}
            />
          ))}
        </div>
        <div className="hit-line"></div>
        <div className="piano">
          <div className="key" data-note="1">1</div>
          <div className="key" data-note="2">2</div>
          <div className="key" data-note="3">3</div>
          <div className="key" data-note="4">4</div>
          <div className="key" data-note="5">5</div>
          <div className="key" data-note="6">6</div>
          <div className="key" data-note="7">7</div>
          <div className="key" data-note="8">8</div>
          <div className="key" data-note="9">9</div>
          <div className="key" data-note="0">0</div>
        </div>
      </div>

      <div className="score"><span id="score" ref={scoreDisplayRef}>0/500 pontos</span></div>

      <div id="overlay" className="hidden" ref={overlayRef}>
        <div className="message">
          <h1 id="result" ref={resultTextRef}></h1>
          <button onClick={() => window.restartGame()}>Jogar de novo</button>
        </div>
      </div>

      {/* Modal background overlay when game is frozen */}
      {isGameFrozen && (
        <div className="game2-modal-overlay">
          {/* First chat bubble - Robot */}
          {showFirstChat && (
            <div className="game2-chat-container">
              <ChatBubble
                characterName="A Destruidora"
                message="Este é o Concerto do Caos — um código projetado para explorar todas as falhas da humanidade. Cada nota que vocês tocam, cada melodia que tentam criar, é egoísta, fragmentada e cheia de erros. Aqui, a criação humana é inútil. Só restam dissonância… e destruição."
                characterImage={RobotImage}
                onComplete={handleFirstChatComplete}
                typingSpeed={40}
                showDelay={500}
                buttonDelay={1000}
              />
            </div>
          )}

          {/* Second chat bubble - Ana */}
          {showSecondChat && (
            <div className="game2-chat-container">
              <ChatBubble
                characterName="Ana Clara"
                message="Não é caos… é vida! Cada nota tem sentido quando tocada com emoção, cada melodia carrega amor e lembranças. A música conecta corações, desperta sentimentos e dá esperança. Mesmo entre o ruído e a confusão, há harmonia. E enquanto houver música feita com amor… você não irá vencer!"
                characterImage={Ana}
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
        gamePhase={2}
      />
    </div>
  );
}
