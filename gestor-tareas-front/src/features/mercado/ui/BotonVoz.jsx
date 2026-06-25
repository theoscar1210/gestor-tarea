import { useCallback, useRef, useState } from "react";

const ESTADOS = {
  idle:        { label: "Dictado por voz",   icon: "bi-mic",        cls: "" },
  escuchando:  { label: "Habla ahora...",     icon: "bi-mic-fill",   cls: "btn-voz--escuchando" },
  procesando:  { label: "Procesando con IA…", icon: "bi-hourglass-split", cls: "btn-voz--procesando" },
  listo:       { label: "¡Listo!",            icon: "bi-check2",     cls: "btn-voz--listo" },
};

const BotonVoz = ({ onTextoCapturado, deshabilitado }) => {
  const [estado, setEstado] = useState("idle");
  const recoRef             = useRef(null);

  const iniciar = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.");
      return;
    }

    const reco = new SpeechRecognition();
    reco.lang        = "es-CO";
    reco.continuous  = false;
    reco.interimResults = false;
    recoRef.current  = reco;

    reco.onstart  = () => setEstado("escuchando");
    reco.onerror  = () => setEstado("idle");

    reco.onresult = async (e) => {
      const texto = e.results[0][0].transcript;
      setEstado("procesando");
      await onTextoCapturado(texto);
      setEstado("listo");
      setTimeout(() => setEstado("idle"), 2000);
    };

    reco.onend = () => {
      if (estado === "escuchando") setEstado("idle");
    };

    reco.start();
  }, [onTextoCapturado, estado]);

  const detener = useCallback(() => {
    recoRef.current?.stop();
    setEstado("idle");
  }, []);

  const cfg = ESTADOS[estado];

  return (
    <button
      className={`btn-voz ${cfg.cls}`}
      onClick={estado === "escuchando" ? detener : iniciar}
      disabled={deshabilitado || estado === "procesando"}
      title="Dicta los productos que se agotaron"
    >
      <i className={`bi ${cfg.icon}`}></i>
      <span>{cfg.label}</span>
    </button>
  );
};

export default BotonVoz;
