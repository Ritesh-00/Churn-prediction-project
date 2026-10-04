import React, { useState } from 'react';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import SinglePredictPage from './pages/SinglePredictPage';
import BatchPredictPage from './pages/BatchPredictPage';
import CustomersPage from './pages/CustomersPage';
import ThresholdSimulatorPage from './pages/ThresholdSimulatorPage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      {/* Top Sticky Header with System Status & Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && <DashboardPage setActiveTab={setActiveTab} />}
        {activeTab === 'predict' && <SinglePredictPage />}
        {activeTab === 'batch' && <BatchPredictPage />}
        {activeTab === 'customers' && <CustomersPage />}
        {activeTab === 'threshold' && <ThresholdSimulatorPage />}
      </main>
    </div>
  );
}

export default App;
