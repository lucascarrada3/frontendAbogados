import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { Expediente } from '../../Types/expedientes';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
import { FaClock, FaSpinner, FaCheckCircle, FaArrowCircleUp } from 'react-icons/fa';
import '../../css/expedientesTable.css';
import { useNavigate } from 'react-router-dom';
import { getNombreTipo } from '../../utils/mapTipoNombre';
// import { Tipo } from '../../Types/tipo';

interface Props {
  data: Expediente[];
  onFinalizar?: (expediente: Expediente) => void;
  isLoading?: boolean;
}


const ExpedientesTable: React.FC<Props> = ({ data, onFinalizar, isLoading }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(5); // Número de filas por página
  const navigate = useNavigate();
  // const { idExpediente, nombreTipo } = useParams();
  
  const finalizarExpediente = async (expediente: Expediente) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación. Por favor, inicia sesión.');
    }
//local
    // const response = await fetch(`http://localhost:3001/expedientes/${expediente.idExpediente}/finalizar`, {  
    //produccion
      const response = await fetch(`https://backendabogados-hsnm.onrender.com/expedientes/${expediente.idExpediente}/finalizar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error('Error al finalizar expediente');
    }

    alert('Expediente finalizado correctamente');

    if (onFinalizar) onFinalizar(expediente); // ✅ esto recarga la tabla automáticamente

  } catch (error) {
    console.error(error);
    alert('Hubo un error al finalizar el expediente');
  }
};


  const columns: ColumnDef<Expediente>[] = [
    { accessorKey: 'numeroExpediente', header: 'N° Exp.' },
    { accessorKey: 'juzgado', header: 'Juzgado' },
    { accessorKey: 'fecha', header: 'Fecha' },
    { accessorKey: 'caratula', header: 'Carátula' },
    { accessorKey: 'proveido', header: 'Proveído' },
    { accessorKey: 'observaciones', header: 'Observaciones' },
    {
      accessorKey: 'idEstado',
      header: 'Estado',
      cell: ({ getValue }) => {
        const idEstado = getValue() as number;
        let estadoNombre = '';
        let icon = null;

        switch (idEstado) {
          case 1:
            estadoNombre = 'En Curso';
            icon = <FaSpinner color="blue" />;
            break;
          case 2:
            estadoNombre = 'Actualizado';
            icon = <FaArrowCircleUp color="orange" />;
            break;
          case 3:
            estadoNombre = 'Atrasado';
            icon = <FaClock color="red" />;
            break;
          case 4:
            estadoNombre = 'Finalizado';
            icon = <FaCheckCircle color="green" />;
            break;
          default:
            estadoNombre = 'Sin Estado';
        }

        return (
          <div className="estado-cell">
            {icon} <span>{estadoNombre}</span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const expediente = row.original;
        return (
          <div className="actions-container">
            {/* <button className="action-btn" onClick={() => exportOneExpediente(expediente)}>
              PDF
            </button> */}
            {onFinalizar && Number(expediente.idEstado) !== 4 && (
              <button className="action-btn" onClick={() => finalizarExpediente(expediente)}>
                Finalizar
              </button>
            )}
         <button
            onClick={() =>
              navigate(`/expedientes/${getNombreTipo(expediente.idTipo)}/${expediente.idExpediente}`)
            }
          >
            Actualizar
          </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <div className="expedientes-table-container">
      <input
        type="text"
        placeholder="Buscar..."
        value={globalFilter}
        onChange={e => setGlobalFilter(e.target.value)}
        className="search-input"
      />
      <table className="expedientes-table">
        <thead>
          {table.getHeaderGroups().map(group => (
            <tr key={group.id}>
              {group.headers.map(header => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="tabla-mensaje" style={{ textAlign: 'center' }}>Cargando...</td>
            </tr>
          ) : table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="tabla-mensaje" style={{ textAlign: 'center' }}>Tabla sin resultados</td>
            </tr>
          ) : (
            table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className={
                  row.original.idEstado === 'Atrasado'
                    ? 'fila-atrasado'
                    : row.original.idEstado === 'Finalizado'
                    ? 'fila-finalizado'
                    : 'fila-en-curso'
                }
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>

      </table>
      
      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </button>
        <span className="pagination-text">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </span>
        <button
          className="pagination-button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </button>
        
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
            table.setPageSize(Number(e.target.value)); // Establece el tamaño de página
          }}
          className="page-size-selector"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>
    </div>
  );
};

// const exportOneExpediente = (expediente: Expediente) => {
//   const doc = new jsPDF();
//   autoTable(doc, {
//     head: [['Campo', 'Valor']],
//     body: Object.entries(expediente),
//     margin: { top: 30 }
//   });
//   doc.save(`expediente-${expediente.idExpediente}.pdf`);
// };

export default ExpedientesTable;
