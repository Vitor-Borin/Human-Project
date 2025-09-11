import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TomadaAnimacao from '../assets/TomadaAnimacao.gif';
import './animation.css';

export default function Animation1() {
  const navigate = useNavigate();

  useEffect(() => {
    // After 3 seconds (adjust based on GIF duration), navigate to principal1
    const timer = setTimeout(() => {
      // Set flag that animation was completed
      localStorage.setItem('animationCompleted', 'true');
      console.log('Animation1 completed, navigating to principal1');
      navigate('/principal1');
    }, 3000); // 3 seconds - adjust this based on your GIF duration

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="animation-container">
      <img 
        src={TomadaAnimacao} 
        alt="Tomada Animation" 
        className="animation-gif"
      />
    </div>
  );
}
