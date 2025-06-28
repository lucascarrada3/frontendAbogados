import React, { useState } from 'react';
import FederalesPage from './FederalesPage';
import ProvincialesPage from './ProvincialesPage';
import ExtrajudicialesPage from './ExtrajudicialesPage';
import '../../css/TabsExpedientesPage.css';

const TabsExpedientesPage: React.FC = () => {
  const [tab, setTab] = useState<'provinciales' | 'federales' | 'extrajudiciales'>('provinciales');

  const renderTab = () => {
    switch (tab) {
      case 'provinciales':
        return <ProvincialesPage />;
      case 'federales':
        return <FederalesPage />;
      case 'extrajudiciales':
        return <ExtrajudicialesPage />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1 style={{ textAlign: 'center' }}>Gestión de Expedientes</h1>

      <div className="tabs-container">
        {(
          [
            { key: 'provinciales', label: 'Fuero Provincial' },
            { key: 'federales', label: 'Fuero Federal' },
            { key: 'extrajudiciales', label: 'Extrajudicial' },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`tab-button ${tab === key ? 'active' : ''}`}
          >
            {label}
          </button>
        ))}

        <div className="nuevoexp">
          <button onClick={() => window.open('/expedientes/nuevoexpediente', '_self')}>
            Nuevo Expediente
          </button>
        </div>
      </div>

      <div>{renderTab()}</div>
    </div>
  );
};

export default TabsExpedientesPage;
