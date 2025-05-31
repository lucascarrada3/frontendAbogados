import React, { useState } from 'react';
import FederalesPage from './FederalesPage';
import ProvincialesPage from './ProvincialesPage';
import ExtrajudicialesPage from './ExtrajudicialesPage';
import '../../css/TabsExpedientesPage.css';

const TabsExpedientesPage: React.FC = () => {
  const [tab, setTab] = useState<'federales' | 'provinciales' | 'extrajudiciales' | 'nuevoexpediente'>('federales');

  return (
    <div style={{ padding: '50px' }}>
      <h1 style={{ textAlign: 'center' }}>Gestión de Expedientes</h1>

      <div className="tabs-container">
        <button
          onClick={() => setTab('federales')}
          className={`tab-button ${tab === 'federales' ? 'active' : ''}`}
        >
          Federales
        </button>
        <button
          onClick={() => setTab('provinciales')}
          className={`tab-button ${tab === 'provinciales' ? 'active' : ''}`}
        >
          Provinciales
        </button>
        <button
          onClick={() => setTab('extrajudiciales')}
          className={`tab-button ${tab === 'extrajudiciales' ? 'active' : ''}`}
        >
          Extrajudiciales
        </button>
        <div className="nuevoexp">
        <button
          onClick={() => window.open('/expedientes/nuevoexpediente', '_self')}
        >
          Nuevo Expediente
        </button>
        </div>
      </div>

      <div>
        {tab === 'federales' && <FederalesPage />}
        {tab === 'provinciales' && <ProvincialesPage />}
        {tab === 'extrajudiciales' && <ExtrajudicialesPage />}
      </div>
    </div>
  );
};

export default TabsExpedientesPage;
