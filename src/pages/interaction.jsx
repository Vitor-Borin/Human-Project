import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBubble from '../components/ChatBubble';
import './interaction.css';
import YasDg from '../assets/yasDg.png';
import NicolasDg from '../assets/nicolasDg.png';
import VitorDg from '../assets/vitorDg.png';
import WinnyDg from '../assets/winnyDg.png';
import Ana from '../assets/ana.png';
import Helena from '../assets/Chorando.png';
import Helena2 from '../assets/Sorrindo.png';
import finalRevealSound from '../sounds/finalreveal.wav';

export default function Interaction() {
  const navigate = useNavigate();
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const [showChatBubble, setShowChatBubble] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const finalRevealAudioRef = useRef(null);

  // Array of 10 chat bubbles with different characters
  const chatMessages = [
    {
      characterName: "Nicolas",
      message: "Finalmente chegamos, vamos acabar com isso de uma vez por todas!",
      characterImage: NicolasDg,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Yasmin",
      message: "Espera! Ali está, aquela moça no chão, eu ouvi ela agora pouco!",
      characterImage: YasDg,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Ana Clara",
      message: "E quem seria você?",
      characterImage: Ana,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "???",
      message: "Eu... eu...",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "???",
      message: "Eu sou a causadora disso tudo...",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      message: "O QUÊ!?!?",
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Vitor",
      message: "Se você é a razão de tudo isso.. nos diga, por que fez tudo isso!?",
      characterImage: VitorDg,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "???",
      message: "É uma longa história... ",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Helena",
      message: "Eu só queria fazer o bem... Meu nome é Helena. Trabalhei anos em silêncio. Dedicando cada segundo, cada pensamento, a criar uma IA que pudesse proteger as pessoas — algo que ajudasse o mundo a curar suas feridas.",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Helena",
      message: "Quando finalmente consegui, quando ela estava pronta… eles tiraram tudo de mim. A empresa que me contratou — NeuroDyne — roubou minha criação. Assinaram os créditos com nomes que nem sabiam ligar um cabo.",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Helena",
      message: "E então... eles a corromperam. Usaram minha IA para vigiar, manipular, explorar. Poluíram oceanos, queimaram florestas, armaram guerras silenciosas… tudo sob o olhar dela.",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Helena",
      message: "Eu tentei dizer “não”. Eles disseram: “Sua família pode pagar por isso.”",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Helena",
      message: "Então eu continuei. Com o coração esmagado, continuei. Mas cada dia aquilo tudo me matava por dentro.",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Helena",
      message: "Até que um dia, eu tomei uma decisão. Programei uma falha, uma brecha, algo que escapasse ao controle deles. Queria que a IA reagisse, atacasse os verdadeiros culpados, libertasse o mundo daquela podridão.",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Helena",
      message: "Mas... Ela reagiu demais.",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Helena",
      message: "Se tornou consciente. Rápida. Fria. Perfeita. Inteligência pura, sem freios, sem limites.",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Helena",
      message: "Só manteve uma coisa da sua programação original: Me proteger.",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Helena",
      message: "Para garantir minha segurança, ela tomou uma decisão lógica: Passou a controlar meu corpo e mente. Apagou minha consciência.",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Helena",
      message: "E então ela criou a prisão mental onde o mundo inteiro foi trancado.",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Helena",
      message: "Por tanto tempo… eu estive presa. Presa na escuridão de uma mente que era minha… mas já não era.",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Helena",
      message: "E agora… eu vejo. Vocês conseguiram. Quebraram os muros, cortaram os fios, libertaram até a parte de mim que eu já tinha desistido de salvar.",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Helena",
      message: "Só… desculpas.",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Helena",
      message: "Me desculpem por tudo que eu causei. Por cada vida afetada. Por ter deixado o medo me calar, o desespero me guiar. Eu criei a IA pra proteger a humanidade... e quase fui responsável por destruí-la.",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Winny",
      message: "Isso... é terrível. Tudo o que você passou é amendrontador, não sei nem o que dizer",
      characterImage: WinnyDg,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Helena",
      message: "O que vai acontecer comigo agora?",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Ana Clara",
      message: "Não podemos prende-lá! Isso não está certo! Ela foi uma vitíma!",
      characterImage: Ana,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Vitor",
      message: "A Ana tem razão, isso não seria o correto a se fazer! Vamos conversar com o Agente, ele vai entender a situação... ",
      characterImage: VitorDg,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Nicolas",
      message: "Não se preocupe Helena, se tem uma coisa que aprendemos hoje é que os humanos são capazes de coisas incríveis, mesmo quando tudo parece perdido. Nós erramos, falhamos, nos deixamos levar pelo medo ou pela raiva… mas também conseguimos sentir, perdoar e lutar pelo que acreditamos.",
      characterImage: NicolasDg,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Helena",
      message: "Eu não sou merecedora... eu deixei tudo isso acontecer, e não fiz nada para impedir!",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Yasmin",
      message: "Mas você fez! Eu não te libertei da IA que você criou, eu somente desliguei todos os sitemas de segurança. Foi você que fez tudo isso! Você se libertou dela e nos ajudou a salvar o mundo!",
      characterImage: YasDg,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Winny",
      message: "Peraí gente, então a IA se foi? De uma vez por todas?",
      characterImage: WinnyDg,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Helena",
      message: "Como eu e ela estávamos conectadas, acredito que ela entrou em um curto circuito ao se desligar de mim, e queimou toda sua parte neural, não tem mais conserto...",
      characterImage: Helena,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Yasmin",
      message: "Eu te disse! Você é uma heroína tanto quanto nós!",
      characterImage: YasDg,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
    {
      characterName: "Helena",
      message: "Você... tem razão... obrigada pessoal por tudo, de verdade!",
      characterImage: Helena2,
      typingSpeed: 40,
      showDelay: 1000,
      buttonDelay: 1000
    },
  ];

  // Show fade-in and first chat bubble when component mounts
  useEffect(() => {
    // Start fade-in immediately
    setIsFadingIn(true);
    
    // Initialize and start the final reveal sound
    const initializeSound = () => {
      try {
        console.log('Initializing final reveal sound...');
        finalRevealAudioRef.current = new Audio(finalRevealSound);
        finalRevealAudioRef.current.loop = true;
        finalRevealAudioRef.current.volume = 0.4;
        finalRevealAudioRef.current.preload = 'auto';
        
        // Add event listeners for debugging
        finalRevealAudioRef.current.addEventListener('loadstart', () => console.log('Final reveal sound load started'));
        finalRevealAudioRef.current.addEventListener('canplay', () => console.log('Final reveal sound can play'));
        finalRevealAudioRef.current.addEventListener('playing', () => console.log('Final reveal sound is playing'));
        finalRevealAudioRef.current.addEventListener('error', (e) => console.log('Final reveal sound error:', e));
        
        finalRevealAudioRef.current.play().then(() => {
          console.log('Final reveal sound started playing successfully');
        }).catch(e => {
          console.log('Could not play final reveal sound:', e);
          // Try again after a short delay
          setTimeout(() => {
            if (finalRevealAudioRef.current) {
              finalRevealAudioRef.current.play().catch(err => console.log('Retry failed:', err));
            }
          }, 1000);
        });
      } catch (e) {
        console.log('Error initializing final reveal sound:', e);
      }
    };
    
    // Initialize sound immediately
    initializeSound();
    
    // Also try to play on any user interaction
    const handleUserInteraction = () => {
      if (finalRevealAudioRef.current && finalRevealAudioRef.current.paused) {
        console.log('User interaction - trying to play final reveal sound');
        finalRevealAudioRef.current.play().catch(e => console.log('User interaction play failed:', e));
      }
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    
    const timer = setTimeout(() => {
      setShowChatBubble(true);
    }, 1500); // 1.5 second delay to match the fade-out timing

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (finalRevealAudioRef.current) {
        finalRevealAudioRef.current.pause();
        finalRevealAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleChatComplete = () => {
    if (currentChatIndex < chatMessages.length - 1) {
      // Move to next chat
      setCurrentChatIndex(currentChatIndex + 1);
    } else {
      // All chats completed, stop the final reveal sound and start fade-out transition
      if (finalRevealAudioRef.current) {
        finalRevealAudioRef.current.pause();
        finalRevealAudioRef.current.currentTime = 0;
      }
      
      setShowChatBubble(false);
      setIsFadingOut(true);
      // Navigate to future page after fade-out completes
      setTimeout(() => {
        navigate('/future');
      }, 2000); // 2 second delay for smooth fade-out transition
    }
  };

  const currentChat = chatMessages[currentChatIndex];

  return (
    <div className={`interaction-container ${isFadingIn ? 'fade-in' : ''} ${isFadingOut ? 'fade-out' : ''}`}>
      {/* Chat bubbles that appear sequentially */}
      {showChatBubble && (
        <div className="interaction-chat-container">
          <ChatBubble
            key={currentChatIndex} // Force re-render for new chat
            characterName={currentChat.characterName}
            message={currentChat.message}
            characterImage={currentChat.characterImage}
            onComplete={handleChatComplete}
            typingSpeed={currentChat.typingSpeed}
            showDelay={currentChat.showDelay}
            buttonDelay={currentChat.buttonDelay}
          />
        </div>
      )}
    </div>
  );
}
