import { useEffect, useRef, useState } from "react";
import { useAgent } from "../model/useAgent";
import AgentPanel from "./AgentPanel";

const BTN_SIZE = 62;

const AgentBubble = ({ notificaciones = [] }) => {
  const {
    isOpen, messages, isLoading, isListening,
    inputText, setInputText, togglePanel, sendMessage, startListening,
  } = useAgent();

  const hasAlerts = notificaciones.length > 0;

  const btnRef  = useRef(null);
  const posRef  = useRef(null);       // {x, y} en coordenadas top/left
  const ds      = useRef({            // estado de arrastre (sin re-render)
    active: false, moved: false,
    startPx: 0, startPy: 0,
    startBx: 0, startBy: 0,
  });
  const [pos, setPos] = useState(null); // dispara re-render solo al moverse

  useEffect(() => {
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    const move = (cx, cy) => {
      if (!ds.current.active) return;
      const dx = cx - ds.current.startPx;
      const dy = cy - ds.current.startPy;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) ds.current.moved = true;
      const x = clamp(ds.current.startBx + dx, 8, window.innerWidth  - BTN_SIZE - 8);
      const y = clamp(ds.current.startBy + dy, 8, window.innerHeight - BTN_SIZE - 8);
      posRef.current = { x, y };
      setPos({ x, y });
    };

    const end = () => {
      if (!ds.current.active) return;
      ds.current.active = false;
      if (!ds.current.moved) togglePanel();
    };

    const onMouseMove = (e) => move(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (!ds.current.active) return;
      e.preventDefault();
      move(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   end);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend",  end);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   end);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend",  end);
    };
  }, [togglePanel]);

  const onDown = (clientX, clientY) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const bx = posRef.current?.x ?? rect.left;
    const by = posRef.current?.y ?? rect.top;
    ds.current = { active: true, moved: false, startPx: clientX, startPy: clientY, startBx: bx, startBy: by };
    if (!posRef.current) {
      posRef.current = { x: bx, y: by };
      setPos({ x: bx, y: by });
    }
  };

  const dynStyle = pos
    ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto", cursor: "grab" }
    : { cursor: "grab" };

  return (
    <>
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

      <button
        ref={btnRef}
        className={`agent-bubble ${hasAlerts ? "agent-bubble--alert" : ""} ${isOpen ? "agent-bubble--open" : ""}`}
        style={dynStyle}
        onMouseDown={(e) => { e.preventDefault(); onDown(e.clientX, e.clientY); }}
        onTouchStart={(e) => onDown(e.touches[0].clientX, e.touches[0].clientY)}
        title="Aria — Asistente IA (arrastrable)"
      >
        {isOpen
          ? <i className="bi bi-x-lg"></i>
          : <img src="/ia.png" alt="Aria IA" className="agent-bubble__ia-img" />
        }
        {hasAlerts && !isOpen && (
          <span className="agent-bubble__badge">{notificaciones.length}</span>
        )}
      </button>
    </>
  );
};

export default AgentBubble;
