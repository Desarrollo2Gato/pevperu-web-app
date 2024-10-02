const useFormatDate = (dateString: Date | string) => {
  const date = new Date(dateString);
  
  // Opciones para formatear la fecha
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  
  // Convertir la fecha al formato deseado
  return date.toLocaleDateString('es-ES', options);
};
export default useFormatDate;