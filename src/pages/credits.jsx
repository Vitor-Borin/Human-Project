import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './credits.css';

// Import sounds
import gameintroSound from '../sounds/gameintro.wav';

export default function Credits() {
  const navigate = useNavigate();
  const creditsContainerRef = useRef(null);
  const gameintroAudioRef = useRef(null);

  const credits = [
    "CRÉDITOS",
    "",
    "HUMAN.EXE",
    "",
    "Uma história sobre humanidade, tecnologia e redenção",
    "",
    "PERSONAGENS",
    "",
    "Ana Clara por Ana Clara Marques Morante",
    "Nicolas por Nicolas Freire Queiroz", 
    "Vitor por Vitor Gabriel Laurindo",
    "Winny por Winny Lopes Durães",
    "Yasmin por Yasmin Yshen Kang",
    "",
    "DESENVOLVIDO POR",
    "Equipe de Desenvolvimento: Ana, Nicolas, Vitor, Winny, Yasmin",
    "",
    "ROTEIRO",
    "Escritor Principal: Ana,Nicolas",
    "",
    "PROGRAMAÇÃO",
    "Desenvolvedor de Interface: Nicolas, Vitor",
    "Desenvolvedor de Jogos: Nicolas",
    "Desenvolvedor de Mobile: Yasmin",
    "Desenvolvedor de Animação: Ana",
    "",
    "ARTE E DESIGN",
    "Diretor de Arte",
    "Designer de Personagens: Nicolas",
    "Designer de Interface: Ana, Nicolas, Yasmin",
    "",
    "MARKETING",
    "Diretor de marketing: Winny",
    "",
    "SOUNDTRACK & SOUND EFFECTS",
    "Error Bleep 5 by original_sound -- https://freesound.org/s/372201/ -- License: Attribution 3.0",
    "User Interface fanfare end reached success victory finished by jerry.berumen -- https://freesound.org/s/772763/ -- License: Attribution 4.0",
    "Rush - Clint Soundtrack by HyperBrid -- https://freesound.org/s/517542/ -- License: Attribution 4.0",
    "Atmospheric Mystery by LolaMoore -- https://freesound.org/s/759608/ -- License: Attribution 4.0",
    "Machine Motor by AUDACITIER -- https://freesound.org/s/632233/ -- License: Attribution 4.0",
    "",
    "Alien landing by BloodPixelHero -- https://freesound.org/s/591091/ -- License: Attribution 4.0",
    "",
    "TECNOLOGIA",
    "React.js",
    "CSS3 Animations",
    "Web Audio API",
    "GSAP",
    "",
    "ILUSTRAÇÕES COMPLEMENTARES",
    "https://br.freepik.com/vetores-gratis/padrao-pontilhado-de-meio-tom-pixelado-abstrato-em-estilo-retro_418611157.htm",
    "starline - Freepik.com",
    "NonBinary Background",
    "https://br.freepik.com/vetores-gratis/fluxo-de-vetor-de-design-de-codigo-binario_25519679.htm",
    "rawpixel.com - Freepik.com",
    "Vidro",
    "https://br.freepik.com/fotos-gratis/textura-de-vidro-quebrado_27504247.htm",
    "Freepik",
    "Celular",
    "https://br.freepik.com/vetores-gratis/smartphone-realista-com-ecra-branco_2465615.htm",
    "Freepik",
    "CyberBackground",
    "https://br.freepik.com/vetores-gratis/cidade-da-noite-futura-com-arranha-ceus-futuristas_6612179.htm",
    "upklyak - Freepik.com",
    "Freepik",
    "Fundo vhs effect",
    "https://br.freepik.com/vetores-gratis/fundo-de-efeito-vhs-realista_36860752.htm",
    "Freepik",
    "",
    "© 2024 HUMAN.EXE",
    "Todos os direitos reservados",
    "",
    "Obrigado por jogar!",
    "",
    "A humanidade sempre encontrará um caminho...",
    "",
    "FIM",
    "",
 
  ];

  // Play background music
  useEffect(() => {
    console.log("Setting up credits background music...");
    
    // Initialize and start the gameintro sound
    const initializeSound = () => {
      try {
        gameintroAudioRef.current = new Audio(gameintroSound);
        gameintroAudioRef.current.loop = true;
        gameintroAudioRef.current.volume = 0.5;
        gameintroAudioRef.current.preload = 'auto';
        
        // Add event listeners for debugging
        gameintroAudioRef.current.addEventListener('loadstart', () => console.log("Credits audio load started"));
        gameintroAudioRef.current.addEventListener('canplay', () => console.log("Credits audio can play"));
        gameintroAudioRef.current.addEventListener('playing', () => console.log("Credits audio is playing"));
        gameintroAudioRef.current.addEventListener('error', (e) => console.log("Credits audio error:", e));
        
        gameintroAudioRef.current.play().then(() => {
          console.log("Credits audio started playing successfully");
        }).catch(e => {
          console.log("Could not play credits audio:", e);
          // Try again after a short delay
          setTimeout(() => {
            if (gameintroAudioRef.current) {
              gameintroAudioRef.current.play().catch(err => console.log("Retry failed:", err));
            }
          }, 1000);
        });
      } catch (e) {
        console.log('Error initializing credits audio:', e);
      }
    };
    
    // Initialize sound immediately
    initializeSound();
    
    // Also try to play on any user interaction
    const handleUserInteraction = () => {
      if (gameintroAudioRef.current && gameintroAudioRef.current.paused) {
        console.log("User interaction - trying to play credits audio");
        gameintroAudioRef.current.play().catch(e => console.log("User interaction play failed:", e));
      }
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      // Don't clean up audio here - let it continue playing
    };
  }, []);

  useEffect(() => {
    // After credits finish scrolling (120 seconds), wait 15 seconds, then navigate back to main menu
    const timer = setTimeout(() => {
      // Stop the background music before navigating
      if (gameintroAudioRef.current) {
        gameintroAudioRef.current.pause();
        gameintroAudioRef.current.currentTime = 0;
        gameintroAudioRef.current = null;
      }
      navigate('/');
    }, 135000); // 120 seconds for animation + 15 seconds delay

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="credits-page">
      {/* Credits text container */}
      <div className="credits-container" ref={creditsContainerRef}>
        <div className="credits-content">
          {credits.map((line, index) => (
            <div 
              key={index} 
              className={`credits-line ${line === "CRÉDITOS" ? "title" : ""} ${line === "HUMAN.EXE" ? "game-title" : ""} ${line === "" ? "spacing" : ""}`}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
