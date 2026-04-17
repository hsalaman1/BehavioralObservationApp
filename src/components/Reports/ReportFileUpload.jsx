import { useRef, useState } from 'react';
import { parseReportFile } from '../Export/generateReportFile';
import { useSupabase } from '../../hooks/useSupabase';

export function ReportFileUpload({ onUploaded }) {
  const inputRef = useRef(null);
  const { submitObservation } = useSupabase();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);

  const handlePick = () => {
    setStatus(null);
    inputRef.current?.click();
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setBusy(true);
    setStatus(null);
    try {
      const text = await file.text();
      const data = parseReportFile(text);
      const ok = await submitObservation(data);
      if (!ok) throw new Error('Upload to the database failed.');
      setStatus({ type: 'ok', message: `Uploaded ${file.name}.` });
      onUploaded?.();
    } catch (err) {
      setStatus({ type: 'err', message: err.message || 'Upload failed.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handlePick}
        disabled={busy}
        className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 disabled:opacity-50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M17 8l-5-5m0 0L7 8m5-5v12" />
        </svg>
        {busy ? 'Uploading…' : 'Upload report file'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFile}
        className="hidden"
      />
      {status && (
        <span className={`text-xs ${status.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
          {status.message}
        </span>
      )}
    </div>
  );
}
