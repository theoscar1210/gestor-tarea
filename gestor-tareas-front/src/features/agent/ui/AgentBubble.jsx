import { useAgent } from "../model/useAgent";
import AgentPanel from "./AgentPanel";
import AriaIcon from "./AriaIcon";

const AgentBubble = ({ notificaciones = [] }) => {
  const {
    isOpen,
    messages,
    isLoading,
    isListening,
    inputText,
    setInputText,
    togglePanel,
    sendMessage,
    startListening,
  } = useAgent();

  const hasAlerts = notificaciones.length > 0;

  return (
    <>
      {/* Panel de chat */}
      {isOpen && (
        <AgentPanel
          messages={messages}
          isLoading={isLoading}
          isListening={isListening}
          inputText={inputText}
          setInputText={setInputText}
          sendMessage={sendMessage}
          startListening={startListening}
          onClose={togglePanel}
        />
      )}

      {/* Botón flotante */}
      <button
        className={`agent-bubble ${hasAlerts ? "agent-bubble--alert" : ""} ${isOpen ? "agent-bubble--open" : ""}`}
        onClick={togglePanel}
        title="Aria — Asistente IA"
      >
        {isOpen
          ? <i className="bi bi-x-lg"></i>
          : <AriaIcon size={26} animated />
        }
        {hasAlerts && !isOpen && (
          <span className="agent-bubble__badge">{notificaciones.length}</span>
        )}
      </button>
    </>
  );
};

export default AgentBubble;
