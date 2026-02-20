import { useCallback, useEffect, useRef, useState } from "react";
import { enviarMensaje } from "../api/agentApi";

const SALUDO_INICIAL = "¡Hola! Soy Aria, tu asistente de tareas. ¿En qué te puedo ayudar hoy? Puedes preguntarme sobre tus tareas pendientes, pedirme sugerencias o usar el micrófono para hablar conmigo.";

/**
 * Selecciona la mejor voz española disponible.
 * Prioridad: Google (más natural) → Microsoft (buena calidad en Windows) → cualquier voz en español.
 */
const getBestSpanishVoice = () => {
  const voices = window.speechSynthesis.getVoices();
  const esVoices = voices.filter(
    (v) => v.lang.startsWith("es") || v.lang.toLowerCase().startsWith("es")
  );
  return (
    esVoices.find((v) => v.name.includes("Google")) ||
    esVoices.find((v) => v.name.includes("Microsoft") && v.name.includes("Sabina")) ||
    esVoices.find((v) => v.name.includes("Microsoft") && v.name.includes("Helena")) ||
    esVoices.find((v) => v.name.includes("Microsoft")) ||
    esVoices[0] ||
    null
  );
};

const speak = (text) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const doSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 0.88;   // Ligeramente más lento → más natural
    utterance.pitch = 1.08;  // Tono levemente más cálido
    utterance.volume = 1;

    const bestVoice = getBestSpanishVoice();
    if (bestVoice) utterance.voice = bestVoice;

    window.speechSynthesis.speak(utterance);
  };

  // Las voces se cargan de forma asíncrona; esperamos si aún no están listas
  if (window.speechSynthesis.getVoices().length > 0) {
    doSpeak();
  } else {
    window.speechSynthesis.addEventListener("voiceschanged", function onReady() {
      window.speechSynthesis.removeEventListener("voiceschanged", onReady);
      doSpeak();
    });
  }
};

export const useAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState("");
  const recognitionRef = useRef(null);
  const greeted = useRef(false);

  // Saludo automático al abrir el panel por primera vez
  useEffect(() => {
    if (isOpen && !greeted.current) {
      greeted.current = true;
      setMessages([{ role: "agent", text: SALUDO_INICIAL }]);
      speak(SALUDO_INICIAL);
    }
  }, [isOpen]);

  const addMessage = useCallback((role, text) => {
    setMessages((prev) => [...prev, { role, text }]);
  }, []);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    addMessage("user", trimmed);
    setInputText("");
    setIsLoading(true);

    try {
      const respuesta = await enviarMensaje(trimmed);
      addMessage("agent", respuesta);
      speak(respuesta);
    } catch {
      const error = "Lo siento, no pude conectarme. Verifica que el servidor esté activo.";
      addMessage("agent", error);
      speak(error);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    // Detener síntesis de voz antes de escuchar
    window.speechSynthesis?.cancel();

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setInputText(transcript);

      // Si el resultado es final, enviar automáticamente
      if (event.results[event.results.length - 1].isFinal) {
        sendMessage(transcript);
      }
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.start();
  }, [isListening, sendMessage]);

  const togglePanel = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    messages,
    isLoading,
    isListening,
    inputText,
    setInputText,
    togglePanel,
    sendMessage,
    startListening,
  };
};
