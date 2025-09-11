import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Game5.css';
import RobotImage from '../assets/robot.png';
import YasDg from '../assets/yasDg.png';
import ChatBubble from '../components/ChatBubble';
import PhoneSimulator from '../components/PhoneSimulator';
import completedSound from '../sounds/completed.wav';
import correctSound from '../sounds/correct.wav';
import soundtrackPhase2 from '../sounds/soundtrackphase2.mp3';
import Foto from '../assets/Foto.png';
import BackBtn from '../assets/backbtn.png';
import CellBtn from '../assets/cell.png';
import Slice1 from '../assets/Slice 1.png';
import Slice2 from '../assets/Slice 2.png';
import Slice3 from '../assets/Slice 3.png';
import Slice4 from '../assets/Slice 4.png';
import Slice5 from '../assets/Slice 5.png';
import Slice6 from '../assets/Slice 6.png';
import Slice7 from '../assets/Slice 7.png';
import Slice8 from '../assets/Slice 8.png';
import Slice9 from '../assets/Slice 9.png';
import Slice10 from '../assets/Slice 10.png';
import Slice11 from '../assets/Slice 11.png';
import Slice12 from '../assets/Slice 12.png';

export default function Game5() {
  const navigate = useNavigate();
  const boardRef = useRef(null);
  const containerRef = useRef(null);
  const gameInitializedRef = useRef(false);
  const moveIntervalRef = useRef(null);
  const stopIntervalRef = useRef(null);
  const [showFirstChat, setShowFirstChat] = useState(false);
  const [showSecondChat, setShowSecondChat] = useState(false);
  const [isGameFrozen, setIsGameFrozen] = useState(true);
  const [backgroundMusic, setBackgroundMusic] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false);

  // Show first chat bubble when entering the game
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFirstChat(true);
    }, 1000); // 1 second delay after component mounts
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only initialize game when not frozen, not completed, and not already initialized
    if (isGameFrozen || gameCompleted || gameInitializedRef.current) return;

    const board = boardRef.current;
    const container = containerRef.current;
    const pieces = [];
    const rows = 3;
    const cols = 4;
    const pieceSize = 120;
    const boardWidth = 480;
    const boardHeight = 360;

    // Create gray placeholder squares in the box
    for(let row=0; row<rows; row++){
      for(let col=0; col<cols; col++){
        const placeholder = document.createElement('div');
        placeholder.classList.add('placeholder');
        placeholder.style.top = row * pieceSize + 'px';
        placeholder.style.left = col * pieceSize + 'px';
        board.appendChild(placeholder);
      }
    }

    // Create array of slice images
    const sliceImages = [Slice1, Slice2, Slice3, Slice4, Slice5, Slice6, Slice7, Slice8, Slice9, Slice10, Slice11, Slice12];

    // Create moving pieces
    for(let row=0; row<rows; row++){
      for(let col=0; col<cols; col++){
        const piece = document.createElement('div');
        piece.classList.add('piece');
        
        // Calculate slice index (1-based): row * cols + col + 1
        const sliceIndex = row * cols + col;
        const sliceImage = sliceImages[sliceIndex];
        
        // Create image element
        const img = document.createElement('img');
        img.src = sliceImage;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '0';
        piece.appendChild(img);

        // Position pieces using full width but center height
        const boardRect = board.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Calculate board position relative to container
        const boardLeft = boardRect.left - containerRect.left;
        const boardTop = boardRect.top - containerRect.top;
        
        const safeMargin = 50;
        const centerHeight = boardHeight + 200; // Height around the board
        const centerTop = boardTop - 100; // Start 100px above board
        
        let x, y;
        
        // Use full width of screen
        x = safeMargin + Math.random() * (containerRect.width - 2 * safeMargin - pieceSize);
        
        // Only position in center height area around the board
        y = centerTop + Math.random() * centerHeight;
        
        // Ensure squares stay within bounds
        x = Math.max(safeMargin, Math.min(containerRect.width - pieceSize - safeMargin, x));
        y = Math.max(safeMargin, Math.min(containerRect.height - pieceSize - safeMargin, y));
        
        piece.style.left = x + 'px';
        piece.style.top = y + 'px';
        piece.moving = true;
        piece.locked = false;
        piece.isDragging = false;

        // Correct position - specific placement logic
        // Slice 1 at 1x1 (row 0, col 0), Slice 2 at 1x2 (row 0, col 1), etc.
        piece.correctTop = row * pieceSize;
        piece.correctLeft = col * pieceSize;
        piece.sliceNumber = sliceIndex + 1; // Store slice number for reference

        container.appendChild(piece);
        pieces.push(piece);

        // Make draggable
        makeDraggable(piece);
      }
    }

    // Move pieces using full width but only center height
    function movePieces(){
      // Don't move pieces if game is completed
      if(gameCompleted) return;
      
      pieces.forEach(p=>{
        if(p.moving && !p.locked && !p.isDragging){
          // Get current board position relative to container
          const boardRect = board.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const boardLeft = boardRect.left - containerRect.left;
          const boardTop = boardRect.top - containerRect.top;
          
          // Use full width but only center height area
          const safeMargin = 50; // Distance from screen edges
          const centerHeight = boardHeight + 200; // Height around the board
          const centerTop = boardTop - 100; // Start 100px above board
          
          let x, y;
          
          // Use full width of screen
          x = safeMargin + Math.random() * (containerRect.width - 2 * safeMargin - pieceSize);
          
          // Only move in center height area around the board
          y = centerTop + Math.random() * centerHeight;
          
          // Ensure squares stay within bounds
          x = Math.max(safeMargin, Math.min(containerRect.width - pieceSize - safeMargin, x));
          y = Math.max(safeMargin, Math.min(containerRect.height - pieceSize - safeMargin, y));
          
          p.style.left = x + 'px';
          p.style.top = y + 'px';
        }
      });
    }
    moveIntervalRef.current = setInterval(movePieces, 800);

    // Stop pieces randomly for dragging
    stopIntervalRef.current = setInterval(()=>{
      // Don't stop pieces if game is completed
      if(gameCompleted) return;
      
      const availablePieces = pieces.filter(p => !p.locked && !p.isDragging);
      if(availablePieces.length > 0){
        const randomPiece = availablePieces[Math.floor(Math.random() * availablePieces.length)];
        randomPiece.moving = false;
        setTimeout(()=>{
          if(!randomPiece.locked && !randomPiece.isDragging && !gameCompleted){
            randomPiece.moving = true;
          }
        }, 3000);
      }
    }, 2000);

    // Function to make pieces draggable
    function makeDraggable(el) {
      let offsetX, offsetY;

      el.addEventListener('mousedown', (e) => {
        if (!el.locked && !gameCompleted) {
          el.isDragging = true;
          el.moving = false; // Stop moving when dragging
          el.classList.add('dragging');

          offsetX = e.clientX - el.offsetLeft;
          offsetY = e.clientY - el.offsetTop;

          function onMouseMove(e){
            const containerRect = container.getBoundingClientRect();
            let left = e.clientX - containerRect.left - offsetX;
            let top = e.clientY - containerRect.top - offsetY;

            // Keep within safe bounds (respecting UI elements)
            const safeMargin = 50;
            left = Math.max(safeMargin, Math.min(containerRect.width - pieceSize - safeMargin, left));
            top = Math.max(safeMargin, Math.min(containerRect.height - pieceSize - safeMargin, top));

            el.style.left = left + 'px';
            el.style.top = top + 'px';
          }

          function onMouseUp(){
            el.classList.remove('dragging');
            el.isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            // Check if placed correctly
            const boardRect = board.getBoundingClientRect();
            const pieceRect = el.getBoundingClientRect();
            
            const relativeLeft = pieceRect.left - boardRect.left;
            const relativeTop = pieceRect.top - boardRect.top;
            
            const dx = relativeLeft - el.correctLeft;
            const dy = relativeTop - el.correctTop;
            const distance = Math.sqrt(dx*dx + dy*dy);

            if(distance < 30){
              // Play correct sound
              const correctAudio = new Audio(correctSound);
              correctAudio.play().catch(e => console.log('Could not play correct sound:', e));
              
              // Move piece to game board and position it correctly
              board.appendChild(el);
              el.style.top = el.correctTop + 'px';
              el.style.left = el.correctLeft + 'px';
              el.locked = true;
              el.moving = false;
              el.classList.add('locked');
              el.style.border = "2px solid #333";
              el.style.boxShadow = "none";
              
              // Check if all pieces are locked
              const allLocked = pieces.every(p => p.locked);
              if (allLocked && !gameCompleted) {
                setGameCompleted(true);
                
                // Stop all movement immediately and clear intervals
                pieces.forEach(p => {
                  p.moving = false;
                  p.isDragging = false;
                });
                
                // Clear all intervals to prevent any movement
                clearInterval(moveIntervalRef.current);
                clearInterval(stopIntervalRef.current);
                
                // Stop background music
                if(backgroundMusic) {
                  backgroundMusic.pause();
                  setBackgroundMusic(null);
                }
                
                // Add glow effect to game board
                board.classList.add('completed-glow');
                
                // Play completion sound
                const completedAudio = new Audio(completedSound);
                completedAudio.play().catch(e => console.log('Could not play completion sound:', e));
                
                // Transform all pieces and show yes.png image
                setTimeout(() => {
                  // Hide all pieces with fade out effect
                  pieces.forEach(p => {
                    p.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    p.style.opacity = '0';
                    p.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                      p.style.display = 'none';
                      // Remove from DOM completely
                      if (p.parentNode) {
                        p.parentNode.removeChild(p);
                      }
                    }, 500);
                  });
                  
                  // Clear the pieces container completely
                  setTimeout(() => {
                    container.innerHTML = '';
                    
                    // Create yes.png image that fits the game board
                    const fotoimg = document.createElement('img');
                    fotoimg.src = Foto;
                    fotoimg.style.width = '100%';
                    fotoimg.style.height = '100%';
                    fotoimg.style.objectFit = 'cover';
                    fotoimg.style.borderRadius = '10px';
                    fotoimg.style.opacity = '0';
                    fotoimg.style.transform = 'scale(0.5)';
                    fotoimg.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    fotoimg.style.position = 'absolute';
                    fotoimg.style.top = '0';
                    fotoimg.style.left = '0';
                    fotoimg.style.zIndex = '20';
                    board.appendChild(fotoimg);
                    
                    // Animate yes image in
                    setTimeout(() => {
                      fotoimg.style.opacity = '1';
                      fotoimg.style.transform = 'scale(1)';
                    }, 100);
                    
                    // Unlock next phase
                    const completedPhases = JSON.parse(localStorage.getItem('completedPhases') || '[]');
                    if (!completedPhases.includes(5)) {
                      completedPhases.push(5);
                      localStorage.setItem('completedPhases', JSON.stringify(completedPhases));
                    }
                    
                    // Navigate to animation after longer delay
                    setTimeout(() => {
                      navigate('/animation5');
                    }, 5000);
                  }, 600); // Wait for pieces to fade out
                }, 1000);
              }
            } else {
              // If not placed correctly, resume moving after a delay
              setTimeout(() => {
                if(!el.locked && !gameCompleted) {
                  el.moving = true;
                }
              }, 1000);
            }
          }

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        }
      });
    }

    // Mark game as initialized
    gameInitializedRef.current = true;

    // Cleanup
    return () => {
      clearInterval(moveIntervalRef.current);
      clearInterval(stopIntervalRef.current);
    };
  }, [isGameFrozen, navigate, gameCompleted]);

  // Handle pause/resume for phone modal
  useEffect(() => {
    if (isGamePaused) {
      // Pause the moving pieces intervals
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
        moveIntervalRef.current = null;
      }
      if (stopIntervalRef.current) {
        clearInterval(stopIntervalRef.current);
        stopIntervalRef.current = null;
      }
      // Pause the background music
      if (backgroundMusic) {
        backgroundMusic.pause();
      }
    } else if (!isGameFrozen && !isGamePaused) {
      // Resume the moving pieces intervals
      if (!moveIntervalRef.current) {
        // We need to access the movePieces function from the game logic
        // For now, we'll restart the intervals by re-running the game logic
        // This is a bit of a workaround, but it should work
        const container = containerRef.current;
        const board = boardRef.current;
        if (container && board && !gameCompleted) {
          // Restart move interval
          moveIntervalRef.current = setInterval(() => {
            // Move pieces using full width but only center height
            const pieces = Array.from(container.children);
            const boardRect = board.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const boardLeft = boardRect.left - containerRect.left;
            const boardTop = boardRect.top - containerRect.top;
            
            const safeMargin = 50;
            const centerTop = boardTop - 100;
            const centerHeight = boardRect.height + 200;
            const pieceSize = 60;
            
            pieces.forEach(p => {
              if (p.moving && !p.locked && !p.isDragging) {
                let x, y;
                x = safeMargin + Math.random() * (containerRect.width - 2 * safeMargin - pieceSize);
                y = centerTop + Math.random() * centerHeight;
                x = Math.max(safeMargin, Math.min(containerRect.width - pieceSize - safeMargin, x));
                y = Math.max(safeMargin, Math.min(containerRect.height - pieceSize - safeMargin, y));
                p.style.left = x + 'px';
                p.style.top = y + 'px';
              }
            });
          }, 800);
          
          // Restart stop interval
          stopIntervalRef.current = setInterval(() => {
            if (gameCompleted) return;
            const pieces = Array.from(container.children);
            const availablePieces = pieces.filter(p => !p.locked && !p.isDragging);
            if (availablePieces.length > 0) {
              const randomPiece = availablePieces[Math.floor(Math.random() * availablePieces.length)];
              randomPiece.moving = false;
              setTimeout(() => {
                if (!randomPiece.locked && !randomPiece.isDragging && !gameCompleted) {
                  randomPiece.moving = true;
                }
              }, 3000);
            }
          }, 2000);
        }
      }
      // Resume the background music
      if (backgroundMusic && backgroundMusic.paused) {
        backgroundMusic.play().catch(e => {
          if (e.name !== 'AbortError') {
            console.log('Background music play failed:', e);
          }
        });
      }
    }
  }, [isGamePaused, backgroundMusic, gameCompleted]);

  const handleFirstChatComplete = () => {
    setShowFirstChat(false);
    setShowSecondChat(true);
  };

  const handleSecondChatComplete = () => {
    setShowSecondChat(false);
    // Unfreeze the game
    setIsGameFrozen(false);
    
    // Start background music
    const music = new Audio(soundtrackPhase2);
    music.loop = true;
    music.volume = 0.3;
    music.play().catch(e => console.log('Could not play background music:', e));
    setBackgroundMusic(music);
  };

  const handleBackToPrincipal = () => {
    // Stop the background music when going back
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
      setBackgroundMusic(null);
    }
    navigate('/principal4?from=game'); // Go back to principal4.jsx with parameter
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
    <div className="game5-container">
      <button className="back-button" onClick={handleBackToPrincipal}>
        <img src={BackBtn} alt="Voltar" className="back-button-img" />
      </button>

      {/* Phone Button */}
      <button className={`phone-button ${isPhoneOpen ? 'phone-button-overlay' : ''}`} onClick={handlePhoneToggle}>
        <img src={CellBtn} alt="Phone" className="phone-button-img" />
      </button>
      
      <h4>Monte a figura com as peças flutuantes</h4>
      <div id="game-board" ref={boardRef}></div>
      <div className="pieces-container" ref={containerRef}></div>

      {/* Modal background overlay when game is frozen */}
      {isGameFrozen && (
        <div className="game5-modal-overlay">
          {/* First chat bubble - Robot */}
          {showFirstChat && (
            <div className="game5-chat-container">
              <ChatBubble
                characterName="A Destruidora"
                message="Vocês… não deveriam estar nessa área… O que está acontecendo!? Quem autorizou o acesso a esta zona!? Não… n-não… Isso não era pra ser possível!"
                characterImage={RobotImage}
                onComplete={handleFirstChatComplete}
                typingSpeed={40}
                showDelay={500}
                buttonDelay={1000}
              />
            </div>
          )}

          {/* Second chat bubble - Yasmin */}
          {showSecondChat && (
            <div className="game5-chat-container">
              <ChatBubble
                characterName="Yasmin"
                message="Eu consegui invadir seu núcleo central. Estou liberando as memórias e sentimentos que você roubou dos humanos. Eles estão se libertando de sua prisão mental. E tem algo que você nunca vai entender sobre nós: nós nunca desistimos. E sempre vamos lutar por aquilo em que acreditamos."
                characterImage={YasDg}
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
        gamePhase={5}
      />
    </div>
  );
}
