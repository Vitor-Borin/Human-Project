import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TomadaAnimacao from '../assets/TomadaAnimacao.gif';
import './animation.css';

export default function Animation2() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Animation2 component mounted');
    // After 3 seconds (adjust based on GIF duration), navigate to principal2
    const timer = setTimeout(() => {
      // Set flag that animation was completed
      localStorage.setItem('animationCompleted', 'true');
      console.log('Animation2 completed, navigating to principal2');
      navigate('/principal2');
    }, 3000); // 3 seconds - adjust this based on your GIF duration

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleImageLoad = () => {
    console.log('Animation2 GIF loaded successfully');
  };

  const handleImageError = (e) => {
    console.error('Animation2 GIF failed to load:', e);
  };

  return (
    <div className="animation-container">
      <img 
        src={TomadaAnimacao} 
        alt="Tomada Animation" 
        className="animation-gif"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
}
