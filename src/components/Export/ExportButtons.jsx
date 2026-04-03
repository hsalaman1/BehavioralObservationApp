import { downloadCSV } from './generateCSV';
import { downloadDocx } from './generateDocx';

export function ExportButtons({ data, onClear, onSubmit, submitting, submitSuccess, submitError, onAdminOpen }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg no-print">
      {submitError && (
        <div className="max-w-4xl mx-auto px-4 pt-2">
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">{submitError}</p>
        </div>
      )}
      {submitSuccess && (
        <div className="max-w-4xl mx-auto px-4 pt-2">
          <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1">
            Report submitted successfully!
          </p>
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 py-3 flex gap-3">
        <button
          onClick={() => downloadCSV(data)}
          className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          CSV
        </button>
        <button
          onClick={() => downloadDocx(data)}
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Word
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          title="Submit report to cloud"
          className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {submitting ? (
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          )}
          {submitting ? 'Submitting…' : 'Submit'}
        </button>
        <button
          onClick={() => window.print()}
          className="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
        >
          🖨️
        </button>
        <button
          onClick={onClear}
          className="bg-red-100 text-red-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
        >
          🗑️
        </button>
        <button
          onClick={onAdminOpen}
          title="Admin"
          className="bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200 px-3 py-2.5 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
