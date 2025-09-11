import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './characters.css';

// Importando imagens
import anaPink from '../assets/anapink.png';
import winnyPurple from '../assets/winnypurple.png';
import yasCyan from '../assets/yascyan.png';
import nicGreen from '../assets/nicgreen.png';
import vitorBlue from '../assets/vitorblue.png';
import ana from '../assets/AnaC.png';
import win from '../assets/WinnyC.png';
import yas from '../assets/Yasmin.png';
import nic from '../assets/NicolasC.png';
import vit from '../assets/VitorC.png';
import BackBtn from '../assets/backbtn.png';
import StartBtn from '../assets/startbtn.png';
import Cdetail1 from '../assets/Cdetail1.png';
import CDetail2 from '../assets/CDetail2.png';
import Cdetail3 from '../assets/Cdetail3.png';
import Cdetail4 from '../assets/Cdetail4.png';
import WDetail1 from '../assets/WDetail1.png';
import Ydetail1 from '../assets/Ydetail1.png';
import Ndetail1 from '../assets/Ndetail1.png';
import Vdetail1 from '../assets/Vdetail1.png';
import Ydetail2 from '../assets/Ydetail2.png';
import Ydetail3 from '../assets/Ydetail3.png';
import Ydetail4 from '../assets/Ydetail4.png';
import WDetail2 from '../assets/WDetail2.png';
import WDetail3 from '../assets/WDetail3.png';
import WDetail4 from '../assets/WDetail4.png';
import Ndetail2 from '../assets/Ndetail2.png';
import Ndetail3 from '../assets/Ndetail3.png';
import Ndetail4 from '../assets/Ndetail4.png';
import Vdetail2 from '../assets/Vdetail2.png';
import Vdetail3 from '../assets/Vdetail3.png';
import Vdetail4 from '../assets/Vdetail4.png';
import hoverEffectSound from '../sounds/hoverEffect.wav';
import charactersSound from '../sounds/charactersSound.wav';


