import { useEffect, useRef } from "react";
import AriaIcon from "./AriaIcon";

const AgentPanel = ({
  messages,
  isLoading,
  isListening,
  inputText,
  setInputText,
  sendMessage,
  startListening,
  onClose,
}) => {
  const messagesEndRef = useRef(null);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  return (
    <div className="agent-panel">
      {/* Header */}
      <div className="agent-panel__header">
        <div className="agent-panel__brand">
          <div className="agent-avatar">
            <AriaIcon size={18} />
          </div>
          <div>
            <div className="agent-panel__name">Aria</div>
            <div className="agent-panel__status">
              {isListening ? (
                <span className="agent-status-listening">
                  <span className="status-dot listening"></span>Escuchando...
                </span>
              ) : isLoading ? (
                <span className="agent-status-thinking">
                  <span className="status-dot thinking"></span>Pensando...
                </span>
              ) : (
                <span className="agent-status-online">
                  <span className="status-dot online"></span>En línea
                </span>
              )}
            </div>
          </div>
        </div>
        <button className="agent-close-btn" onClick={onClose} title="Cerrar">
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      {/* Mensajes */}
      <div className="agent-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`agent-message ${msg.role === "user" ? "agent-message--user" : "agent-message--agent"}`}
          >
            {msg.role === "agent" && (
              <div className="agent-message__avatar">
                <AriaIcon size={18} />
              </div>
            )}
            <div className="agent-message__bubble">{msg.text}</div>
          </div>
        ))}

        {isLoading && (
          <div className="agent-message agent-message--agent">
            <div className="agent-message__avatar">
              <AriaIcon size={18} />
            </div>
            <div className="agent-message__bubble agent-typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="agent-input-area">
        <input
          type="text"
          className="agent-input"
          placeholder={isListening ? "Escuchando tu voz..." : "Escribe o usa el micrófono..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isListening}
        />
        <button
          className={`agent-mic-btn ${isListening ? "agent-mic-btn--listening" : ""}`}
          onClick={startListening}
          title={isListening ? "Detener" : "Hablar"}
        >
          <i className={`bi ${isListening ? "bi-stop-fill" : "bi-mic-fill"}`}></i>
        </button>
        <button
          className="agent-send-btn"
          onClick={() => sendMessage(inputText)}
          disabled={!inputText.trim() || isLoading}
          title="Enviar"
        >
          <i className="bi bi-send-fill"></i>
        </button>
      </div>
    </div>
  );
};

export default AgentPanel;
