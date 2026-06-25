import { useCallback, useRef, useState } from "react";

const ESTADOS = {
  idle:       { label: "Dictado por voz",    icon: "bi-mic",             cls: "" },
  escuchando: { label: "Escuchando…",         icon: "bi-mic-fill",        cls: "btn-voz--escuchando" },
  procesando: { label: "IA procesando…",      icon: "bi-hourglass-split", cls: "btn-voz--procesando" },
  listo:      { label: "¡Agregado!",          icon: "bi-check2-circle",   cls: "btn-voz--listo" },
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
    reco.lang           = "es-CO";
    reco.continuous     = false;
    reco.interimResults = false;
    recoRef.current     = reco;

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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      <button
        className={`btn-voz ${cfg.cls}`}
        onClick={estado === "escuchando" ? detener : iniciar}
        disabled={deshabilitado || estado === "procesando"}
        title="Dicta los productos que necesitas"
        style={{ minWidth: 200 }}
      >
        {estado === "idle"
          ? <img src="/ia.png" alt="IA" style={{ width: "1.2rem", height: "1.2rem", objectFit: "contain" }} />
          : <i className={`bi ${cfg.icon}`} style={{ fontSize: "1.05rem" }}></i>
        }
        <span>{cfg.label}</span>
      </button>

      {estado === "procesando" && (
        <div className="ai-thinking">
          <div className="ai-thinking__dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>IA procesando...</span>
        </div>
      )}
    </div>
  );
};

export default BotonVoz;