export default function Characters() {
  const navigate = useNavigate();
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const charactersAudioRef = useRef(null);

  // Start characters sound when component mounts
  useEffect(() => {
    charactersAudioRef.current = new Audio(charactersSound);
    charactersAudioRef.current.loop = true;
    charactersAudioRef.current.volume = 0.4;
    charactersAudioRef.current.play().catch(e => console.log('Could not play characters sound:', e));

    // Cleanup function to stop sound when component unmounts
    return () => {
      if (charactersAudioRef.current) {
        charactersAudioRef.current.pause();
        charactersAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  const characters = [
    { 
      id: 1, 
      color: "#FF1493", 
      backgroundImage: anaPink, 
      image: ana,
      imageStyle: { width: '180%', top: '53%', left: '50%', transform: 'translate(-50%, -50%)' },
      // Detailed character information
      fullName: "ANA CLARA",
      age: "19 ANOS",
      hobby: "TOCAR PIANO",
      traits: ["CRIATIVA", "VISIONÁRIA", "INTENSA"],
      stats: {
        forca: 55,
        inteligencia: 80,
        rapidez: 90,
        raciocinio: 70
      },
      backstory: "NO PASSADO, PERDEU SEU AMOR PELAS MÁQUINAS, DESDE ENTÃO GUARDA ESSE VAZIO COMO COMBUSTÍVEL",
      quote: "ENXERGO CONEXÕES QUE NINGUÉM MAIS PERCEBE...MINHA MENTE VIVE CRIANDO NOVAS FORMAS DE TRANSFORMAR O CAOS EM ARTE",
      detailImage: Cdetail1,
      cdetail2Image: CDetail2,
      cdetail3Image: Cdetail3,
      cdetail4Image: Cdetail4
    },
    { 
      id: 2, 
      color: "#6F01F4", 
      backgroundImage: winnyPurple, 
      image: win,
      imageStyle: { width: '200%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
      // Detailed character information
      fullName: "WINNY",
      age: "21 ANOS",
      hobby: "APRENDER",
      traits: ["LÓGICA", "ESTRATÉGICA", "ANALÍTICA"],
      stats: {
        forca: 45,
        inteligencia: 80,
        rapidez: 60,
        raciocinio: 90
      },
      backstory: "CRESCIDA EM LABORATÓRIOS, APRENDEU A FALAR COM CÓDIGOS ANTES DE APRENDER A FALAR COM PESSOAS.",
      quote: "PROBLEMAS SÃO SÓ ENIGMAS DISFARÇADOS. ENQUANTO TODO MUNDO ENTRA EM PÂNICO, EU JÁ ESTOU CALCULANDO A SAÍDA.",
      detailImage: WDetail1,
      cdetail2Image: WDetail2,
      cdetail3Image: WDetail3,
      cdetail4Image: WDetail4
    },
    { 
      id: 3, 
      color: "#35F1DE", 
      backgroundImage: yasCyan, 
      image: yas,
      imageStyle: { width: '185%', top: '53%', left: '50%', transform: 'translate(-50%, -50%)' },
      // Detailed character information
      fullName: "YASMIN",
      age: "21 ANOS",
      hobby: "PROGRAMAÇÃO",
      traits: ["EMPÁTICA", "OBSERVADORA", "INSPIRADORA"],
      stats: {
        forca: 45,
        inteligencia: 80,
        rapidez: 60,
        raciocinio: 70
      },
      backstory: "APRENDEU DESDE CEDO A OUVR MAIS DO QUE FALAR. ENCONTROU FORÇAS NOS AMIGOS, MESMO QUANDO O MUNDO PARECE DESABAR.",
      quote: "MINHA FORÇA É MANTER O GRUPO UNIDO, NÃO IMPORTA O QUE ACONTEÇA",
      detailImage: Ydetail1,
      cdetail2Image: Ydetail2,
      cdetail3Image: Ydetail3,
      cdetail4Image: Ydetail4
    },
    { 
      id: 4, 
      color: "#3CEE8C", 
      backgroundImage: nicGreen, 
      image: nic,
      imageStyle: { width: '190%', top: '52%', left: '50%', transform: 'translate(-50%, -50%)' },
      // Detailed character information
      fullName: "NICOLAS",
      age: "19 ANOS",
      hobby: "LEITURA",
      traits: ["CORAJOSO", "PROTETOR", "DETERMINADO"],
      stats: {
        forca: 55,
        inteligencia: 80,
        rapidez: 70,
        raciocinio: 80
      },
      backstory: "PERDEU SEU SONHO DE SE FORMAR, QUANDO AS CORPORAÇÕES FECHARAM AS UNIVERSIDADES. VIVE PARA PROTEGER OS POUCOS QUE SOBRARAM.",
      quote: "SE ALGUÉM PRECISA IR NA FRENTE, EU VOU. NÃO PENSO DUAS VEZES SE FOR PRA PROTEGER QUEM TÁ COMIGO.",
      detailImage: Ndetail1,
      cdetail2Image: Ndetail2,
      cdetail3Image: Ndetail3,
      cdetail4Image: Ndetail4
    },
    { 
      id: 5, 
      color: "#004FA9", 
      backgroundImage: vitorBlue, 
      image: vit,
      imageStyle: { width: '190%', top: '53%', left: '50%', transform: 'translate(-50%, -50%)' },
      // Detailed character information
      fullName: "VITOR",
      age: "19 ANOS",
      hobby: "FOTOGRAFIA",
      traits: ["ÁGIL", "IMPROVISADOR", "DESTEMIDO"],
      stats: {
        forca: 80,
        inteligencia: 70,
        rapidez: 75,
        raciocinio: 80
      },
      backstory: "VITOR ERA UM FOTOGRÁFO AMADOR, QUE TEVE QUE LARGAR TUDO PARA TRÁS QUANDO AS MÁQUINAS TOMARAM CONTA DE TUDO.",
      quote: "CADA CANTO É ÚNICO, TODO LUGAR TEM SUA BELEZA. E O MELHOR DE TUDO É QUE EU TENHO ACESSO A TODOS.",
      detailImage: Vdetail1,
      cdetail2Image: Vdetail2,
      cdetail3Image: Vdetail3,
      cdetail4Image: Vdetail4
    }
  ];

  const handleCharacterClick = (character) => setSelectedCharacter(character);
  const handleBackClick = () => setSelectedCharacter(null);
  const handleStartClick = () => {
    // Stop characters sound when starting the game
    if (charactersAudioRef.current) {
      charactersAudioRef.current.pause();
      charactersAudioRef.current.currentTime = 0;
    }
    navigate('/dialogue');
  };
  
  const handleCharacterHover = () => {
    const audio = new Audio(hoverEffectSound);
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  if (selectedCharacter) {
    return (
      <div className="expanded-character" style={{ backgroundColor: selectedCharacter.color }}>
        {/* Background image */}
        <img 
          src={selectedCharacter.backgroundImage} 
          alt="Background" 
          className="character-background-image"
        />
        
        <button className="back-button" onClick={handleBackClick}>
          <img src={BackBtn} alt="Voltar" className="back-button-img" />
        </button>
        
        <div className="character-detail-container">
          {/* Cdetail1 - Top separator */}
          <div className="cdetail1-container">
            <img src={selectedCharacter.detailImage} alt="Separator" className="cdetail1-image" />
          </div>
          
          {/* Main content area */}
          <div className="main-content-area">
            {/* Left side - CDetail2 with information */}
            <div className="cdetail2-container">
              <img src={selectedCharacter.cdetail2Image} alt="Character Info" className="cdetail2-image" />
              <div className="cdetail2-content">
                <div className="backstory-text">
                  {selectedCharacter.backstory}
                </div>
                <div className="quote-text">
                  "{selectedCharacter.quote}"
                </div>
              </div>
            </div>
            
            {/* Right side - Cdetail3 and Cdetail4 stacked vertically */}
            <div className="right-details-container">
              {/* Cdetail3 - Character details */}
              <div className="cdetail3-container">
                <img src={selectedCharacter.cdetail3Image} alt="Character Details" className="cdetail3-image" />
                <div className="cdetail3-content">
                  <div className="character-details">
                    <div className="detail-row">
                      <span className="detail-label">NOME:</span>
                      <span className="detail-value">{selectedCharacter.fullName}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">IDADE:</span>
                      <span className="detail-value">{selectedCharacter.age}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">HOBBY:</span>
                      <span className="detail-value">{selectedCharacter.hobby}</span>
                    </div>
                    
                    <div className="separator-line"></div>
                    
                    <div className="traits-section">
                      {selectedCharacter.traits.map((trait, index) => (
                        <div key={index} className="trait-item">• {trait}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Cdetail4 - Stats */}
              <div className="cdetail4-container">
                <img src={selectedCharacter.cdetail4Image} alt="Character Stats" className="cdetail4-image" />
                <div className="cdetail4-content">
                  <div className="stats-section">
                    <div className="stat-row">
                      <span className="stat-label">FORÇA:</span>
                      <span className="stat-value">{selectedCharacter.stats.forca}%</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">INTELIGÊNCIA:</span>
                      <span className="stat-value">{selectedCharacter.stats.inteligencia}%</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">RAPIDEZ:</span>
                      <span className="stat-value">{selectedCharacter.stats.rapidez}%</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">RACIOCÍNIO LÓGICO:</span>
                      <span className="stat-value">{selectedCharacter.stats.raciocinio}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Character image on the right */}
          <div className="character-image-section">
            <img 
              src={selectedCharacter.image} 
              alt={selectedCharacter.name} 
              className="character-detail-image"
              style={selectedCharacter.name === "Winny" ? { maxWidth: '170%', maxHeight: '115%' } : {}}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="characters-container">
      <button className="start-button" onClick={handleStartClick}>
        <img src={StartBtn} alt="Começar" className="start-button-img" />
      </button>

      {characters.map((character) => (
        <div
          key={character.id}
          className="character-rectangle"
          style={{ 
            backgroundColor: character.color,
            backgroundImage: character.backgroundImage ? `url(${character.backgroundImage})` : 'none',
            backgroundSize: character.backgroundImage ? 'cover' : 'auto',
            backgroundPosition: character.backgroundImage ? 'center' : 'auto',
            backgroundRepeat: character.backgroundImage ? 'no-repeat' : 'auto',
          }}
          onClick={() => handleCharacterClick(character)}
        >
          {character.image && (
            <img 
              src={character.image} 
              alt={character.name} 
              className="character-image" 
              style={character.imageStyle}
              onMouseEnter={handleCharacterHover}
            />
          )}
          <span className="character-name">{character.name}</span>
        </div>
      ))}
    </div>
  );
}
