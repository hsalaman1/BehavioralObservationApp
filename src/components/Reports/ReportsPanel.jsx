import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '../../hooks/useSupabase';
import { AdminLogin } from '../Admin/AdminLogin';
import { StudentProfilesAdmin } from '../Admin/StudentProfilesAdmin';
import { downloadDocx } from '../Export/generateDocx';
import { downloadCSV } from '../Export/generateCSV';
import { downloadPdf } from '../Export/generatePdf';

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString();
}

export function ReportsPanel() {
  const { fetchObservations, deleteObservation } = useSupabase();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('admin_auth') === '1'
  );
  const [adminView, setAdminView] = useState('reports');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchObservations();
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchObservations]);

  useEffect(() => {
    if (isAuthenticated) loadReports();
  }, [isAuthenticated, loadReports]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setReports([]);
  };

  const handleDownloadDocx = async (report) => {
    setDownloadingId(report.id + '-docx');
    try {
      await downloadDocx(report.data);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadCSV = (report) => {
    setDownloadingId(report.id + '-csv');
    try {
      downloadCSV(report.data);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadPdf = async (report) => {
    setDownloadingId(report.id + '-pdf');
    try {
      await downloadPdf(report.data);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report from the database? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteObservation(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="space-y-4">
      {/* Sub-nav: Reports | Students */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setAdminView('reports')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${adminView === 'reports' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Reports
            </button>
            <button
              onClick={() => setAdminView('students')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${adminView === 'students' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Students
            </button>
          </div>
          <div className="flex items-center gap-3">
            {adminView === 'reports' && (
              <button
                onClick={loadReports}
                disabled={loading}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:opacity-50"
              >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Loading…' : 'Refresh'}
              </button>
            )}
            <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-gray-600">
              Sign out
            </button>
          </div>
        </div>
      </div>

      {adminView === 'students' && <StudentProfilesAdmin />}
      {adminView === 'reports' && <>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
      )}

      {!loading && reports.length === 0 && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center text-sm text-gray-400">
          No reports submitted yet. Once an observer taps “Submit”, their report will appear here.
        </div>
      )}

      {reports.map((report) => (
        <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 truncate">
                {report.student_name || 'Unknown Student'}
                {report.student_id && (
                  <span className="text-gray-400 font-normal text-sm ml-2">#{report.student_id}</span>
                )}
              </p>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                {report.observer_name && <span>Observer: <span className="text-gray-700">{report.observer_name}</span></span>}
                {report.school && <span>School: <span className="text-gray-700">{report.school}</span></span>}
                {report.observation_date && <span>Date: <span className="text-gray-700">{report.observation_date}</span></span>}
                <span>Submitted: <span className="text-gray-700">{formatDate(report.submitted_at)}</span></span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:shrink-0">
              <button
                onClick={() => handleDownloadCSV(report)}
                disabled={!!downloadingId}
                className="flex-1 sm:flex-none bg-green-100 text-green-700 hover:bg-green-200 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 min-h-[44px] sm:min-h-0"
              >
                CSV
              </button>
              <button
                onClick={() => handleDownloadDocx(report)}
                disabled={!!downloadingId}
                className="flex-1 sm:flex-none bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 min-h-[44px] sm:min-h-0"
              >
                {downloadingId === report.id + '-docx' ? '…' : 'Word'}
              </button>
              <button
                onClick={() => handleDownloadPdf(report)}
                disabled={!!downloadingId}
                className="flex-1 sm:flex-none bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 min-h-[44px] sm:min-h-0"
              >
                {downloadingId === report.id + '-pdf' ? '…' : 'PDF'}
              </button>
              <button
                onClick={() => handleDelete(report.id)}
                disabled={deletingId === report.id}
                className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 min-h-[44px] sm:min-h-0"
                title="Delete report"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
      </>}
    </div>
  );
}
