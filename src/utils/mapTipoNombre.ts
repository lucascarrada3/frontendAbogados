// utils/mapTipoNombre.ts
export function getNombreTipo(idTipo: number): string {
  switch (idTipo) {
    case 1:
      return 'federales';
    case 2:
      return 'provinciales';
    case 3:
      return 'extrajudiciales';
    default:
      return 'desconocido';
  }
}
