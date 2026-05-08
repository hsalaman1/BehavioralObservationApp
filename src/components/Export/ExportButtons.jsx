import { useEffect, useRef, useState } from 'react';
import { downloadCSV } from './generateCSV';
import { downloadDocx } from './generateDocx';
import { downloadPdf } from './generatePdf';
import { downloadReportFile } from './generateReportFile';
import { useKeyboardVisible } from '../../hooks/useKeyboardVisible';

function OfflineReadyPill({ offlineReady }) {
  if (!offlineReady) return null;
  return (
    <span
      className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5"
      title="App and assets are cached on this device — it will load even without internet."
    >
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      Offline-ready
    </span>
  );
}

function ConnectivityDot({ isOnline, supabaseReachable, checking, pendingCount = 0, showLabelOnMobile = false }) {
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

  const titleWithPending = pendingCount > 0
    ? `${label} • ${pendingCount} pending sync`
    : label;

  return (
    <span className="flex items-center gap-1 text-xs text-gray-500 select-none" title={titleWithPending}>
      <span className="relative inline-block w-2 h-2">
        <span className={`block w-2 h-2 rounded-full ${color}`} />
        {pendingCount > 0 && (
          <span
            className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-white text-[10px] leading-4 text-center font-semibold"
            aria-label={`${pendingCount} pending`}
          >
            {pendingCount}
          </span>
        )}
      </span>
      <span className={showLabelOnMobile ? 'inline ml-1' : 'hidden md:inline ml-1'}>{label}</span>
    </span>
  );
}

function StatusMessages({
  isOnline,
  supabaseReachable,
  checking,
  submitError,
  submitSuccess,
  submitMode,
  pending = [],
  syncing = false,
  offlineReady = false,
  queueNotice = null,
  onDismissQueueNotice,
  syncedFlash = null,
  onRetryItem,
  onRemoveItem,
}) {
  const queuedCount = pending.filter((p) => p.status === 'queued' || p.status === 'syncing').length;
  const erroredItems = pending.filter((p) => p.status === 'error');

  const showAny =
    !isOnline ||
    (isOnline && supabaseReachable === false && !checking) ||
    submitError ||
    submitSuccess ||
    queuedCount > 0 ||
    erroredItems.length > 0 ||
    queueNotice ||
    syncedFlash;

  if (!showAny) return null;

  return (
    <div className="space-y-1">
      {!isOnline && queuedCount === 0 && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
          You are offline. Submissions will queue locally and sync automatically when you reconnect.
        </p>
      )}
      {!isOnline && queuedCount > 0 && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
          You are offline — {queuedCount} report{queuedCount === 1 ? '' : 's'} will sync automatically when you reconnect.
        </p>
      )}
      {isOnline && supabaseReachable === false && !checking && (
        <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-2 py-1">
          Cannot reach the server. {queuedCount > 0
            ? `${queuedCount} report${queuedCount === 1 ? '' : 's'} queued locally.`
            : 'Submissions will queue locally until connectivity is restored.'}
        </p>
      )}
      {isOnline && supabaseReachable !== false && queuedCount > 0 && (
        <p className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded px-2 py-1">
          {syncing
            ? `Syncing ${queuedCount} pending report${queuedCount === 1 ? '' : 's'}…`
            : `${queuedCount} report${queuedCount === 1 ? '' : 's'} queued for sync.`}
        </p>
      )}
      {syncedFlash && (
        <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1">
          All {syncedFlash} report{syncedFlash === 1 ? '' : 's'} synced.
        </p>
      )}
      {queueNotice?.kind === 'queued-offline' && (
        <p className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded px-2 py-1 flex items-start justify-between gap-2">
          <span>Saved offline. It will sync automatically when you reconnect.</span>
          <button type="button" onClick={onDismissQueueNotice} className="text-blue-500 hover:text-blue-700">×</button>
        </p>
      )}
      {queueNotice?.kind === 'queued-after-fail' && (
        <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-2 py-1 flex items-start justify-between gap-2">
          <span>Server didn't respond. Saved locally — will retry automatically.</span>
          <button type="button" onClick={onDismissQueueNotice} className="text-yellow-600 hover:text-yellow-800">×</button>
        </p>
      )}
      {queueNotice?.kind === 'submitted' && (
        <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1 flex items-start justify-between gap-2">
          <span>Report submitted. Ready for the next one.</span>
          <button type="button" onClick={onDismissQueueNotice} className="text-green-600 hover:text-green-800">×</button>
        </p>
      )}
      {submitError && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">{submitError}</p>
      )}
      {submitSuccess && !queueNotice && (
        <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1">
          {submitMode === 'update' ? 'Report updated successfully!' : 'Report submitted successfully!'}
        </p>
      )}
      {erroredItems.map((item) => (
        <div
          key={item.localId}
          className="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1 flex items-start justify-between gap-2"
        >
          <span className="flex-1">
            <strong>Sync failed:</strong>{' '}
            {item.payload?.header?.studentName || 'Untitled report'}
            {item.lastError ? ` — ${item.lastError}` : ''}
          </span>
          <span className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onRetryItem?.(item.localId)}
              className="underline hover:no-underline"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => onRemoveItem?.(item.localId)}
              className="text-red-500 hover:text-red-700"
              title="Discard this queued report"
            >
              Discard
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}

const PRIMARY = 'min-h-[44px] py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2';
const ICON = 'min-h-[44px] min-w-[44px] rounded-lg text-sm font-medium transition-colors flex items-center justify-center';

