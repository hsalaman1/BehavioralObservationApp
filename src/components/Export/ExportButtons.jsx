import { useEffect } from 'react';
import { downloadCSV } from './generateCSV';
import { downloadDocx } from './generateDocx';
import { downloadPdf } from './generatePdf';
import { downloadReportFile } from './generateReportFile';
import { useKeyboardVisible } from '../../hooks/useKeyboardVisible';

function StatusMessages({ submitSuccess, submitMode }) {
  if (!submitSuccess) return null;
  return (
    <div className="space-y-1">
      {submitSuccess && (
        <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1">
          {submitMode === 'update' ? 'Report updated successfully!' : 'Report submitted successfully!'}
        </p>
      )}
    </div>
  );
}

const PRIMARY = 'min-h-[44px] py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2';
const ICON = 'min-h-[44px] min-w-[44px] rounded-lg text-sm font-medium transition-colors flex items-center justify-center';

function ActionButtons({ data, onClear, onSubmit, submitting, onAdminOpen, onMyReportsOpen, onActionTaken, variant }) {
  const wrap = (fn) => () => {
    fn();
    onActionTaken?.();
  };
  const primaryGridClass =
    variant === 'sheet'
      ? 'grid grid-cols-2 gap-2'
      : 'grid grid-cols-2 gap-2 md:contents';
  const secondaryClass =
    variant === 'sheet'
      ? 'flex items-center gap-2 mt-2'
      : 'flex items-center gap-2 mt-2 md:contents md:gap-3 md:mt-0';

  return (
    <>
      <div className={primaryGridClass}>
        <button
          onClick={onSubmit}
          disabled={submitting}
          title="Submit report to cloud"
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
          onClick={wrap(() => downloadDocx(data))}
          className={`${PRIMARY} bg-blue-600 text-white hover:bg-blue-700 md:flex-1 md:order-2`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Word
        </button>

        <button
          onClick={wrap(() => downloadPdf(data))}
          className={`${PRIMARY} bg-red-600 text-white hover:bg-red-700 md:flex-1 md:order-3`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          PDF
        </button>

        <button
          onClick={wrap(() => downloadCSV(data))}
          className={`${PRIMARY} bg-green-600 text-white hover:bg-green-700 md:flex-1 md:order-1`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          CSV
        </button>
      </div>

      <div className={secondaryClass}>
        <button
          onClick={wrap(() => window.print())}
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
          onClick={wrap(() => downloadReportFile(data))}
          title="Save report as file (for offline / email to admin)"
          className={`${ICON} bg-indigo-100 text-indigo-700 hover:bg-indigo-200 flex-1 md:flex-none md:px-4 md:order-7`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
          </svg>
        </button>
        <button
          onClick={wrap(onMyReportsOpen)}
          title="My prior reports"
          className={`${ICON} bg-purple-100 text-purple-700 hover:bg-purple-200 flex-1 md:flex-none md:px-3 md:order-8`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </button>
        <button
          onClick={wrap(onAdminOpen)}
          title="Admin"
          className={`${ICON} bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200 flex-1 md:flex-none md:px-3 md:order-9`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </button>
      </div>
    </>
  );
}

export function ExportButtons({
  data,
  onClear,
  onSubmit,
  submitting,
  submitSuccess,
  submitMode,
  onAdminOpen,
  onMyReportsOpen,
  open = false,
  onClose,
}) {
  const keyboardVisible = useKeyboardVisible();

  // Auto-close the mobile sheet after a successful submission.
  useEffect(() => {
    if (submitSuccess && open) {
      const t = setTimeout(() => onClose?.(), 800);
      return () => clearTimeout(t);
    }
  }, [submitSuccess, open, onClose]);

  const desktopBar = (
    <div
      className={`hidden md:block fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg no-print pb-[env(safe-area-inset-bottom)] ${
        keyboardVisible ? 'md:block' : ''
      }`}
    >
      {submitSuccess && (
        <div className="max-w-4xl md:max-w-5xl mx-auto px-4 pt-2">
          <StatusMessages submitSuccess={submitSuccess} submitMode={submitMode} />
        </div>
      )}

      <div className="max-w-4xl md:max-w-5xl mx-auto px-4 py-3 md:flex md:gap-3 md:items-center">
        <ActionButtons
          data={data}
          onClear={onClear}
          onSubmit={onSubmit}
          submitting={submitting}
          onAdminOpen={onAdminOpen}
          onMyReportsOpen={onMyReportsOpen}
          variant="bar"
        />
      </div>
    </div>
  );

  const mobileSheet = open ? (
    <div className="md:hidden fixed inset-0 z-40 no-print">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <span className="block w-10 h-1 rounded-full bg-gray-300" aria-hidden="true" />
            <span className="text-sm font-semibold text-gray-700 ml-2">Actions</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close actions menu"
              className="min-h-[44px] min-w-[44px] rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {submitSuccess && (
          <div className="px-4 pb-3">
            <StatusMessages submitSuccess={submitSuccess} submitMode={submitMode} />
          </div>
        )}

        <div className="px-4 pb-4">
          <ActionButtons
            data={data}
            onClear={onClear}
            onSubmit={onSubmit}
            submitting={submitting}
            onAdminOpen={onAdminOpen}
            onMyReportsOpen={onMyReportsOpen}
            onActionTaken={onClose}
            variant="sheet"
          />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {desktopBar}
      {mobileSheet}
    </>
  );
}
