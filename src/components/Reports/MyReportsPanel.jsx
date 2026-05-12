import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '../../hooks/useSupabase';

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString();
}

export function MyReportsPanel({ observerName, onResume, onClose }) {
  const { fetchObservationsByObserver, isConfigured } = useSupabase();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nameInput, setNameInput] = useState((observerName || '').trim());

  const effectiveName = nameInput.trim();

  const loadReports = useCallback(async (name) => {
    if (!name) {
      setReports([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchObservationsByObserver(name);
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchObservationsByObserver]);

  useEffect(() => {
    if (isConfigured) loadReports(effectiveName);
  }, [isConfigured, effectiveName, loadReports]);

  const handleResume = (report) => {
    const ok = window.confirm(
      'Resume this report? Your current in-progress observation will be replaced, ' +
      'and saving again will overwrite this report.'
    );
    if (!ok) return;
    onResume?.(report);
  };

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 overflow-y-auto pb-24">
      <div className="max-w-4xl md:max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-gray-800">My Prior Observations</h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 flex items-center gap-1 text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close
          </button>
        </div>


        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <label className="block text-xs text-gray-600 mb-1">Observer name</label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter your name to find your prior reports"
            className="w-full border rounded px-2 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
          <p className="text-[11px] text-gray-500 mt-1">
            Reports are matched by the Observer Name saved on each submission.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">{error}</div>
        )}

        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center text-sm text-gray-500">
            Loading…
          </div>
        )}

        {!loading && isConfigured && effectiveName && reports.length === 0 && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center text-sm text-gray-400">
            No prior reports found for “{effectiveName}”.
          </div>
        )}

        {!loading && !effectiveName && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center text-sm text-gray-400">
            Enter your observer name above to see your prior reports.
          </div>
        )}

        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 truncate">
                    {report.student_name || 'Unknown Student'}
                    {report.student_id && (
                      <span className="text-gray-400 font-normal text-sm ml-2">#{report.student_id}</span>
                    )}
                  </p>
                  <div className="mt-1 flex flex-col md:flex-row md:flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    {report.school && <span>School: <span className="text-gray-700">{report.school}</span></span>}
                    {report.observation_date && <span>Date: <span className="text-gray-700">{report.observation_date}</span></span>}
                    <span>Submitted: <span className="text-gray-700">{formatDate(report.submitted_at)}</span></span>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:shrink-0">
                  <button
                    onClick={() => handleResume(report)}
                    className="flex-1 md:flex-none bg-purple-600 text-white hover:bg-purple-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors min-h-[44px]"
                    title="Reopen this report and continue adding to it"
                  >
                    Resume
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