function ActionButtons({
  data,
  onClear,
  onSubmit,
  submitting,
  canSubmit,
  pendingCount,
  syncing,
  onSyncNow,
  onAdminOpen,
  onMyReportsOpen,
  onActionTaken,
  variant,
}) {
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

  const submitLabel = submitting
    ? 'Submitting…'
    : canSubmit
      ? 'Submit'
      : 'Save & Queue';
  const submitTitle = canSubmit
    ? 'Submit report to cloud'
    : 'No connection — your report will be saved locally and synced automatically when you reconnect';

  return (
    <>
      <div className={primaryGridClass}>
        <button
          onClick={onSubmit}
          disabled={submitting}
          title={submitTitle}
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
          {submitLabel}
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
        {pendingCount > 0 && (
          <button
            onClick={onSyncNow}
            disabled={!canSubmit || syncing}
            title={!canSubmit ? 'Reconnect to sync' : 'Sync queued reports now'}
            className={`${ICON} bg-amber-100 text-amber-800 hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1 md:flex-none md:px-4 md:order-[5.5] gap-1`}
          >
            <svg className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-xs font-semibold">Sync ({pendingCount})</span>
          </button>
        )}
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
  submitError,
  submitMode,
  onAdminOpen,
  onMyReportsOpen,
  open = false,
  onClose,
  connectivity,
  syncQueue,
  offlineReady,
  queueNotice,
  onDismissQueueNotice,
}) {
  const { isOnline, supabaseReachable, checking, canSubmit } = connectivity;

  const pending = syncQueue?.pending || [];
  const pendingCount = pending.filter((p) => p.status === 'queued' || p.status === 'syncing').length;
  const erroredCount = pending.filter((p) => p.status === 'error').length;
  const badgeCount = pendingCount + erroredCount;
  const syncing = !!syncQueue?.syncing;

  const keyboardVisible = useKeyboardVisible();

  // Briefly flash a success banner when the queue drains from non-zero to zero.
  const [syncedFlash, setSyncedFlash] = useState(null);
  const prevPendingRef = useRef(pendingCount);
  useEffect(() => {
    if (prevPendingRef.current > 0 && pendingCount === 0 && erroredCount === 0) {
      setSyncedFlash(prevPendingRef.current);
      const t = setTimeout(() => setSyncedFlash(null), 4000);
      prevPendingRef.current = 0;
      return () => clearTimeout(t);
    }
    prevPendingRef.current = pendingCount;
    return undefined;
  }, [pendingCount, erroredCount]);

  // Auto-close the mobile sheet after a successful submission.
  useEffect(() => {
    if (submitSuccess && open) {
      const t = setTimeout(() => onClose?.(), 800);
      return () => clearTimeout(t);
    }
  }, [submitSuccess, open, onClose]);

  // Auto-dismiss queue notices after a few seconds.
  useEffect(() => {
    if (queueNotice && onDismissQueueNotice) {
      const t = setTimeout(onDismissQueueNotice, 4000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [queueNotice, onDismissQueueNotice]);

  const handleSyncNow = () => {
    // retryAll flips any errored items back to 'queued' before flushing, so a
    // single button can both retry failures and drain pending items.
    if (syncQueue?.retryAll) {
      syncQueue.retryAll();
    } else {
      syncQueue?.flushQueue?.();
    }
  };

  const sharedStatus = (
    <StatusMessages
      isOnline={isOnline}
      supabaseReachable={supabaseReachable}
      checking={checking}
      submitError={submitError}
      submitSuccess={submitSuccess}
      submitMode={submitMode}
      pending={pending}
      syncing={syncing}
      offlineReady={offlineReady}
      queueNotice={queueNotice}
      onDismissQueueNotice={onDismissQueueNotice}
      syncedFlash={syncedFlash}
      onRetryItem={syncQueue?.retryItem}
      onRemoveItem={syncQueue?.removeItem}
    />
  );

  const desktopBar = (
    <div
      className={`hidden md:block fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg no-print pb-[env(safe-area-inset-bottom)] ${
        keyboardVisible ? 'md:block' : ''
      }`}
    >
      {(submitError ||
        submitSuccess ||
        !isOnline ||
        supabaseReachable === false ||
        pendingCount > 0 ||
        erroredCount > 0 ||
        queueNotice ||
        syncedFlash) && (
        <div className="max-w-4xl md:max-w-5xl mx-auto px-4 pt-2">
          {sharedStatus}
        </div>
      )}

      <div className="max-w-4xl md:max-w-5xl mx-auto px-4 py-3 md:flex md:gap-3 md:items-center">
        <ActionButtons
          data={data}
          onClear={onClear}
          onSubmit={onSubmit}
          submitting={submitting}
          canSubmit={canSubmit}
          pendingCount={badgeCount}
          syncing={syncing}
          onSyncNow={handleSyncNow}
          onAdminOpen={onAdminOpen}
          onMyReportsOpen={onMyReportsOpen}
          variant="bar"
        />
        <div className="md:order-10 md:ml-auto flex items-center gap-2">
          <OfflineReadyPill offlineReady={offlineReady} />
          <ConnectivityDot
            isOnline={isOnline}
            supabaseReachable={supabaseReachable}
            checking={checking}
            pendingCount={badgeCount}
          />
        </div>
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
            <ConnectivityDot
              isOnline={isOnline}
              supabaseReachable={supabaseReachable}
              checking={checking}
              pendingCount={badgeCount}
              showLabelOnMobile
            />
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

        <div className="px-4 pb-3">
          {sharedStatus}
        </div>

        <div className="px-4 pb-4">
          <ActionButtons
            data={data}
            onClear={onClear}
            onSubmit={onSubmit}
            submitting={submitting}
            canSubmit={canSubmit}
            pendingCount={badgeCount}
            syncing={syncing}
            onSyncNow={handleSyncNow}
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
