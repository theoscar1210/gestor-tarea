export const obtenerClasePrioridad = (prioridad) => {
  switch (prioridad) {
    case "alta":
      return "bg-prioridad-alta";
    case "media":
      return "bg-prioridad-media";
    case "baja":
      return "bg-prioridad-baja";
    default:
      return "bg-secondary";
  }
};

export const obtenerClaseCategoria = (categoria) => {
  switch (categoria?.toLowerCase()) {
    case "personal":
      return "border-info";
    case "trabajo":
      return "border-primary";
    case "urgente":
      return "border-danger";
    case "estudio":
      return "border-warning";
    default:
      return "border-secondary";
  }
};
