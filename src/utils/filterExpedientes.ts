import { Expediente } from '../Types/expedientes';

export const filterExpedientes = (
  expedientes: Expediente[],
  jurisdiccion: 'Federales' | 'Provinciales' | 'Extrajudiciales',
  estado: 'Pendientes' | 'Tardado' | 'Finalizado' | 'NoFinalizado'
) => {
  const jurisdiccionMap: { [key: string]: number } = {
    Federales: 1,
    Provinciales: 2,
    Extrajudiciales: 3
  };

  return expedientes.filter(expediente => {
    const esJurisdiccionCorrecta = expediente.idTipo === jurisdiccionMap[jurisdiccion];

    if (estado === 'NoFinalizado') {
      return esJurisdiccionCorrecta && (expediente.idEstado === 'Pendientes' || expediente.idEstado === 'Atrasado');
    } else {
      return esJurisdiccionCorrecta && expediente.idEstado === estado;
    }
  });
};
