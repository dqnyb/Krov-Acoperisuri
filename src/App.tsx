import './App.css';
import background1 from './assets/Group 42.png';
import background2 from './assets/Poza hero.svg';//
import logo from "./assets/Logo Krov 1.svg";//
import heroline from "./assets/Line 3.png"
import aboutusline from "./assets/Line 2.png"
import aboutusimage from "./assets/IMG-057cfa42c102590805aac385f53cbbf4-V 1.png"//
import aboutusblueimage from "./assets/Group 43.png"
import secrivesbg from "./assets/Group 69.jpg"//
import servicecard1 from "./assets/Rectangle 41 1.jpg"//
import servicecard2 from "./assets/Group 45 1.jpg"//
import servicecard3 from "./assets/image 1.jpg"//
import galleryline from "./assets/Line 4 (1).png"
import FAQvector from "./assets/Vector 3.png"
import plus from "./assets/+.png"
import footercard from "./assets/Group 67.jpg"//
import { useState, useEffect } from "react";
import facebook from "./assets/ic_baseline-facebook.png"
import instagram from "./assets/mdi_instagram.png"
import tiktok from "./assets/ic_baseline-tiktok.png"
import footerline from "./assets/Line 16 (1).png"
import mobilefooter from "./assets/Group 71.jpg"//
import LiveChat from "./LiveChat";
import PhoneIcon from "./assets/material-symbols_call.png"
import decking from "./assets/decking.webp"
import sindrila from "./assets/sindrila.webp"
import fixare from "./assets/suruburi, piulite si cuie.jpg"
import lemn from "./assets/IMG-56c6529f6aeb21cf20480b7d941c1e24-V.jpg"
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const services = [
                {
                  text: "Țiglă metalică",
                  img: servicecard1,
                  link: "/tigla-metalica"
                },
                {
                  text: "Țiglă ceramică",
                  img: servicecard2,
                  link: "/tigla-ceramica"
                },
                {
                  text: "Streașini personalizate",
                  img: servicecard3,
                  link: "/streasini-personalizate"
                },
                {
                  text: "Decking",
                  img: decking,
                  link: "/decking"
                },
                {
                  text: "Șindrilă bituminoasă",
                  img: sindrila,
                  link: "/sindrila-bituminoasa"
                },
                {
                  text: "Lemn pentru acoperiș",
                  img: lemn,
                  link: "/lemn-pentru-acoperis"
                },
                {
                  text: "Sisteme de fixare",
                  img: fixare,
                  link: "/sisteme-de-fixare"
                },
              ];

  const faqData = [
    {
      question: "Oferiți consultanță gratuită?",
      answer: "Da, oferim consultanță gratuită pentru toate proiectele dumneavoastră."
    },
    {
      question: "Ce garanție oferiți pentru lucrări?",
      answer: "Oferim garanție de până la 3 ani pentru lucrările executate."
    },
    {
      question: "Pot cumpăra doar materialele fără montaj?",
      answer: "Da, puteți achiziționa doar materialele fără serviciul de montaj."
    },
    {
      question: "Lucrați și cu persoane juridice (companii)?",
      answer: "Da, colaborăm atât cu persoane fizice, cât și cu companii."
    },
    {
      question: "Cum pot cere o ofertă?",
      answer: "Ne puteti contacta telefonic la numarul indicat pe site sau sa ne scrieti  prin chatbotul companiei."
    }
  ];

  const [isMobile, setIsMobile] = useState(window.innerWidth < 930);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  
  const [mobileCardIndex, setMobileCardIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMobileCardIndex((prev) => 
        isMobile 
          ? (prev + 1) % services.length   // Mobile: advance by 1
          : (prev + 3) % services.length   // Desktop: advance by 3
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [services.length, isMobile]); // Added isMobile dependency

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 930) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [navbarCompressed, setNavbarCompressed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const homeSection = document.getElementById("home");
      if (!homeSection) return;
      const homeBottom = homeSection.offsetTop + homeSection.offsetHeight;
      if (window.scrollY > homeBottom - 80) {
        setNavbarCompressed(true);
      } else {
        setNavbarCompressed(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 930);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Galerie slider state
  const galleryImages = Object.values(
    import.meta.glob('./assets/galerie/*.{jpg,jpeg,png,gif,webp}', { eager: true, query: '?url', import: 'default' })
  ) as string[];
  const [galleryIndex, setGalleryIndex] = useState(0);

  const visibleImages = isMobile
    ? [galleryImages[galleryIndex % galleryImages.length]]
    : [
        galleryImages[galleryIndex % galleryImages.length],
        galleryImages[(galleryIndex + 1) % galleryImages.length],
        galleryImages[(galleryIndex + 2) % galleryImages.length],
      ];

  const handlePrev = () => {
    setGalleryIndex((prev) =>
      isMobile
        ? (prev - 1 + galleryImages.length) % galleryImages.length
        : (prev - 3 + galleryImages.length) % galleryImages.length
    );
  };

  const handleNext = () => {
    setGalleryIndex((prev) =>
      isMobile
        ? (prev + 1) % galleryImages.length
        : (prev + 3) % galleryImages.length
    );
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      {/* Hamburger icon for mobile */}
      <button
        className={`hamburger-menu${mobileMenuOpen ? " open" : ""}`}
        onClick={() => setMobileMenuOpen((v) => !v)}
        aria-label="Open navigation menu"
      >
        {!mobileMenuOpen ? (
          // Black hamburger SVG icon
          <svg width="32" height="32" viewBox="0 0 32 32" style={{display: 'block'}} fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="6" width="32" height="4" rx="2" fill="#111"/>
            <rect y="14" width="32" height="4" rx="2" fill="#111"/>
            <rect y="22" width="32" height="4" rx="2" fill="#111"/>
          </svg>
        ) : (
          <>
            <span />
            <span />
            <span />
          </>
        )}
      </button>
      {/* Desktop Navbar */}
      <div className={`navbar${navbarCompressed ? " navbar-compressed" : ""}`}>
        <ul className='navbar-list'>
          <li className='navbar-list-item'><a href="#home" onClick={e => handleNavClick(e, "home")}>Acasă</a></li>
          <li className='navbar-list-item'><a href="#about" onClick={e => handleNavClick(e, "about")}>Companie</a></li>
          <li className='navbar-list-item'><a href="#services" onClick={e => handleNavClick(e, "services")}>Produse & Servicii</a></li>
          <li className='navbar-list-item'><a href="#gallery" onClick={e => handleNavClick(e, "gallery")}>Galerie</a></li>
          <li className='navbar-list-item'><a href="#faq" onClick={e => handleNavClick(e, "faq")}>FAQ</a></li>
          <li className='navbar-list-item'><a href="#contact" onClick={e => handleNavClick(e, "contact")}>Contact</a></li>
        </ul>
      </div>
  
      {mobileMenuOpen && (
        <div className="mobile-navbar-overlay">
          <button
            className="mobile-navbar-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Închide meniul"
          >
            {/* White X SVG */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <line x1="8" y1="8" x2="24" y2="24" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
              <line x1="24" y1="8" x2="8" y2="24" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </button>
          <ul className='mobile-navbar-list'>
            <li><a href="#home" onClick={e => handleNavClick(e, "home")}>Acasă</a></li>
            <li><a href="#about" onClick={e => handleNavClick(e, "about")}>Companie</a></li>
            <li><a href="#services" onClick={e => handleNavClick(e, "services")}>Produse & Servicii</a></li>
            <li><a href="#gallery" onClick={e => handleNavClick(e, "gallery")}>Galerie</a></li>
            <li><a href="#faq" onClick={e => handleNavClick(e, "faq")}>FAQ</a></li>
            <li><a href="#contact" onClick={e => handleNavClick(e, "contact")}>Contact</a></li>
          </ul>
        </div>
      )}
      <div className={`navbar-phone-number${navbarCompressed ? " navbar-compressed" : ""}`}>
        <img src={PhoneIcon} className="navbar-phone-icon" alt="Phone" />
        <a
          className="navbar-phone-text"
          href="tel:+37368626333"
        >
          (+373) 686-26-333
        </a>
      </div>
      <div className='Hero' id="home">
        <div className='Hero-background'>
          <img src={background1}  className='Hero-background-image1' />
          <img src={background2}  className='Hero-background-image2' />
        </div>
        <div className='Hero-logo'>
          <div className='Hero-logo-bg'></div>
          <img src={logo} className='Hero-logo-image' />
        </div>
        <div className='Hero-text'>
          <img src={heroline} className='Hero-text-line' />
          <h1 className='Hero-text-title-one'>Expertiză în</h1>
          <h1 className='Hero-text-title-two'>fiecare șurub</h1>
          <h1 className='Hero-text-title-three'>
            <span className="bold">Soluții</span> complete pentru <span className="bold">case</span> și <span className="bold">afaceri.</span>
          </h1>
          <button className='Hero-text-button'
          onClick={() => {
              const section = document.getElementById("services");
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
              }
            }}
              >Produsele Noastre
          </button>
        </div>
        </div>
        <div className='AboutUs'>
          <h1 className='AboutUs-title'>Cine <span className="bold-aboutus">Suntem Noi?</span></h1>
          <h1 className='AboutUs-description-one'>
              <span className="bold-aboutus">Krov Acoperișuri</span>
              este o companie de referință în domeniul construcțiilor de acoperișuri și sisteme de drenaj, fondată de profesioniștii <span className="italic-text">Andrian Friiuc</span> și <span className="italic-text">Marcel Papuc</span>.<br />
              Compania noastra asigura clienților din întreaga Republică Moldova servicii complete și materiale de înaltă calitate pentru acoperișuri și garduri.
            </h1>
          <h1 className='AboutUs-description-two'><span className="bold-aboutus">Domeniile noastre de expertiză</span></h1>
          <ul className='AboutUs-description-three'>
            <li>Construcția și reparația acoperișurilor, adaptate oricărui tip de clădire </li>
            <li>Instalarea sistemelor de streașină și scurgere, pentru durabilitate și protecție optimă</li>
            <li>Comercializarea materialelor aferente (tablă, țiglă metalică, jgheaburi, burlane etc.), selectate după cele mai riguroase standarde de calitate</li>
          </ul>
          <h1 className='AboutUs-description-four'>
              Echipa noastră combină experiența solidă în construcții cu o abordare
              modernă, pentru a livra soluții personalizate, eficiente și durabile. Indiferent de
              complexitatea proiectului, ne angajăm să respectăm termenele convenite și
              să oferim suport tehnic de la consultanță și proiectare, până la execuție și
              mentenanță.<br />
              Sediul juridic este la Chișinău, str. Bogdan Voievod nr. 10/1, și biroul
              operațional pe str. Studenților nr. 2/4.
            </h1>
          <img src={aboutusline} className='AboutUS-line'  id="about"/>
          <img src={aboutusimage} className="AboutUS-image" />
          <img src={aboutusblueimage} className="AboutUS-image-blue" />
          <button
            className='AboutUS-button'
            onClick={() => {
              const section = document.getElementById("gallery");
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Galerie
          </button>
        </div>
        <div className='Services' id="services">
  <img src={secrivesbg} className='Services-bg' />
  <h1 className='Services-company'>Krov Acoperișuri</h1>
  <h1 className='Services-title'><span className="bold-aboutus">Produse </span> & Servicii</h1>
  <div className='Services-slider'>
    <button
      className="services-arrow-left"
      onClick={() => setMobileCardIndex((prev) => 
        isMobile 
          ? (prev - 1 + services.length) % services.length  // Mobile: go back 1
          : (prev - 3 + services.length) % services.length  // Desktop: go back 3
      )} 
      aria-label="Serviciu anterior"
    >
      &#8592;
    </button>
    <ul className='Services-list'>
      {isMobile
        ? [services[mobileCardIndex % services.length]].map((card) => (
            <li
              className='Services-card'
              key={`${card.text}-mobile-${mobileCardIndex}`}
              onClick={() => navigate(card.link)}
              tabIndex={0}
              role="button"
              aria-label={card.text}
            >
              <div className='Services-card-border'>
                <h1 className='Services-card-text'>{card.text}</h1>
              </div>
              <img src={card.img} className='Services-card-image' alt={card.text} />
            </li>
          ))
        : [0, 1, 2].map((offset) => {
            const idx = (mobileCardIndex + offset) % services.length;
            const card = services[idx];
            return (
              <li
                className='Services-card'
                key={card.text}
                onClick={() => window.open(card.link, "_blank")}
                tabIndex={0}
                role="button"
                aria-label={card.text}
              >
                <div className='Services-card-border'>
                  <h1 className='Services-card-text'>{card.text}</h1>
                </div>
                <img src={card.img} className='Services-card-image' alt={card.text} />
              </li>
            );
          })}
    </ul>
    <button
      className="services-arrow-right"
      onClick={() => setMobileCardIndex((prev) => 
        isMobile 
          ? (prev + 1) % services.length  // Mobile: go forward 1
          : (prev + 3) % services.length  // Desktop: go forward 3
      )} 
      aria-label="Serviciu următor"
    >
      &#8594;
    </button>
  </div>
</div>
        <div className='Gallery' id="gallery">
          <h1 className='Gallery-title'>Galerie</h1>
          <img src={aboutusline} className='Gallery-line' />
          <h1 className='Gallery-description'>Descoperă proiectele noastre finalizate, realizate cu grijă, precizie și materiale de top.</h1>
          <img src={galleryline} className='Gallery-line-two' />
          {/* Carousel cu imagini */}
          <div className="gallery-slider">
            <button
              className="gallery-arrow"
              onClick={handlePrev}
              aria-label="Imagine anterioară"
            >
              &#8592;
            </button>
            <div className="gallery-slider-images">
              {visibleImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Galerie ${galleryIndex + idx + 1}`}
                  className="gallery-slider-image"
                  onClick={() => setSelectedImage(src)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
            <button
              className="gallery-arrow"
              onClick={handleNext}
              aria-label="Imagine următoare"
            >
              &#8594;
            </button>
          </div>
          {/* Lightbox modal */}
          {selectedImage && (
            <div className="gallery-lightbox" onClick={() => setSelectedImage(null)}>
              <img
                src={selectedImage}
                alt="Imagine mărită"
                className="gallery-lightbox-image"
                onClick={e => e.stopPropagation()}
              />
              <button className="gallery-lightbox-close" onClick={() => setSelectedImage(null)} aria-label="Închide imaginea">
                &times;
              </button>
            </div>
          )}
        </div>
        <div className='FAQ' id="faq">
          <h1 className='FAQ-title'>FAQ's</h1>
          <img src={aboutusline} className='FAQ-line' />
          <img src={FAQvector} className='FAQ-vector' />
          <ul className='FAQ-list'>
            {faqData.map((faq, idx) => (
              <li
                key={faq.question}
                className={`FAQ-question-one${openIndex === idx ? " open" : ""}`}
                onClick={() => handleToggle(idx)}
                style={{
                  background: openIndex === idx ? "#17405a" : "#2C5B7C",
                  transition: "background 0.25s, min-height 0.25s",
                  minHeight: openIndex === idx ? "8vw" : "auto"
                }}
              >
                <span className="FAQ-icon">
                  <img
                    src={plus}
                    style={{
                      transition: "transform 0.2s, opacity 0.2s",
                      opacity: openIndex === idx ? 0 : 1,
                    }}
                  />
                  {openIndex === idx && (
                    <span className="minus-bar" />
                  )}
                </span>
                <div style={{ flex: 1 }}>
                  <h1>{faq.question}</h1>
                  {openIndex === idx && (
                    <div className="FAQ-answer">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className='Footer' id="contact">
          <img src={footercard} className='Footer-bg'/>
          <img src={mobilefooter} className='Footer-mobile-bg'/>
          <h1 className='Footer-text'>Contactați-ne pentru Assistență</h1>
          <ul className='Footer-socials'>
            <li className='Footer-socials-facebook'>
              <a
                href="https://www.facebook.com/p/Krov-Acoperisuri-100083426166733/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={facebook} alt="" />
              </a>
            </li>
            <li className='Footer-socials-instagram'>
              <a 
                href="https://www.instagram.com/krovacoperisuri?igsh=MWZ0ZzJxdXQzZGhldg=="
                target="_blank"
                rel="noopener noreferrer"
                >
                  <img src={instagram} alt="" />
                </a>
              </li>
            <li className='Footer-socials-tiktok'>
              <a 
                href="https://www.tiktok.com/@krovacoperis?_t=ZM-8xVQfU4IAdx&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                >
                <img src={tiktok} alt="" />
              </a>
            </li>
          </ul>
            <ul className='Footer-links-list'>
              <li><a href="#home" onClick={e => handleNavClick(e, "home")}>Acasa</a></li>
              <li><a href="#about" onClick={e => handleNavClick(e, "about")}>Companie</a></li>
              <li><a href="#services" onClick={e => handleNavClick(e, "services")}>Produse & Servicii</a></li>
              <li><a href="#gallery" onClick={e => handleNavClick(e, "gallery")}>Galerie</a></li>
              <li><a href="#faq" onClick={e => handleNavClick(e, "faq")}>FAQ</a></li>
            </ul>
          <img src={footerline} className='Footer-line'/>
          <h1 className='Footer-Copyright'>Copyright © 2025 All rights reserved  by Krov Acoperișuri</h1>
      </div>
      <div className='LiveChat'>
        <LiveChat />
      </div>
    </>
  )
}

export default App