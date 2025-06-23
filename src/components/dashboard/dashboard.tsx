import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import '../../css/dashboard.css';
import { API_URL } from '../../utils/api';

const COLORS = ['#062B82', '#228B8D', '#F4A300'];

const Dashboard: React.FC = () => {
    const [datosFederales, setDatosFederales] = useState([]);
    const [datosProvinciales, setDatosProvinciales] = useState([]);
    const [datosExtrajudiciales, setDatosExtrajudiciales] = useState([]);

    interface Expediente {
        estado?: string;
    }

    interface EstadoCount {
        [key: string]: number;
    }

    interface EstadoGroup {
        name: string;
        value: number;
    }

    const agruparPorEstado = (expedientes: Expediente[]): EstadoGroup[] => {
        const estadoCount: EstadoCount = {
            'Pendientes': 0,
            'Finalizados': 0,
            'En curso': 0
        };

        expedientes.forEach((exp) => {
            const estado = exp.estado?.toLowerCase() || '';

            if (estado.includes('pendiente')) {
                estadoCount['Pendientes'] += 1;
            } else if (estado.includes('final')) {
                estadoCount['Finalizados'] += 1;
            } else {
                estadoCount['En curso'] += 1;
            }
        });

        return Object.entries(estadoCount).map(([name, value]) => ({ name, value }));
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    const fetchExpedientes = async (tipo: string, setter: Function) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/expedientes/${tipo}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al obtener datos');

            const data = await response.json();
            const agrupados = agruparPorEstado(data);
            setter(agrupados);

        } catch (error) {
            console.error(`Error al cargar expedientes ${tipo}:`, error);
        }
    };

    useEffect(() => {
        fetchExpedientes('federales', setDatosFederales);
        fetchExpedientes('provinciales', setDatosProvinciales);
        fetchExpedientes('extrajudiciales', setDatosExtrajudiciales);
    }, []);

    const renderPieChart = (data: EstadoGroup[], title: string) => (
        <div className="chart-block">
            <h2>{title}</h2>
            <PieChart width={400} height={400}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                >
                    {data.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value: number, name: string) => [`${value} expediente(s)`, name]}
                />
                <Legend />
            </PieChart>
        </div>
    );

    return (
        <div className="dashboard">
            <div style={{ textAlign: 'center' }}>
                <h2>Dashboard</h2>
            </div>
            <div className="charts-container">
                {renderPieChart(datosFederales, 'Federales')}
                {renderPieChart(datosProvinciales, 'Provinciales')}
                {renderPieChart(datosExtrajudiciales, 'Extrajudiciales')}
            </div>
        </div>
    );
};

export default Dashboard;
