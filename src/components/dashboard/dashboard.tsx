import React from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import '../../css/dashboard.css';

const data = [
  { name: 'Pendientes', value: 50 },
  { name: 'Finalizados', value: 35 },
  { name: 'En curso', value: 15 }
];

const COLORS = ['#062B82', '#228B8D', '#F4A300'];

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard">
            <div style={{ textAlign: 'center' }}>
                <h2>Dashboard</h2>
            </div>            
            <div className="charts-container">
                <div className="chart-block">
                    <h2>Federales</h2>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </div>

                <div className="chart-block">
                    <h2>Provinciales</h2>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </div>

                <div className="chart-block">
                    <h2>Extrajudiciales</h2>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
