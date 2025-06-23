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
import { FaTrash } from 'react-icons/fa';
import '../../css/expedientesTable.css';
import { useNavigate } from 'react-router-dom';
import { getNombreTipo } from '../../utils/mapTipoNombre';
import { API_URL } from '../../utils/api';
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
      const response = await fetch(`${API_URL}/expedientes/${expediente.idExpediente}/finalizar`, {
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

  const eliminarExpediente = async (expediente: Expediente) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación. Por favor, inicia sesión.');
    }

    const response = await fetch(`${API_URL}/expedientes/delete/${expediente.idExpediente}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar el expediente');
    }

    alert('Expediente eliminado correctamente');
    window.location.reload();
  } catch (error) {
    console.error('Error al eliminar expediente:', error);
    alert('Error al eliminar el expediente');
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
              <button onClick={() => finalizarExpediente(expediente)}
               style={{ backgroundColor: '#008f39', border: 'none' }}
              >
                Finalizar
              </button>
            )}
         <button
            onClick={() =>
              navigate(`/expedientes/${getNombreTipo(expediente.idTipo)}/${expediente.idExpediente}`)
            }
             style={{ backgroundColor: '#FDD817', border: 'none' }}
          >
            Actualizar
          </button>
            <button
            className="action-btn"
            onClick={() => {
              if (window.confirm('¿Estás seguro de que querés eliminar este expediente?')) {
                eliminarExpediente(expediente);
              }
            }}
            style={{ color: 'red', backgroundColor: 'transparent', border: 'none' }}
            title="Eliminar"
          >
        <FaTrash size={18} />
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

export default ExpedientesTable;
