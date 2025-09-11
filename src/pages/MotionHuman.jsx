import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MotionHuman.css';

// Import assets
import bg2 from '../assets/bg2.png';
import drone1 from '../assets/drone1.png';
import drone2 from '../assets/drone2.png';
import ladoA from '../assets/ladoA.png';
import ladoB from '../assets/ladoB.png';
import logo from '../assets/logo_human.exe.png';
import robo2 from '../assets/robo2.png';
import botao from '../assets/botão.png';

// Import sounds
import gameintroSound from '../sounds/gameintro.wav';

export default function MotionHuman() {
  const navigate = useNavigate();
  const gameintroAudioRef = useRef(null);

  // Play background music
  useEffect(() => {
    console.log("Setting up background music...");
    console.log("Gameintro sound path:", gameintroSound);
    
    // Only create audio if it doesn't exist
    if (!gameintroAudioRef.current) {
      gameintroAudioRef.current = new Audio(gameintroSound);
      gameintroAudioRef.current.loop = true;
      gameintroAudioRef.current.volume = 0.7;
      gameintroAudioRef.current.preload = 'auto';
      
      // Add event listeners for debugging
      gameintroAudioRef.current.addEventListener('loadstart', () => console.log("Audio load started"));
      gameintroAudioRef.current.addEventListener('canplay', () => console.log("Audio can play"));
      gameintroAudioRef.current.addEventListener('playing', () => console.log("Audio is playing"));
      gameintroAudioRef.current.addEventListener('error', (e) => console.log("Audio error:", e));
      gameintroAudioRef.current.addEventListener('ended', () => console.log("Audio ended"));
      gameintroAudioRef.current.addEventListener('pause', () => console.log("Audio paused"));
    }
    
    // Try to play immediately
    const playAudio = () => {
      if (gameintroAudioRef.current) {
        gameintroAudioRef.current.play().then(() => {
          console.log("Audio started playing successfully");
        }).catch(error => {
          console.log("Audio play failed:", error);
          // If autoplay fails, try multiple times with increasing delays
          setTimeout(() => {
            if (gameintroAudioRef.current) {
              gameintroAudioRef.current.play().catch(e => console.log("Retry 1 failed:", e));
            }
          }, 500);
          setTimeout(() => {
            if (gameintroAudioRef.current) {
              gameintroAudioRef.current.play().catch(e => console.log("Retry 2 failed:", e));
            }
          }, 1500);
          setTimeout(() => {
            if (gameintroAudioRef.current) {
              gameintroAudioRef.current.play().catch(e => console.log("Retry 3 failed:", e));
            }
          }, 3000);
        });
      }
    };
    
    // Try to play immediately
    playAudio();
    
    // Also try to play after a short delay to handle loading
    setTimeout(() => {
      playAudio();
    }, 100);
    
    // Also try to play on any user interaction
    const handleUserInteraction = () => {
      if (gameintroAudioRef.current && gameintroAudioRef.current.paused) {
        console.log("User interaction - trying to play audio");
        gameintroAudioRef.current.play().catch(e => console.log("User interaction play failed:", e));
      }
    };
    
    // Add click handler to the entire page to start audio
    const handlePageClick = () => {
      if (gameintroAudioRef.current && gameintroAudioRef.current.paused) {
        console.log("Page clicked - starting audio");
        gameintroAudioRef.current.play().catch(e => console.log("Page click play failed:", e));
      }
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('click', handlePageClick);
    document.addEventListener('touchstart', handlePageClick);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('click', handlePageClick);
      document.removeEventListener('touchstart', handlePageClick);
      // Clean up audio when component unmounts (navigating away)
      if (gameintroAudioRef.current) {
        gameintroAudioRef.current.pause();
        gameintroAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    console.log("MotionHuman component mounted!");
    console.log("Images loaded:", { bg2, drone1, drone2, ladoA, ladoB, robo2, logo, botao });
    
    // Function to wait for GSAP to be available
    const waitForGSAP = () => {
      return new Promise((resolve) => {
        const checkGSAP = () => {
          if (window.gsap && window.ScrollTrigger) {
            resolve();
          } else {
            setTimeout(checkGSAP, 100);
          }
        };
        checkGSAP();
      });
    };
    
    // Wait for GSAP to be available, then initialize
    waitForGSAP().then(() => {
      console.log("GSAP is now available!");
      
      // Use global GSAP from CDN
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      
      console.log("GSAP loaded:", gsap);
      console.log("ScrollTrigger loaded:", ScrollTrigger);
      
      // Register ScrollTrigger plugin
      gsap.registerPlugin(ScrollTrigger);
      
      // Wait for all images to load before initializing animations
      const images = document.querySelectorAll('img');
      let loadedImages = 0;
      const totalImages = images.length;

      const checkAllImagesLoaded = () => {
        loadedImages++;
        if (loadedImages === totalImages) {
          console.log("All images loaded, initializing animations...");
          initializeAnimations();
        }
      };

      const initializeAnimations = () => {
        // Check if elements exist
        const section = document.querySelector("section");
        const logo = document.querySelector("#logo");
        const robo = document.querySelector("#robo");
        console.log("Elements found:", { section, logo, robo });
        
        if (!section || !logo || !robo) {
          console.error("Required elements not found!");
          return;
        }

        // função para dividir palavras em grupos de 4
        function splitWords(selector) {
          document.querySelectorAll(selector).forEach(el => {
            console.log("Processing element:", el);
            console.log("Original text:", el.innerText);
            // Clean up the text and split by spaces
            let cleanText = el.innerText.replace(/\s+/g, ' ').trim();
            let words = cleanText.split(" ");
            console.log("Words array:", words);
            
            // Group words into chunks of 5
            let wordChunks = [];
            for (let i = 0; i < words.length; i += 3) {
              let chunk = words.slice(i, i + 3).join(" ");
              wordChunks.push(chunk);
            }
            console.log("Word chunks:", wordChunks);
            
            el.innerHTML = wordChunks.map(chunk => `<span>${chunk}&nbsp;</span>`).join("");
            console.log("New HTML:", el.innerHTML);
          });
        }
        splitWords(".split");
        
        // Wait a bit for DOM to update
        setTimeout(() => {
          console.log("Spans created:", document.querySelectorAll(".split span").length);
          console.log("All spans:", document.querySelectorAll(".split span"));
        }, 100); 

      // gsap.to() usado na capa do jogo para animar vários elementos juntos sincronizados
      let tl = gsap.timeline({
        scrollTrigger: {
          scrub: 1,
          start: "top top",
          end: "bottom top",
          trigger: "section"
        }
      });

      tl.to("#logo", {scale: 1.5}, 0)
      tl.to("#robo", {scale: 1.5}, 0)
      tl.to("#ladoA", {xPercent: -50}, 0)
      tl.to("#ladoB", {xPercent: 50}, 0)
      tl.to("#drone1", {xPercent: -20}, 0)
      tl.to("#drone2", {xPercent: 20}, 0)

      // animação de entrada dos textos usando gsap.fromTo()
      setTimeout(() => {
        document.querySelectorAll(".split").forEach(split => {
          gsap.set(split, {opacity: 1, clearProps: "none"}); 
          
          const spans = split.querySelectorAll("span");
          console.log("Spans found for animation:", spans.length);
          
          // Set initial state
          gsap.set(spans, {
            yPercent: 120,
            opacity: 0
          });
          
          // Animate in
          gsap.to(spans, {
            yPercent: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: split,
              start: "top 80%",
              end: "bottom 60%",
              scrub: 1,
              markers: false
            }
          });
        });
      }, 200);

      // animação da logo com gsap.fromTo()
      gsap.fromTo("#logo",
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2, ease: "power2.out",
          scrollTrigger: {
            trigger: "#logo",
            start: "top center",
            end: "bottom center",
            scrub: true
          }
        }
      );

      // pulse do botão usando gsap.fromTo()
      gsap.fromTo(".motion-start-button", 
        { scale: 1 },
        { scale: 1.05, duration: 0.8, repeat: -1, yoyo: true, ease: "power1.inOut" }
      );

        // animação de flutuar com gsap.fromTo()
        gsap.to("#robo", {
          yPercent: 2,             
          duration: 1.5,       
          ease: "power1.inOut",
          yoyo: true,        
          repeat: -1         
        });

      // Refresh ScrollTrigger to ensure all animations are properly initialized
      ScrollTrigger.refresh();
      
        console.log("All animations set up!");
      };

      // Add load event listeners to all images
      images.forEach(img => {
        if (img.complete) {
          checkAllImagesLoaded();
        } else {
          img.addEventListener('load', checkAllImagesLoaded);
          img.addEventListener('error', checkAllImagesLoaded); // Also count errors as "loaded"
        }
      });

      // If no images, initialize immediately
      if (totalImages === 0) {
        initializeAnimations();
      }
    });

    return () => {
      if (window.ScrollTrigger) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
    };
  }, []);

  const handleStartClick = () => {
    // Stop background music before navigating
    if (gameintroAudioRef.current) {
      gameintroAudioRef.current.pause();
      gameintroAudioRef.current = null;
    }
    navigate('/intro');
  };

  return (
    <div className="motion-human-page">
      <section>
        <img src={bg2} id="bg" alt="Background" />
        <img src={drone1} id="drone1" alt="Drone 1" />
        <img src={drone2} id="drone2" alt="Drone 2" />
        <img src={ladoA} id="ladoA" alt="Side A" />
        <img src={ladoB} id="ladoB" alt="Side B" /> 
        <img src={robo2} id="robo" alt="Robot" />
        <img src={logo} id="logo" alt="Logo" />
      </section>

      
      <div className="container">
        <div className="text-row">
          <h2 className="split left-text">
            O MUNDO COMO VOCÊ
            CONHECIA ACABOU. AS
            CORPORAÇÕES VENCERAM. A
            INTELIGÊNCIA ARTIFICIAL
            GOVERNA. E A HUMANIDADE...
            ESTÁ À BEIRA DO FIM.
          </h2>
          
          <h2 className="split right-text">
            MAS AINDA RESTAM CINCO
            ESPECIALISTAS ESCOLHIDOS
            A DEDO. A ÚLTIMA FAGULHA
            CONTRA O DOMÍNIO
          </h2>
        </div>
        
        <h2 className="text">
          O DESTINO DO MUNDO AGORA ESTÁ EM SUAS MÃOS
        </h2>

        <img 
          src={botao} 
          className="motion-start-button" 
          alt="Start Button"
          onClick={handleStartClick}
        />
      </div>

    </div>
  );
}