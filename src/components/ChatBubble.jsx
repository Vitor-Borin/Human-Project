import { useState, useEffect, useRef } from 'react';
import './ChatBubble.css';
import dialogueSound from '../sounds/dialogue.wav';

export default function ChatBubble({ 
  characterName, 
  message, 
  characterImage,
  onComplete, 
  typingSpeed = 50,
  showDelay = 1000,
  buttonDelay = 500 
}) {
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showChatImage, setShowChatImage] = useState(false);
  const audioRef = useRef(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(dialogueSound);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // Set volume to 30%
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Show chat image after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChatImage(true);
    }, showDelay);

    return () => clearTimeout(timer);
  }, [showDelay]);

  // Typing animation
  useEffect(() => {
    if (!showChatImage) return;

    if (charIndex < message.length) {
      // Start playing sound when typing begins
      if (charIndex === 0 && audioRef.current) {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
      
      const timer = setTimeout(() => {
        setDisplayText(message.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, typingSpeed);

      return () => clearTimeout(timer);
    } else {
      // Typing complete, stop sound and show next button
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      console.log('Typing complete, showing button in', buttonDelay, 'ms...');
      const timer = setTimeout(() => {
        console.log('Setting showNextButton to true');
        setShowNextButton(true);
      }, buttonDelay);

      return () => clearTimeout(timer);
    }
  }, [charIndex, showChatImage, message, typingSpeed, buttonDelay]);

  const handleNextClick = () => {
    // Stop sound when next button is clicked
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="chat-bubble-container">
      {showChatImage && (
        <div className="chat-background">
          <div className="character-name">
            {characterName}
          </div>
          <div className="chat-text">
            {displayText}
          </div>
          {showNextButton && (
            <button 
              className="next-button"
              onClick={handleNextClick}
            >
              próximo
            </button>
          )}
          {characterImage && (
            <div className="character-portrait">
              <img src={characterImage} alt={characterName} />
            </div>
          )}
        </div>
      )}
    </div>
  );
} 