import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { predictBatchCSV, clearBatchResults } from '../features/prediction/predictionSlice';
import { fetchDashboardMetrics } from '../features/analytics/analyticsSlice';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Eye,
} from 'lucide-react';
import CustomerDetailModal from '../components/CustomerDetailModal';
import { TableSkeleton } from '../components/Skeleton';
import Loader from '../components/Loader';

const SAMPLE_CSV_CONTENT = `customerID,gender,SeniorCitizen,Partner,Dependents,tenure,PhoneService,MultipleLines,InternetService,OnlineSecurity,OnlineBackup,DeviceProtection,TechSupport,StreamingTV,StreamingMovies,Contract,PaperlessBilling,PaymentMethod,MonthlyCharges,TotalCharges
7590-VHVEG,Female,0,Yes,No,1,No,No phone service,DSL,No,Yes,No,No,No,No,Month-to-month,Yes,Electronic check,29.85,29.85
5575-GNVDE,Male,0,No,No,34,Yes,No,DSL,Yes,No,Yes,No,No,No,One year,No,Mailed check,56.95,1889.50
3668-QPYBK,Male,0,No,No,2,Yes,No,DSL,Yes,Yes,No,No,No,No,Month-to-month,Yes,Mailed check,53.85,108.15
7795-CFOCW,Male,0,No,No,45,No,No phone service,DSL,Yes,No,Yes,Yes,No,No,One year,No,Bank transfer (automatic),42.30,1840.75
9237-HQITU,Female,0,No,No,2,Yes,No,Fiber optic,No,No,No,No,No,No,Month-to-month,Yes,Electronic check,70.70,151.65
9305-CDSKC,Female,0,No,No,8,Yes,Yes,Fiber optic,No,No,Yes,No,Yes,Yes,Month-to-month,Yes,Electronic check,99.65,820.50
1452-KIOVK,Male,0,No,Yes,22,Yes,Yes,Fiber optic,No,Yes,No,No,Yes,No,Month-to-month,Yes,Credit card (automatic),89.10,1949.40
6713-OKOMC,Female,0,No,No,10,No,No phone service,DSL,Yes,No,No,No,No,No,Month-to-month,No,Mailed check,29.75,301.90
7892-POOKP,Female,0,Yes,No,28,Yes,Yes,Fiber optic,No,No,Yes,Yes,Yes,Yes,Month-to-month,Yes,Electronic check,104.80,3046.05`;

