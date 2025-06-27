// types.ts
export type Expediente = {
  idTipo: number;
  idExpediente: number;
  juzgado: string;
  fecha: string;
  numeroExpediente: string;
  caratula: string;
  proveido: string;
  observaciones: string;
  idEstado: 'Atrasado' | 'Pendientes' | 'Finalizado' | 'Actualizado';
  fechaActualizacion?: string;
};
