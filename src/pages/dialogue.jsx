import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBubble from '../components/ChatBubble';

export default function Dialogue() {
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const navigate = useNavigate();

  const chatSequences = [
    {
      characterName: "Agente Anônimo",
      message: "Olá, recrutas! A partir de agora, vocês estão sob proteção máxima da Força Nacional de Resistência. São os últimos humanos fora da nossa base que ainda não foram controlados pela IA Maligna.",
      characterImage: "/src/assets/agent.png"
    },
    {
      characterName: "Agente Anônimo",
      message: "Sua missão é clara: libertar o mundo das garras da Destruidora, desativando a conexão neural que mantém a humanidade aprisionada.",
      characterImage: "/src/assets/agent.png"
    },
    {
      characterName: "Agente Anônimo",
      message: "Seus equipamentos foram projetados com tecnologia de ponta. Desenvolvemos, em nosso laboratório, uma nova IA aliada — criada do zero — capaz de aprimorar suas habilidades físicas, mentais e estratégicas. Ela estará ao lado de vocês em cada passo.",
      characterImage: "/src/assets/agent.png"
    },
    {
      characterName: "Agente Anônimo",
      message: "Cada base inimiga possui defesas únicas, códigos imprevisíveis e desafios letais. Mas acreditamos no impossível. E acreditamos em vocês.",
      characterImage: "/src/assets/agent.png"
    },
    {
      characterName: "Agente Anônimo",
      message: "O mundo depende dessa missão. Vocês não podem falhar.",
      characterImage: "/src/assets/agent.png"
    },
    {
      characterName: "Agente Anônimo",
      message: "Boa sorte, agentes.",
      characterImage: "/src/assets/agent.png"
    }
  ];

  const handleChatComplete = () => {
    if (currentChatIndex < chatSequences.length - 1) {
      // Move to next chat
      setCurrentChatIndex(currentChatIndex + 1);
    } else {
      // All chats completed, set flag and navigate to principal page
      console.log('All dialogue completed! Navigating to principal page...');
      localStorage.setItem('dialogueCompleted', 'true');
      navigate('/principal');
    }
  };

  const currentChat = chatSequences[currentChatIndex];

  return (
    <div className="dialogue-container">
      <ChatBubble
        key={currentChatIndex} // Force re-render for new chat
        characterName={currentChat.characterName}
        message={currentChat.message}
        characterImage={currentChat.characterImage}
        onComplete={handleChatComplete}
        typingSpeed={50}
        showDelay={1000}
        buttonDelay={500}
      />
    </div>
  );
}
