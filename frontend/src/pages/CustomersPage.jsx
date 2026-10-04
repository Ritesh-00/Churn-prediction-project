import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, deleteCustomer } from '../features/customers/customerSlice';
import { fetchDashboardMetrics } from '../features/analytics/analyticsSlice';
import {
  Users,
  Search,
  Filter,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import CustomerDetailModal from '../components/CustomerDetailModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { TableSkeleton } from '../components/Skeleton';
import Loader from '../components/Loader';

const CustomersPage = () => {
  const dispatch = useDispatch();
  const { list, pagination, isLoading } = useSelector((state) => state.customers);

  const [search, setSearch] = useState('');
  const [riskLevel, setRiskLevel] = useState('all');
  const [contract, setContract] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  useEffect(() => {
    dispatch(
      fetchCustomers({
        page,
        limit: 10,
        search,
        riskLevel,
        contract,
      })
    );
  }, [dispatch, page, search, riskLevel, contract]);

  const handleDeleteClick = (customer, e) => {
    e.stopPropagation();
    setCustomerToDelete(customer);
  };

  const handleConfirmDelete = async () => {
    if (customerToDelete) {
      const id = customerToDelete._id || customerToDelete.customerId;
      await dispatch(deleteCustomer(id));
      setCustomerToDelete(null);
      dispatch(fetchDashboardMetrics());
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="card" style={{ padding: '18px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Customer Directory & Retention Registry</h2>
            <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '2px' }}>
              Search, filter, and inspect scored customer profiles stored in the system.
            </p>
          </div>

          <button
            onClick={() => dispatch(fetchCustomers({ page, limit: 10, search, riskLevel, contract }))}
            disabled={isLoading}
            className="btn btn-secondary btn-sm"
          >
            {isLoading ? (
              <Loader size="xs" text="Refreshing..." />
            ) : (
              <>
                <RefreshCw size={14} />
                Refresh Records
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <Search size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--navy-400)' }} />
            <input
              type="text"
              placeholder="Search by Customer ID or Payment Method..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="form-control"
              style={{ paddingLeft: '36px' }}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={15} color="var(--navy-500)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-600)' }}>Risk:</span>
            </div>
            <select
              value={riskLevel}
              onChange={(e) => {
                setRiskLevel(e.target.value);
                setPage(1);
              }}
              className="form-select"
              style={{ width: '130px', fontSize: '0.85rem' }}
            >
              <option value="all">All Risks</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>

            <select
              value={contract}
              onChange={(e) => {
                setContract(e.target.value);
                setPage(1);
              }}
              className="form-select"
              style={{ width: '160px', fontSize: '0.85rem' }}
            >
              <option value="all">All Contracts</option>
              <option value="Month-to-month">Month-to-month</option>
              <option value="One year">One year</option>
              <option value="Two year">Two year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="card">
        {list.length === 0 && !isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--navy-500)' }}>
            <Users size={40} strokeWidth={1.5} style={{ margin: '0 auto 10px', color: 'var(--navy-400)' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--navy-700)' }}>No customer records found</h4>
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
              Run single customer predictions or batch upload CSVs to populate the registry.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Contract</th>
                  <th>Tenure</th>
                  <th>Monthly Charges</th>
                  <th>Total Charges</th>
                  <th>Churn Probability</th>
                  <th>Risk Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeleton rows={8} cols={8} />
                ) : (
                  list.map((c) => (
                    <tr
                      key={c._id || c.customerId}
                      onClick={() => setSelectedCustomer(c)}
                      style={{ cursor: 'pointer' }}
                    >
                    <td style={{ fontWeight: 600 }}>{c.customerId}</td>
                    <td>{c.Contract}</td>
                    <td>{c.tenure} mos</td>
                    <td>${Number(c.MonthlyCharges).toFixed(2)}</td>
                    <td>${Number(c.TotalCharges).toFixed(2)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, minWidth: '42px' }}>
                          {(c.churnProbability * 100).toFixed(1)}%
                        </span>
                        <div style={{ width: '70px', height: '6px', backgroundColor: 'var(--navy-100)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${c.churnProbability * 100}%`,
                              height: '100%',
                              backgroundColor:
                                c.riskLevel === 'High'
                                  ? 'var(--risk-high)'
                                  : c.riskLevel === 'Medium'
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
                          c.riskLevel === 'High'
                            ? 'badge-high'
                            : c.riskLevel === 'Medium'
                            ? 'badge-medium'
                            : 'badge-low'
                        }`}
                      >
                        {c.riskLevel}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedCustomer(c)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '5px 8px' }}
                          title="View Full Profile"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(c, e)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '5px 8px' }}
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination && pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid var(--navy-100)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--navy-500)' }}>
              Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} total records)
            </span>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn btn-secondary btn-sm"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="btn btn-secondary btn-sm"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(customerToDelete)}
        customerId={customerToDelete?.customerId}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCustomerToDelete(null)}
      />
    </div>
  );
};

export default CustomersPage;
