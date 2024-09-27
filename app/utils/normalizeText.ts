export const normalizeText = (input: string = "") => {
  return input
    .toLowerCase() // convertir a minúsculas
    .normalize("NFD") // normalizar caracteres especiales
    .replace(/[\u0300-\u036f]/g, "") // eliminar acentos
    .replace(/[^a-zA-Z0-9]/g, "-") // eliminar caracteres especiales
    .trim() // eliminar espacios
    .replace(/\s+/g, "-"); // reemplazar espacios con guiones
};