const BatchPredictPage = () => {
  const dispatch = useDispatch();
  const { batchResults, isBatchLoading, batchError, globalThreshold } = useSelector(
    (state) => state.prediction
  );

  const [selectedFile, setSelectedFile] = useState(null);
  const [saveToDb, setSaveToDb] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleProcessBatch = async () => {
    if (!selectedFile) return;

    const res = await dispatch(
      predictBatchCSV({
        file: selectedFile,
        threshold: globalThreshold,
        saveToDb,
      })
    );

    if (!res.error) {
      dispatch(fetchDashboardMetrics());
    }
  };

  const downloadSampleTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'telco_churn_batch_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportScoredResults = () => {
    if (!batchResults?.results) return;

    const headers = [
      'customerId',
      'gender',
      'SeniorCitizen',
      'Contract',
      'MonthlyCharges',
      'TotalCharges',
      'churnProbability',
      'churnPrediction',
      'riskLevel',
    ];

    const rows = batchResults.results.map((c) => [
      c.customerId,
      c.gender,
      c.SeniorCitizen,
      `"${c.Contract}"`,
      c.MonthlyCharges,
      c.TotalCharges,
      c.churnProbability,
      c.churnPrediction ? 'CHURN' : 'RETAIN',
      c.riskLevel,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `scored_churn_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter results
  const filteredResults = (batchResults?.results || []).filter((item) => {
    const matchesSearch =
      item.customerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Contract?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'all' || item.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Card */}
      <div className="card" style={{ padding: '18px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Batch Customer Churn Scoring</h2>
            <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '2px' }}>
              Upload customer portfolios via CSV to run bulk machine learning churn inferences in seconds.
            </p>
          </div>

          <button onClick={downloadSampleTemplate} className="btn btn-secondary btn-sm">
            <Download size={14} />
            Download Sample CSV Template
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="card">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          style={{
            border: '2px dashed var(--primary-border)',
            backgroundColor: 'var(--primary-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onClick={() => document.getElementById('csvInput').click()}
        >
          <input
            type="file"
            id="csvInput"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              marginBottom: '12px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <UploadCloud size={28} />
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-900)' }}>
            {selectedFile ? selectedFile.name : 'Choose a CSV file or drag & drop here'}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--navy-500)', marginTop: '4px' }}>
            Supports standard Telco Churn CSV columns (Max 10MB)
          </p>
        </div>

        {/* Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="batchSaveDb"
              checked={saveToDb}
              onChange={(e) => setSaveToDb(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="batchSaveDb" style={{ fontSize: '0.875rem', color: 'var(--navy-700)', cursor: 'pointer' }}>
              Save all scored records to MongoDB
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {batchResults && (
              <button onClick={() => dispatch(clearBatchResults())} className="btn btn-secondary btn-sm">
                Clear Results
              </button>
            )}
            <button
              onClick={handleProcessBatch}
              disabled={!selectedFile || isBatchLoading}
              className="btn btn-primary"
            >
              {isBatchLoading ? (
                <Loader size="sm" text="Scoring Batch Records..." color="#ffffff" />
              ) : (
                <>
                  <FileSpreadsheet size={16} />
                  Run Batch Predictions
                </>
              )}
            </button>
          </div>
        </div>

        {batchError && (
          <div style={{ marginTop: '14px', padding: '12px', backgroundColor: 'var(--risk-high-bg)', border: '1px solid var(--risk-high-border)', color: 'var(--risk-high)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            {batchError}
          </div>
        )}
      </div>

      {/* Batch Results Overview */}
      {batchResults && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Summary KPI Cards */}
          <div className="grid-4">
            <div className="card" style={{ padding: '18px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy-500)' }}>TOTAL PROCESSED</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px' }}>
                {batchResults.summary.total}
              </div>
            </div>

            <div className="card" style={{ padding: '18px', borderLeft: '4px solid var(--risk-high)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--risk-high)' }}>HIGH CHURN RISK</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--risk-high)', marginTop: '4px' }}>
                {batchResults.summary.highRiskCount}
              </div>
            </div>

            <div className="card" style={{ padding: '18px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy-500)' }}>BATCH CHURN RATE</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                {batchResults.summary.churnRate}%
              </div>
            </div>

            <div className="card" style={{ padding: '18px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy-500)' }}>AVG CHURN PROBABILITY</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px' }}>
                {(batchResults.summary.averageChurnProbability * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Results Table & Filter Bar */}
          <div className="card">
            <div className="card-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
              <h3 className="card-title">
                <FileSpreadsheet size={18} color="var(--primary)" />
                Batch Scored Customers ({filteredResults.length})
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                {/* Search */}
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--navy-400)' }} />
                  <input
                    type="text"
                    placeholder="Search by ID or Contract..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control"
                    style={{ paddingLeft: '32px', fontSize: '0.85rem', width: '220px' }}
                  />
                </div>

                {/* Risk Filter */}
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className="form-select"
                  style={{ width: '140px', fontSize: '0.85rem' }}
                >
                  <option value="all">All Risks</option>
                  <option value="High">High Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="Low">Low Risk</option>
                </select>

                {/* Export Button */}
                <button onClick={exportScoredResults} className="btn btn-outline-primary btn-sm">
                  <Download size={14} />
                  Export Scored CSV
                </button>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer ID</th>
                    <th>Contract</th>
                    <th>Tenure</th>
                    <th>Monthly Charges</th>
                    <th>Churn Probability</th>
                    <th>Risk Level</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isBatchLoading ? (
                    <TableSkeleton rows={6} cols={8} />
                  ) : (
                    filteredResults.map((row, idx) => (
                      <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{row.customerId}</td>
                      <td>{row.Contract}</td>
                      <td>{row.tenure} mos</td>
                      <td>${Number(row.MonthlyCharges).toFixed(2)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, minWidth: '42px' }}>
                            {(row.churnProbability * 100).toFixed(1)}%
                          </span>
                          <div style={{ width: '80px', height: '6px', backgroundColor: 'var(--navy-100)', borderRadius: '9999px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${row.churnProbability * 100}%`,
                                height: '100%',
                                backgroundColor:
                                  row.riskLevel === 'High'
                                    ? 'var(--risk-high)'
                                    : row.riskLevel === 'Medium'
                                    ? 'var(--risk-med)'
                                    : 'var(--risk-low)',
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            row.riskLevel === 'High'
                              ? 'badge-high'
                              : row.riskLevel === 'Medium'
                              ? 'badge-medium'
                              : 'badge-low'
                          }`}
                        >
                          {row.riskLevel}
                        </span>
                      </td>
                      <td>
                        {row.churnPrediction ? (
                          <span style={{ color: 'var(--risk-high)', fontWeight: 600, fontSize: '0.8rem' }}>
                            ⚠️ Churn Risk
                          </span>
                        ) : (
                          <span style={{ color: 'var(--risk-low)', fontWeight: 600, fontSize: '0.8rem' }}>
                            ✅ Retained
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedCustomer(row)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px' }}
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

export default BatchPredictPage;
