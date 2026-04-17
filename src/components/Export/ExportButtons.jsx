import { downloadCSV } from './generateCSV';
import { downloadDocx } from './generateDocx';
import { downloadPdf } from './generatePdf';
import { useConnectivity } from '../../hooks/useConnectivity';
import { useKeyboardVisible } from '../../hooks/useKeyboardVisible';

function ConnectivityDot({ isOnline, supabaseReachable, checking }) {
  let color, label;
  if (!isOnline) {
    color = 'bg-red-500';
    label = 'Offline';
  } else if (checking || supabaseReachable === null) {
    color = 'bg-yellow-400 animate-pulse';
    label = 'Checking…';
  } else if (supabaseReachable) {
    color = 'bg-green-500';
    label = 'Connected';
  } else {
    color = 'bg-red-500';
    label = 'Server unreachable';
  }

  return (
    <span className="flex items-center gap-1 text-xs text-gray-500 select-none ml-auto" title={label}>
      <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
      <span className="hidden md:inline">{label}</span>
    </span>
  );
}

const PRIMARY = 'min-h-[44px] py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2';
const ICON = 'min-h-[44px] min-w-[44px] rounded-lg text-sm font-medium transition-colors flex items-center justify-center';

export function ExportButtons({ data, onClear, onSubmit, submitting, submitSuccess, submitError, onAdminOpen }) {
  const { isOnline, supabaseReachable, checking, canSubmit } = useConnectivity();
  const keyboardVisible = useKeyboardVisible();

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg no-print pb-[env(safe-area-inset-bottom)] ${
        keyboardVisible ? 'hidden md:block' : ''
      }`}
    >
      {!isOnline && (
        <div className="max-w-4xl md:max-w-5xl mx-auto px-4 pt-2">
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
            You are offline. Connect to the internet to submit reports.
          </p>
        </div>
      )}
      {isOnline && supabaseReachable === false && !checking && (
        <div className="max-w-4xl md:max-w-5xl mx-auto px-4 pt-2">
          <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-2 py-1">
            Cannot reach the server. Submissions are disabled until connectivity is restored.
          </p>
        </div>
      )}
      {submitError && (
        <div className="max-w-4xl md:max-w-5xl mx-auto px-4 pt-2">
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">{submitError}</p>
        </div>
      )}
      {submitSuccess && (
        <div className="max-w-4xl md:max-w-5xl mx-auto px-4 pt-2">
          <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1">
            Report submitted successfully!
          </p>
        </div>
      )}

      <div className="max-w-4xl md:max-w-5xl mx-auto px-4 py-3 md:flex md:gap-3 md:items-center">
        {/* Primary row: 2x2 on mobile, inline on desktop */}
        <div className="grid grid-cols-2 gap-2 md:contents">
          <button
            onClick={onSubmit}
            disabled={submitting || !canSubmit}
            title={!canSubmit ? 'No connection to server' : 'Submit report to cloud'}
            className={`${PRIMARY} bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed md:flex-1 md:order-4`}
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
            onClick={() => downloadDocx(data)}
            className={`${PRIMARY} bg-blue-600 text-white hover:bg-blue-700 md:flex-1 md:order-2`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Word
          </button>

          <button
            onClick={() => downloadPdf(data)}
            className={`${PRIMARY} bg-red-600 text-white hover:bg-red-700 md:flex-1 md:order-3`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            PDF
          </button>

          <button
            onClick={() => downloadCSV(data)}
            className={`${PRIMARY} bg-green-600 text-white hover:bg-green-700 md:flex-1 md:order-1`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            CSV
          </button>
        </div>

        {/* Secondary row: row on mobile, inline on desktop */}
        <div className="flex items-center gap-2 mt-2 md:contents md:gap-3 md:mt-0">
          <button
            onClick={() => window.print()}
            title="Print"
            className={`${ICON} bg-gray-200 text-gray-700 hover:bg-gray-300 flex-1 md:flex-none md:px-4 md:order-5`}
          >
            🖨️
          </button>
          <button
            onClick={onClear}
            title="Clear all data"
            className={`${ICON} bg-red-100 text-red-700 hover:bg-red-200 flex-1 md:flex-none md:px-4 md:order-6`}
          >
            🗑️
          </button>
          <button
            onClick={onAdminOpen}
            title="Admin"
            className={`${ICON} bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200 flex-1 md:flex-none md:px-3 md:order-7`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </button>
          <div className="md:order-8">
            <ConnectivityDot isOnline={isOnline} supabaseReachable={supabaseReachable} checking={checking} />
          </div>
        </div>
      </div>
    </div>
  );
}
