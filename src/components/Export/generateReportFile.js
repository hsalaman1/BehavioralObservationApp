const REPORT_FILE_KIND = 'behavioral-observation-report';
const REPORT_FILE_VERSION = 1;

export function buildReportEnvelope(data) {
  return {
    kind: REPORT_FILE_KIND,
    version: REPORT_FILE_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };
}

function safeSegment(str, fallback) {
  const cleaned = (str || '').trim().replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
  return cleaned || fallback;
}

export function downloadReportFile(data) {
  const envelope = buildReportEnvelope(data);
  const blob = new Blob([JSON.stringify(envelope, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const student = safeSegment(data?.header?.studentName, 'unknown');
  const date = safeSegment(data?.header?.date, new Date().toISOString().slice(0, 10));
  link.download = `report-${student}-${date}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseReportFile(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('File is not valid JSON.');
  }
  if (!parsed || parsed.kind !== REPORT_FILE_KIND) {
    throw new Error('Not a behavioral observation report file.');
  }
  if (!parsed.data || typeof parsed.data !== 'object') {
    throw new Error('Report file is missing the data object.');
  }
  if (!parsed.data.header || typeof parsed.data.header !== 'object') {
    throw new Error('Report file is missing the header.');
  }
  return parsed.data;
}
