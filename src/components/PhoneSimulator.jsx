import { useState, useRef, useEffect } from 'react';
import './PhoneSimulator.css';

// Import all the required assets
import NPerfil from '../assets/Nperfil.png';
import YPerfil from '../assets/Yperfil.png';
import APerfil from '../assets/Aperfil.png';
import WPerfil from '../assets/Wperfil.png';
import VPerfil from '../assets/Vperfil.png';
import NmsgAuto from '../assets/NmsgAuto.png';
import Nmsg1 from '../assets/Nmsg1.png';
import Nmsg2 from '../assets/Nmsg2.png';
import Nmsg3 from '../assets/Nmsg3.png';
import YmsgAuto from '../assets/YmsgAuto.png';
import Ymsg1 from '../assets/Ymsg1.png';
import Ymsg2 from '../assets/Ymsg2.png';
import Amsg1 from '../assets/Amsg1.png';
import Amsg2 from '../assets/Amsg2.png';
import Amsg3 from '../assets/Amsg3.png';
import Wmsg1 from '../assets/Wmsg1.png';
import Wmsg2 from '../assets/Wmsg2.png';
import Wmsg3 from '../assets/Wmsg3.png';
import VmsgAuto from '../assets/VmsgAuto.png';
import Vmsg1 from '../assets/Vmsg1.png';
import Vmsg2 from '../assets/Vmsg2.png';
import backarrow from '../assets/backarrow.png';
import ring from '../assets/ring.png';
import askBtn from '../assets/askBtn.png';
import sendBtn from '../assets/sendBtn.png';
import finishBtn from '../assets/finishBtn.png';
import newmsg from '../assets/newmsg.png';
import helpmsg from '../assets/helpmsg.png';
import cellFrame from '../assets/cellFrame.png';

