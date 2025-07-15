import React, { useState, useEffect, useRef } from "react";
import "./LiveChat.css";
import livechatopenbg from "./assets/Group 71.png";
import closebutton from "./assets/closebutton.png";
import sendicon from "./assets/sendicon.png";
import chatboticon from "./assets/chaticon.png";

type ChatMessage = {
  id: number;
  text: string;
  from: "user" | "bot";
};

declare global {
  interface Window {
    language: string;
  }
}

const initialMessages: ChatMessage[] = [];

const LiveChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [, setUserInterests] = useState("");


  // Scroll la ultimul mesaj
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open) {
      setVisible(true);
      if (messages.length === 0 && onboardingStep === 0) {
        setLoading(true);
        fetch("https://krov-acoperisuri.onrender.com/language")
          .then((res) => res.json())
          .then((data) => {
            const botMsg: ChatMessage = {
              id: Date.now(),
              text: data.ask_name || "Bun venit! Care este numele tău?",
              from: "bot",
            };
            setMessages([botMsg]);
            setOnboardingStep(-1);
          })
          .catch(() => {
            const errMsg: ChatMessage = {
              id: Date.now(),
              text: "Eroare la comunicarea cu serverul.",
              from: "bot",
            };
            setMessages([errMsg]);
          })
          .finally(() => setLoading(false));
      }
    } else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  // Functie pentru afisare mesaj bot
  const displayBotReply = (text: string) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), text, from: "bot" }
    ]);
  };

  // Functie de procesare mesaj utilizator, inclusiv onboarding step -1
  const handleUserMessage = () => {
    if (message.trim() === "") return;

    if (onboardingStep === -1) {
      setUserName(message);

      console.log("messages = " , message)
      setIsTyping(true);

      // Adaugam mesajul utilizator
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: message, from: "user" }
      ]);
      setMessage("");


      fetch("https://krov-acoperisuri.onrender.com/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: message })
      })
        .then(res => res.json())
        .then(data => {
          setTimeout(() => {
            setIsTyping(false);
            displayBotReply(data.ask_name);
            window.language = data.language;
            setOnboardingStep(1);
          }, 1000);
        })
        .catch(err => {
          setIsTyping(false);
          displayBotReply("Eroare la inițializare: " + err.message);
        });

      return;
    }

    if (onboardingStep === 1) {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: message, from: "user" }
      ]);
      setMessage("");
    
      setIsTyping(true);
    
      fetch("https://krov-acoperisuri.onrender.com/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: message, language: window.language })
      })
        .then(res => res.json())
        .then(data => {
          setTimeout(() => {
            setIsTyping(false);
            displayBotReply(data.ask_interests);
    
            const msg = data.ask_interests;

            if (
              msg.includes("Împreună vom parcurge pas cu pas") || 
              msg.includes("Мы вместе пройдём шаг за шагом")
            ){
              setOnboardingStep(8);
              return;
            }
            
            if (
              msg.includes("China mat 0.40 :") ||
              msg.includes("0.45  Arvedi mat :") ||
              msg.includes("SSAB")
            ) {
              setOnboardingStep(2);
            } else if (
              msg.includes("Să afli informații despre un") ||
              msg.includes("Узнать информацию о")
            ) {
              setOnboardingStep(1);
            } else if (
              msg.includes("🔍 Spune-ne te rog dacă") ||
              msg.includes("🔍 Скажи, пожалуйста,")
            ) {
              setOnboardingStep(17);
            } else if (
              msg.includes("📦 Pentru a te putea ajuta cât mai bine") ||
              msg.includes("📦 Чтобы мы могли помочь тебе как можно лучше, пожалуйста, скажи")
            ) {
              setOnboardingStep(13);
            } else if (
              msg.includes("Ne bucurăm enorm să aflăm că") ||
              msg.includes("Мы очень рады узнать, что у вас")
            ){
              setOnboardingStep(6);
            }
          }, 1000);
        })
        .catch(err => {
          setIsTyping(false);
          displayBotReply("Eroare la inițializare: " + err.message);
        });
    
      return;
    }
    if (onboardingStep === 2) {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: message, from: "user" }
      ]);
      setMessage("");

    
      fetch("https://krov-acoperisuri.onrender.com/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, interests: message, language: window.language })
      })
        .then(res => res.json())
        .then(data => {
          setTimeout(() => {
            setIsTyping(false);
            displayBotReply(data.message);
    
            const msg = data.message;
    
            if (
              msg.includes("Suntem gata să te ajutăm cu tot ce ține de acoperișuri!") ||
              msg.includes("Мы готовы помочь вам со всем, что связано с крышами!")
            ) {
              setOnboardingStep(2);
            } else if (
              msg.includes("Mulțumim că ai ales KROV!") ||
              msg.includes("Спасибо, что выбрали KROV!")
            ) {
              setOnboardingStep(6);
            } else if (
              msg.includes("Te rog să alegi varianta exactă care te interesează. 😊") ||
              msg.includes("Пожалуйста, выберите именно тот вариант, который вас интересует. 😊")
            ) {
              setOnboardingStep(2);
            } else {
              setOnboardingStep(1);
            }
          }, 1000);
        })
        .catch(err => {
          setIsTyping(false);
          displayBotReply("Eroare la inițializare: " + err.message);
        });
    
      return;
    }
    if (onboardingStep === 3) {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: message, from: "user" }
      ]);
      setMessage("");
      setUserInterests(message);
      setIsTyping(true);
    
      fetch("https://krov-acoperisuri.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          interests: message,
          message: message,
          language: window.language
        })
      })
        .then(res => res.json())
        .then(data => {
          setTimeout(() => {
            setIsTyping(false);
            displayBotReply(data.reply);
    
            const replyText = data.reply;
    
            if (
              replyText.includes("China mat 0.40 :") ||
              replyText.includes("0.45  Arvedi mat :") ||
              replyText.includes("SSAB") ||
              replyText.includes("China 0.4")
            ) {
              setOnboardingStep(2);
            } else if (replyText.includes("!!!")) {
              setOnboardingStep(4);
            }
          }, 1000);
        })
        .catch(err => {
          setIsTyping(false);
          displayBotReply("Eroare în conversație: " + err.message);
        });
    
      return;
    }
    if (onboardingStep === 4) {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: message, from: "user" }
      ]);
      setMessage("");
      setIsTyping(true);
    
      fetch("https://krov-acoperisuri.onrender.com/next_chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          interests: message, // Dacă ai nevoie de ultimul interes salvat
          message: message,
          language: window.language
        })
      })
        .then(res => res.json())
        .then(data => {
          setTimeout(() => {
            setIsTyping(false);
            displayBotReply(data.reply);
    
            const replyText = data.reply;
    
            if (
              replyText.includes("!!!") ||
              replyText.includes("Scrie **numele exact** al produsului dorit") ||
              replyText.includes("Напишите **точное название** нужного вам товара")
            ) {
              setOnboardingStep(4);
            } else {
              setOnboardingStep(5);
            }
          }, 1000);
        })
        .catch(err => {
          setIsTyping(false);
          displayBotReply("Eroare în conversație: " + err.message);
        });
    
      return;
    }

    if (onboardingStep === 6) {
      setUserInterests(message);
    
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: message, from: "user" }
      ]);
      setMessage("");
      setIsTyping(true);
    
      fetch("https://krov-acoperisuri.onrender.com/comanda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          interests: message,
          message: message,
          language: window.language
        })
      })
        .then(res => res.json())
        .then(data => {
          setTimeout(() => {
            setIsTyping(false);
            displayBotReply(data.reply);
    
            if (
              data.reply.includes("Mulțumim! Ai un nume frumos!") ||
              data.reply.includes("Спасибо! У тебя красивое имя!")
            ) {
              setOnboardingStep(7);
            } else {
              setOnboardingStep(6);
            }
          }, 1000);
        })
        .catch(err => {
          setIsTyping(false);
          displayBotReply("Eroare la inițializare: " + err.message);
        });
    
      return;
    }
    if (onboardingStep === 7) {
      setUserInterests(message); // ✅ actualizează state-ul corect
    
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: message, from: "user" }
      ]);
      setMessage("");
      setIsTyping(true);
    
      fetch("https://krov-acoperisuri.onrender.com/numar_de_telefon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          interests: message,
          message: message,
          language: window.language
        })
      })
        .then(res => res.json())
        .then(data => {
          setTimeout(() => {
            setIsTyping(false);
            displayBotReply(data.reply);
    
            const replyText = data.reply;
    
            if (
              replyText.includes("Te rog să introduci un număr de telefon valid") ||
              replyText.includes("Numărul acesta nu pare corect") ||
              replyText.includes("Пожалуйста, введи действительный номер телефона") ||
              replyText.includes("Этот номер кажется некорректным")
            ) {
              setOnboardingStep(7); // ✅ rămâne la pasul 7
            } else {
              setOnboardingStep(8); // ✅ trece la pasul următor
            }
          }, 1000);
        })
        .catch(err => {
          setIsTyping(false);
          displayBotReply("Eroare la inițializare: " + err.message);
        });
    
      return;
    }
    if (onboardingStep === 8) {
      setUserInterests(message); // actualizează state-ul corect
    
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: message, from: "user" }
      ]);
      setMessage("");
      setIsTyping(true);
    
      fetch("https://krov-acoperisuri.onrender.com/categorie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          interests: message,
          message: message,
          language: window.language
        })
      })
        .then(res => res.json())
        .then(data => {
          setTimeout(() => {
            setIsTyping(false);
            displayBotReply(data.reply);
    
            const replyText = data.reply;
    
            if (
              replyText.includes("Suntem gata să te ajutăm cu tot ce ține de acoperișuri!") ||
              replyText.includes("Мы готовы помочь вам со всем, что связано с крышами!") ||
              replyText.includes("Te rog să alegi varianta exactă care te interesează. 😊") ||
              replyText.includes("Пожалуйста, выбери точный вариант, который тебя интересует. 😊")
            ) {
              setOnboardingStep(8);
            } else {
              setOnboardingStep(9);
            }
          }, 1000);
        })
        .catch(err => {
          setIsTyping(false);
          displayBotReply("Eroare la inițializare: " + err.message);
        });
    
      return;
    }

    if (onboardingStep === 9) {
      setUserInterests(message);
    
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: message, from: "user" }
      ]);
      setMessage("");
      setIsTyping(true);
    
      fetch("https://krov-acoperisuri.onrender.com/produs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          interests: message,
          message: message,
          language: window.language
        })
      })
        .then(res => res.json())
        .then(data => {
          setTimeout(() => {
            setIsTyping(false);
            displayBotReply(data.reply);
    
            const replyText = data.reply;
    
            if (
              replyText.includes("Mulțumim pentru alegerea ta! 🛒 Produsul a fost notat cu succes.") ||
              replyText.includes("Спасибо за ваш выбор! 🛒 Товар успешно добавлен.")
            ) {
              setOnboardingStep(10);
            } else if (
              replyText.includes("La cererea ta, am găsit următoarele produse din categoria") ||
              replyText.includes("По вашему запросу найдены следующие товары из категории") ||
              replyText.includes("🔍 Doar așa putem continua mai departe cu procesul") ||
              replyText.includes("🔍 Только так мы сможем продолжить оформление заказа!")
            ) {
              setOnboardingStep(9);
            }
          }, 1000);
        })
        .catch(err => {
          setIsTyping(false);
          displayBotReply("Eroare la inițializare: " + err.message);
        });
    
      return;
    }
    if (onboardingStep === 10) {
      setUserInterests(message);
    
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: message, from: "user" }
      ]);
      setMessage("");
      setIsTyping(true);
    
      fetch("https://krov-acoperisuri.onrender.com/culoare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          interests: message,
          message: message,
          language: window.language
        })
      })
        .then(res => res.json())
        .then(data => {
          setTimeout(() => {
            setIsTyping(false);
            displayBotReply(data.reply);
    
            const replyText = data.reply;
    
            if (
              replyText.includes("Doar așa putem trece la etapa finală a comenzii tale!") ||
              replyText.includes("Am observat că ai menționat o culoare care poate avea mai multe nuanțe sau variante.") ||
              replyText.includes("Только так мы сможем перейти к финальному этапу твоего заказа!") ||
              replyText.includes("Я заметил, что ты упомянул цвет, который может иметь несколько оттенков или вариантов.")
            ) {
              setOnboardingStep(10);
            } else {
              setOnboardingStep(11);
            }
          }, 1000);
        })
        .catch(err => {
          setIsTyping(false);
          displayBotReply("Eroare la inițializare: " + err.message);
        });
    
      return;
    }
    if (onboardingStep === 11) {
      setUserInterests(message);
    
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: message, from: "user" }
      ]);
      setMessage("");
      setIsTyping(true);
    
      fetch("https://krov-acoperisuri.onrender.com/cantitate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          interests: message,
          message: message,
          language: window.language
        })
      })
        .then(res => res.json())
        .then(data => {
          setTimeout(() => {
            setIsTyping(false);
            displayBotReply(data.reply);
    
            if (
              data.reply.includes("Doar așa pot calcula prețul total și înregistra comanda.") ||
              data.reply.includes("Только так я смогу рассчитать итоговую цену и оформить заказ.")
            ) {
              setOnboardingStep(11);
            } else {
              setOnboardingStep(12);
            }
          }, 1000);
        })
        .catch(err => {
          setIsTyping(false);
          displayBotReply("Eroare la inițializare: " + err.message);
        });
    
      return;
    }

    if (onboardingStep === 14) {
      setUserInterests(message);
      setOnboardingStep(1);
    
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: message, from: "user" }
      ]);
      setMessage("");
      setIsTyping(true);
    
      fetch("https://krov-acoperisuri.onrender.com/final_stage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, interests: message, message: message, language: window.language })
      })
        .then(res => res.json())
        .then(data => {
          setTimeout(() => {
            setIsTyping(false);
            displayBotReply(data.reply);
            setOnboardingStep(1);
          }, 1000);
        })
        .catch(err => {
          setIsTyping(false);
          displayBotReply("Eroare la inițializare: " + err.message);
        });
    
      return;
    }
    if (onboardingStep === 12) {
      setUserInterests(message);
      
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: message, from: "user" }
      ]);
      setMessage("");
      setIsTyping(true);
    
      fetch("https://krov-acoperisuri.onrender.com/check_resp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, interests: message, message: message, language: window.language })
      })
        .then(res => res.json())
        .then(data => {
          setTimeout(() => {
            setIsTyping(false);
            displayBotReply(data.reply);
    
            if (data.reply.includes("îți mulțumim mult pentru răspuns") || data.reply.includes("большое спасибо за ваш ответ!")) {
              setOnboardingStep(1);
            } else if (data.reply.includes("Este important pentru a putea continua procesarea cât mai rapid.") || data.reply.includes("Это важно, чтобы мы могли оперативно продолжить обработку.")) {
              setOnboardingStep(12);
            } else if (data.reply.includes("Te rog să ne lași un") || data.reply.includes("Пожалуйста, оставьте нам")) {
              setOnboardingStep(15);
            } else if (data.reply.includes("Comanda ta a fost") || data.reply.includes("Ваш заказ был")) {
              setOnboardingStep(1);
            } else if (data.reply.includes("numele și prenumele") || data.reply.includes("имя и фамилию")) {
              setOnboardingStep(16);
            } else {
              setOnboardingStep(14);
            }
          }, 1000);
        })
        .catch(err => {
          setIsTyping(false);
          displayBotReply("Eroare la inițializare: " + err.message);
        });
    
      return;
    }
    if (onboardingStep === 13) {
      
      
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: message, from: "user" }
      ]);
      setMessage("");
      setUserInterests(message);

    
      fetch("https://krov-acoperisuri.onrender.com/ai_mai_comandat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, interests: message, message: message, language: window.language })
      })
        .then(res => res.json())
        .then(data => {
          setTimeout(() => {
            setIsTyping(false);
            displayBotReply(data.reply);
            if (data.reply.includes("Ne bucurăm enorm să aflăm că") || data.reply.includes("Мы очень рады узнать")) {
              setOnboardingStep(6);
            } else if (data.reply.includes("Nu este nicio problemă") || data.reply.includes("Не переживай,")) {
              setOnboardingStep(8);
            }
          }, 1000);
        })
        .catch(err => {
          setIsTyping(false);
          displayBotReply("Eroare la inițializare: " + err.message);
        });
    
      return;
    }
    if (onboardingStep === 15) {
      setUserInterests(message);
      
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: message, from: "user" }
      ]);
      setMessage("");
      setIsTyping(true);
    
      fetch("https://krov-acoperisuri.onrender.com/numar_de_telefon_final", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, interests: message, message: message, language: window.language })
      })
        .then(res => res.json())
        .then(data => {
          setTimeout(() => {
            setIsTyping(false);
            displayBotReply(data.reply);
            console.log(data.reply);
    
            if (
              data.reply.includes("Te rog să introduci un număr de telefon valid") ||
              data.reply.includes("Numărul acesta nu pare corect") ||
              data.reply.includes("Пожалуйста, введи действительный номер телефона, чтобы мы могли продолжить.") ||
              data.reply.includes("Этот номер кажется некорректным")
            ) {
              setOnboardingStep(15);
            } else {
              setOnboardingStep(1);
            }
          }, 1000);
        })
        .catch(err => {
          setIsTyping(false);
          displayBotReply("Eroare la inițializare: " + err.message);
        });
    
      return;
    }
    if (onboardingStep === 16) {
      setUserInterests(message);
      
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: message, from: "user" }
      ]);
      setMessage("");
      setIsTyping(true);
    
      fetch("https://krov-acoperisuri.onrender.com/comanda_final", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, interests: message, message: message, language: window.language })
      })
        .then(res => res.json())
        .then(data => {
          setTimeout(() => {
            setIsTyping(false);
            displayBotReply(data.reply);
            console.log(data.reply);
    
            if (
              data.reply.includes("Introdu, te rog") ||
              data.reply.includes("Пожалуйста, укажи")
            ) {
              setOnboardingStep(16);
            } else {
              setOnboardingStep(15);
            }
          }, 1000);
        })
        .catch(err => {
          setIsTyping(false);
          displayBotReply("Eroare la inițializare: " + err.message);
        });
    
      return;
    }
    if (onboardingStep === 17) {
      setUserInterests(message);
      
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: message, from: "user" }
      ]);
      setMessage("");
      setIsTyping(true);
    
      fetch("https://krov-acoperisuri.onrender.com/ai_mai_comandat_welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, interests: message, message: message, language: window.language })
      })
        .then(res => res.json())
        .then(data => {
          setTimeout(() => {
            setIsTyping(false);
            displayBotReply(data.reply);
    
            if (
              data.reply.includes("China mat 0.40 :") ||
              data.reply.includes("0.45  Arvedi mat :") ||
              data.reply.includes("SSAB") ||
              data.reply.includes("China 0.4")
            ) {
              setOnboardingStep(2);
            } else {
              setOnboardingStep(17);
            }
          }, 1000);
        })
        .catch(err => {
          setIsTyping(false);
          displayBotReply("Eroare la inițializare: " + err.message);
        });
    
      return;
    }
    
    
    
    
    
    
    
    

    
    
    
        
    
    
    
    

    // Pentru alte cazuri onboardingStep sau mesaje simple
    setMessages(prev => [
      ...prev,
      { id: Date.now(), text: message, from: "user" }
    ]);
    setMessage("");
  };

  return (
    <div>
      {!open && (
        <img
          src={chatboticon}
          className="livechat-chatboticon"
          alt="Deschide chat"
          onClick={() => setOpen(true)}
          style={{ position: "fixed", right: 40, bottom: 40, width: 80, height: 80, zIndex: 1001, cursor: "pointer" }}
        />
      )}
      {visible && (
        <div className={`livechat-modal${open ? "" : " closed"}`}>
          <img src={livechatopenbg} className="livechat-modal-bg" alt="Live Chat Modal BG" />
          <img
            src={closebutton}
            className="livechat-close-button"
            alt="Close"
            onClick={() => setOpen(false)}
          />
          <h1 className="live-chat-open-title">Krov Acoperișuri</h1>
          <div className="livechat-messages">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`livechat-message livechat-message-${msg.from}`}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            ))}
            {isTyping && (
              <div className="flex mb-3" id="typing-indicator">
                <div className="typing-dots flex space-x-2 px-4 py-2">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="livechat-input-row">
            <input
              type="text"
              className="livechat-input"
              placeholder="Scrie-ți mesajul aici..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => {
                // console.log("Key pressed:", e.key, "onboardingStep =", onboardingStep);
                if (e.key === "Enter") handleUserMessage(); }}
              disabled={loading}
            />
            <button
              className="livechat-send-btn"
              onClick={handleUserMessage}
              type="button"
              aria-label="Trimite mesaj"
              disabled={loading}
            >
              <img src={sendicon} alt="Send" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveChat;
