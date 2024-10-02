import axios, { AxiosError } from "axios";

export const handleErrors = (error: AxiosError) => {
  if (axios.isAxiosError(error)) {
    // Verifica si el error tiene una respuesta del servidor
    if (error.response) {
      const statusCode = error.response.status;
      switch (statusCode) {
        case 400:
          return "La solicitud no se pudo procesar. Por favor, revisa los datos que has ingresado y vuelve a intentarlo";
        case 401:
          return "Necesita autenticarse para realizar esta acción (401)";
        case 402:
          return "Datos Incorrectos, verifique sus campos (402)";
        case 403:
          return "Usted no cuenta con permisos para realizar esta acción  (403)";
        case 404:
          return "No se pudo encontrar su solicitud (404)";
        case 500:
          return "Error interno del servidor (500)";
        default:
          return `Error desconocido (${statusCode})`;
      }
    } else if (error.request) {
      // Si no hay respuesta del servidor
      return "No se recibió respuesta del servidor";
    } else {
      // Otro tipo de error
      return `Error en la solicitud: ${error.message}`;
    }
  } else {
    return "Error no relacionado con Axios";
  }
};