export default function PhoneSimulator({ isOpen, onClose, onGamePause, onGameResume, gamePhase = 1 }) {
  const [currentView, setCurrentView] = useState('chats'); // 'chats' or 'conversation'
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [messageState, setMessageState] = useState('ask'); // 'ask', 'sending', 'sent', 'finished'
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [conversationStates, setConversationStates] = useState({});
  const [unreadMessages, setUnreadMessages] = useState({});
  const [lastMessages, setLastMessages] = useState({
    nicolas: 'ACHO Q ENTENDI O JOGO',
    yasmin: 'AQUI VOCÊ PRECISA SER P...',
    ana: '',
    winny: '',
    vitor: 'VOCÊ ESTÁ INDO BEM!'
  });
  
  const messageTimeoutRef = useRef(null);
  const messageTimeoutsRef = useRef([]);

  // Define character availability based on game phase
  const getCharactersForPhase = (phase) => {
    const allCharacters = [
      {
        id: 'nicolas',
        name: 'Nicolas',
        profile: NPerfil,
        unlocked: phase >= 1
      },
      {
        id: 'ana',
        name: 'Ana Clara',
        profile: APerfil,
        unlocked: phase >= 2
      },
      {
        id: 'vitor',
        name: 'Vitor',
        profile: VPerfil,
        unlocked: phase >= 3
      },
      {
        id: 'winny',
        name: 'Winny',
        profile: WPerfil,
        unlocked: phase >= 4
      },
      {
        id: 'yasmin',
        name: 'Yasmin',
        profile: YPerfil,
        unlocked: phase >= 5
      }
    ];
    
    return allCharacters;
  };

  const characters = getCharactersForPhase(gamePhase);

  const characterMessages = {
    nicolas: [Nmsg1, Nmsg2, Nmsg3],
    yasmin: [Ymsg1, Ymsg2],
    ana: [Amsg1, Amsg2, Amsg3],
    winny: [Wmsg1, Wmsg2, Wmsg3],
    vitor: [Vmsg1, Vmsg2]
  };

  const characterAutoMessages = {
    nicolas: NmsgAuto,
    yasmin: YmsgAuto,
    vitor: VmsgAuto
  };

  const updatedLastMessages = {
    nicolas: 'MAS, SÓ PALAVRAS EM...',
    yasmin: 'TEM QUE ESPERAR EL...',
    ana: 'ATÉ ATINGIR O NÚM...',
    winny: 'SEJA RÁPIDO!',
    vitor: 'ALGUMAS IMAGENS SÃ...'
  };

  // Pause game when modal opens, resume when it closes
  useEffect(() => {
    if (isOpen) {
      onGamePause();
    } else {
      onGameResume();
    }
  }, [isOpen, onGamePause, onGameResume]);

  const handleCharacterClick = (character) => {
    // Don't allow clicking on locked characters
    if (!character.unlocked) {
      return;
    }
    
    // Only clear timeouts if switching to a different character
    if (selectedCharacter && selectedCharacter.id !== character.id) {
      messageTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      messageTimeoutsRef.current = [];
    }
    
    // Mark messages as read when entering conversation
    setUnreadMessages(prev => ({
      ...prev,
      [character.id]: false
    }));
    
    setSelectedCharacter(character);
    setCurrentView('conversation');
    
    // Restore conversation state for this character
    const charState = conversationStates[character.id] || {
      messageState: 'ask',
      currentMessageIndex: 0,
      showAllMessages: false
    };
    
    setMessageState(charState.messageState);
    setCurrentMessageIndex(charState.currentMessageIndex);
    setShowNewMessage(false);
    setShowAllMessages(charState.showAllMessages);
    
    // If we're in 'sent' state but messages haven't finished displaying, continue showing them
    if (charState.messageState === 'sent' && charState.currentMessageIndex < characterMessages[character.id].length) {
      const messages = characterMessages[character.id];
      let messageIndex = charState.currentMessageIndex;
      
      const showNextMessage = () => {
        if (messageIndex < messages.length) {
          setCurrentMessageIndex(messageIndex + 1);
          messageIndex++;
          
          // Save state after each message appears
          setConversationStates(prev => ({
            ...prev,
            [character.id]: {
              messageState: 'sent',
              currentMessageIndex: messageIndex,
              showAllMessages: true
            }
          }));
          
          // Schedule next message and track timeout
          const timeout = setTimeout(showNextMessage, 1000);
          messageTimeoutsRef.current.push(timeout);
        } else {
          // All messages shown, change to finished state
          setMessageState('finished');
          // Save finished state
          setConversationStates(prev => ({
            ...prev,
            [character.id]: {
              messageState: 'finished',
              currentMessageIndex: messages.length,
              showAllMessages: true
            }
          }));
        }
      };
      
      // Start showing remaining messages
      showNextMessage();
    }
  };

  const handleBackToChats = () => {
    // Clear any existing timeouts
    messageTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    messageTimeoutsRef.current = [];
    
    // Save current conversation state before going back
    if (selectedCharacter) {
      setConversationStates(prev => ({
        ...prev,
        [selectedCharacter.id]: {
          messageState,
          currentMessageIndex,
          showAllMessages
        }
      }));
    }
    
    setCurrentView('chats');
    setSelectedCharacter(null);
    setMessageState('ask');
    setCurrentMessageIndex(0);
    setShowAllMessages(false);
  };

  const handleAskButtonClick = () => {
    if (messageState === 'ask') {
      setMessageState('sending');
      
      // After 1 second, show the help message first
      setTimeout(() => {
        setMessageState('sent');
        setShowAllMessages(true);
        
        // Wait another 1 second before showing character responses
        setTimeout(() => {
          // Mark as unread when character messages start appearing
          if (selectedCharacter) {
            setUnreadMessages(prev => ({
              ...prev,
              [selectedCharacter.id]: true
            }));
          }
          
          // Show messages one by one with delays
          const messages = characterMessages[selectedCharacter.id];
          let messageIndex = 0;
          
          const showNextMessage = () => {
            if (messageIndex < messages.length) {
              setCurrentMessageIndex(messageIndex + 1);
              messageIndex++;
              
              // Save state after each message appears
              if (selectedCharacter) {
                setConversationStates(prev => ({
                  ...prev,
                  [selectedCharacter.id]: {
                    messageState: 'sent',
                    currentMessageIndex: messageIndex,
                    showAllMessages: true
                  }
                }));
              }
              
              // Schedule next message and track timeout
              const timeout = setTimeout(showNextMessage, 1000);
              messageTimeoutsRef.current.push(timeout);
            } else {
              // All messages shown, change to finished state
              setMessageState('finished');
              // Update last message in chat list
              if (selectedCharacter) {
                setLastMessages(prev => ({
                  ...prev,
                  [selectedCharacter.id]: updatedLastMessages[selectedCharacter.id]
                }));
              }
              // Save finished state
              if (selectedCharacter) {
                setConversationStates(prev => ({
                  ...prev,
                  [selectedCharacter.id]: {
                    messageState: 'finished',
                    currentMessageIndex: messages.length,
                    showAllMessages: true
                  }
                }));
              }
            }
          };
          
          // Start showing messages
          showNextMessage();
        }, 1000); // Wait 1 second after help message appears
      }, 1000);
    }
  };

  const handleNextMessage = () => {
    if (currentMessageIndex < characterMessages[selectedCharacter.id].length - 1) {
      setCurrentMessageIndex(currentMessageIndex + 1);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="phone-simulator-overlay">
      {/* Phone frame overlay - outside the modal */}
      <img src={cellFrame} alt="Phone Frame" className="phone-frame" />
      <div className="phone-simulator-container">
        {currentView === 'chats' ? (
          <div className="phone-chats-view">
            {/* Header */}
            <div className="phone-header">
              <div className="phone-header-left">
                
                <h2>Conversas</h2>
              </div>
              <div className="phone-header-right">
                <span className="phone-time">19:02</span>
              </div>
            </div>

            {/* Chat List */}
            <div className="phone-chat-list">
              {characters.map((character) => (
                <div
                  key={character.id}
                  className={`phone-chat-item ${!character.unlocked ? 'phone-chat-locked' : ''}`}
                  onClick={() => handleCharacterClick(character)}
                >
                  <div className="phone-chat-avatar">
                    <img src={character.profile} alt={character.name} />
                  </div>
                  <div className="phone-chat-info">
                    <div className="phone-chat-name">{character.name}</div>
                    <div className="phone-chat-preview">
                      {character.unlocked ? lastMessages[character.id] : 'Bloqueado'}
                    </div>
                  </div>
                  <div className="phone-chat-actions">
                    {character.unlocked && unreadMessages[character.id] && (
                      <img src={newmsg} alt="New message" className="phone-new-message-small" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="phone-conversation-view">
            {/* Conversation Header */}
            <div className="phone-conversation-header">
              <button className="phone-back-btn" onClick={handleBackToChats}>
                <img src={backarrow} alt="Back" />
              </button>
              <div className="phone-conversation-avatar">
                <img src={selectedCharacter.profile} alt={selectedCharacter.name} />
              </div>
              <div className="phone-conversation-info">
                <div className="phone-conversation-name">{selectedCharacter.name}</div>
              </div>
              <div className="phone-conversation-actions">
                <img src={ring} alt="Call" className="phone-call-icon" />
              </div>
            </div>

            {/* Messages */}
            <div className="phone-messages">
              {/* Auto message - character specific (only if character has one) */}
              {characterAutoMessages[selectedCharacter.id] && (
                <div className="phone-message phone-message-received">
                  <img src={characterAutoMessages[selectedCharacter.id]} alt="Auto message" className="phone-message-image" />
                </div>
              )}

              {/* User message (help message) */}
              {messageState === 'sent' || messageState === 'finished' ? (
                <div className="phone-message phone-message-sent">
                  <img src={helpmsg} alt="Help message" className="phone-message-image helpmsg-image" />
                </div>
              ) : null}

              {/* Character responses - show messages one by one */}
              {showAllMessages && currentMessageIndex > 0 && 
                characterMessages[selectedCharacter.id].slice(0, currentMessageIndex).map((messageImg, index) => (
                  <div key={index} className="phone-message phone-message-received">
                    <img 
                      src={messageImg} 
                      alt="Character response" 
                      className="phone-message-image" 
                    />
                  </div>
                ))
              }
            </div>

            {/* Message Input */}
            <div className="phone-message-input">
              <div className="phone-button-wrapper">
                {messageState === 'ask' && (
                  <button 
                    className="phone-send-button"
                    onClick={handleAskButtonClick}
                  >
                    <img src={askBtn} alt="Ask" className="phone-button-image" />
                  </button>
                )}
                
              {messageState === 'sending' && (
                <div className="phone-send-button">
                  <img src={sendBtn} alt="Sending" className="phone-button-image" />
                </div>
              )}
              
              {messageState === 'sent' && (
                <div className="phone-send-button">
                  <img src={sendBtn} alt="Sending" className="phone-button-image" />
                </div>
              )}
                
                {messageState === 'finished' && (
                  <div className="phone-finish-image">
                    <img src={finishBtn} alt="Finish" className="phone-button-image" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
