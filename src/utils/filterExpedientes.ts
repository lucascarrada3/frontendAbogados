import { Expediente } from '../Types/expedientes';

export const filterExpedientes = (
  expedientes: Expediente[],
  jurisdiccion: 'Federal' | 'Provincial',
  estado: 'En Curso' | 'Tardado' | 'Finalizado' | 'NoFinalizado'
) => {
  return expedientes.filter(expediente => {
    const esJurisdiccionCorrecta = expediente.jurisdiccion === jurisdiccion;
    
    if (estado === 'NoFinalizado') {
      return esJurisdiccionCorrecta && (expediente.estado === 'En Curso' || expediente.estado === 'Tardado');
    } else {
      return esJurisdiccionCorrecta && expediente.estado === estado;
    }
  });
};
