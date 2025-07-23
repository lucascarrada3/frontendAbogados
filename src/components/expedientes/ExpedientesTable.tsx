import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { Expediente } from '../../Types/expedientes';
import { FaClock, FaSpinner, FaCheckCircle, FaArrowCircleUp } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import '../../css/expedientesTable.css';
import { useNavigate } from 'react-router-dom';
import { getNombreTipo } from '../../utils/mapTipoNombre';
import { API_URL } from '../../utils/api';
import Modal from '../Modal/Modal';

interface Props {
  data: Expediente[];
  onFinalizar?: (expediente: Expediente) => void;
  isLoading?: boolean;
}

const ExpedientesTable: React.FC<Props> = ({ data, onFinalizar, isLoading }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [modalObservacion, setModalObservacion] = useState<string | null>(null);
  
  // Estado para modal confirmación
  const [modalConfirm, setModalConfirm] = useState<{
    mensaje: string;
    onConfirm: () => void;
  } | null>(null);
  
  // Estado para modal mensajes exito/error
  const [modalMensaje, setModalMensaje] = useState<{
    tipo: 'error' | 'exito';
    texto: string;
  } | null>(null);

  const finalizarExpediente = async (expediente: Expediente) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación. Por favor, inicia sesión.');
      }
      const response = await fetch(`${API_URL}/expedientes/${expediente.idExpediente}/finalizar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error al finalizar expediente');
      }
      setModalMensaje({ tipo: 'exito', texto: 'Expediente finalizado correctamente' });
      if (onFinalizar) onFinalizar(expediente);

      // Puedes actualizar la tabla aquí sin recargar, si usas onFinalizar
      // Si quieres recargar la página, descomenta:
      // setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error(error);
      setModalMensaje({ tipo: 'error', texto: 'Hubo un error al finalizar el expediente' });
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
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el expediente');
      }
      setModalMensaje({ tipo: 'exito', texto: 'Expediente eliminado correctamente' });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error('Error al eliminar expediente:', error);
      setModalMensaje({ tipo: 'error', texto: 'Error al eliminar el expediente' });
    }
  };

  const getEstadoClass = (idEstado: number) => {
    switch (idEstado) {
      case 1: return 'fila-en-curso';
      case 2: return 'fila-actualizado';
      case 3: return 'fila-atrasado';
      case 4: return 'fila-finalizado';
      default: return '';
    }
  };

  const columns: ColumnDef<Expediente>[] = [
    { accessorKey: 'numeroExpediente', header: 'N° Exp.' },
    { accessorKey: 'juzgado', header: 'Juzgado' },
    { 
      accessorKey: 'fecha',
      header: 'Fecha de inicio',
      enableSorting: true,
      cell: info => {
        const rawDate = info.getValue() as string;
        const date = new Date(rawDate);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        return date.toISOString().split('T')[0];
      },
    },
    { 
      accessorKey: 'fechaActualizacion',
      header: 'Último Movimiento',
      enableSorting: true,
      cell: info => {
        const rawDate = info.getValue() as string;
        const date = new Date(rawDate);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); 
        return date.toISOString().split('T')[0]; 
      },
    },
    { accessorKey: 'caratula', header: 'Carátula' },
    {
      accessorKey: 'observaciones',
      header: 'Observaciones',
      cell: ({ getValue }) => {
        const fullText = getValue() as string;
        const isLong = fullText.length > 18;
        return (
          <div className="observacion-celda">
            <span className="texto-cortado">{fullText}</span>
            {isLong && (
              <button className="ver-mas-btn" onClick={() => setModalObservacion(fullText)}>
                ...ver más
              </button>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: 'idEstado',
      header: 'Estado',
      cell: ({ getValue }) => {
        const idEstado = getValue() as number;
        let estadoNombre = '';
        let icon = null;
        switch (idEstado) {
          case 1:
            estadoNombre = 'Pendientes';
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
            {onFinalizar && Number(expediente.idEstado) !== 4 && (
              <button
                onClick={() =>
                  setModalConfirm({
                    mensaje: '¿Estás seguro que quieres finalizar el expediente?',
                    onConfirm: () => {
                      finalizarExpediente(expediente);
                      setModalConfirm(null);
                    },
                  })
                }
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
              onClick={() =>
                setModalConfirm({
                  mensaje: '¿Estás seguro que quiere eliminar este expediente? Una vez eliminado no podrá recuperarse.',
                  onConfirm: () => {
                    eliminarExpediente(expediente);
                    setModalConfirm(null);
                  },
                })
              }
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
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted() as string] ?? null}
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
              <tr key={row.id} className={getEstadoClass(Number(row.original.idEstado))}>
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
            table.setPageSize(Number(e.target.value));
          }}
          className="page-size-selector"
        >
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>

{/* Modal Confirmación SIN icono */}
      <Modal
        isOpen={!!modalConfirm}
        onClose={() => setModalConfirm(null)}
        showIcon={false} // Oculta el icono
      >
        <header style={{ backgroundColor: '#062B82', padding: '10px', borderRadius: '4px 4px 0 0', color: '#fff' }}>
          <h3 style={{ margin: 0 }}>Confirmación</h3>
        </header>
        <p>{modalConfirm?.mensaje}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            onClick={() => setModalConfirm(null)}
            style={{
              backgroundColor: '#ccc',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              modalConfirm?.onConfirm();
              setModalConfirm(null);
            }}
            style={{
              backgroundColor: '#d9534f',
              color: '#fff',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Confirmar
          </button>
        </div>
      </Modal>


            {/* Modal Mensaje Exito/Error CON icono */}
          <Modal
        isOpen={!!modalObservacion}
        onClose={() => setModalObservacion(null)}
        showIcon={false}
      >
        <div style={{ padding: '1rem' }}>
          <h3>Observaciones</h3>
          <p>{modalObservacion}</p>
          <button
            onClick={() => setModalObservacion(null)}
            style={{
              marginTop: '1rem',
              backgroundColor: '#007bff',
              color: '#fff',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cerrar
          </button>
        </div>
      </Modal>


      {/* Modal Observación SIN icono */}
     <Modal isOpen={!!modalObservacion} onClose={() => setModalObservacion(null)}>
  <div style={{ padding: '1rem' }}>
    <h3>Observaciones</h3>
    <p
      style={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        maxWidth: '100%',
      }}
    >
      {modalObservacion}
    </p>
    <button
      onClick={() => setModalObservacion(null)}
      style={{
        marginTop: '1rem',
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      Cerrar
    </button>
  </div>
</Modal>



    </div>
  );
};

export default ExpedientesTable;
