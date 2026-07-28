const DB_NAME = "gestor-offline";
const STORE   = "queue";
const VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

// Encola una mutación para sincronizar cuando vuelva la conexión
// mutacion: { method, url, data }
export async function encolarMutacion(mutacion) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).add({ ...mutacion, ts: Date.now() });
    tx.oncomplete = resolve;
    tx.onerror    = (e) => reject(e.target.error);
  });
}

export async function obtenerCola() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

async function _eliminarDeCola(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = resolve;
    tx.onerror    = (e) => reject(e.target.error);
  });
}

// Ejecuta cada mutación encolada usando axiosClient y la elimina si tiene éxito
export async function sincronizarCola(axiosClient) {
  const cola = await obtenerCola();
  if (!cola.length) return;
  const db = await openDB();
  for (const item of cola) {
    try {
      await axiosClient({ method: item.method, url: item.url, data: item.data });
      await _eliminarDeCola(db, item.id);
    } catch (e) {
      console.warn("[Offline] Falló sincronización de item", item.id, e);
    }
  }
}
