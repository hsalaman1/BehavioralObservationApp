import { formatTotalDuration } from '../../hooks/useTimestamp';

export function generateCSV(data) {
  const lines = [];

  // Header
  lines.push('BEHAVIORAL OBSERVATION REPORT');
  lines.push('');

  // Session Information
  lines.push('SESSION INFORMATION');
  lines.push(`Student Name,${escapeCSV(data.header.studentName)}`);
  lines.push(`Student ID,${escapeCSV(data.header.studentId)}`);
  lines.push(`School,${escapeCSV(data.header.school)}`);
  lines.push(`Date,${data.header.date}`);
  lines.push(`Observer,${escapeCSV(data.header.observer)}`);
  lines.push(`Start Time,${data.header.startTime}`);
  lines.push(`End Time,${data.header.endTime}`);
  lines.push(`RBT Present,${data.header.rbtPresent}`);
  if (data.header.rbtName) {
    lines.push(`RBT Name,${escapeCSV(data.header.rbtName)}`);
  }
  lines.push('');

  // Location & Activity
  lines.push('LOCATION & ACTIVITY');
  lines.push(`Location,${data.location.join('; ')}`);
  lines.push(`Activity,${data.activity.join('; ')}`);
  lines.push('');

  // Duration Data
  lines.push('DURATION DATA');
  lines.push('Behavior,Total Duration,Instances');
  lines.push(`Crisis,${formatTotalDuration(data.durationData.crisis.totalSeconds)},${data.durationData.crisis.instances}`);
  lines.push(`On Task,${formatTotalDuration(data.durationData.onTask.totalSeconds)},${data.durationData.onTask.instances}`);
  lines.push(`Off Task,${formatTotalDuration(data.durationData.offTask.totalSeconds)},${data.durationData.offTask.instances}`);
  lines.push('');

  // Frequency Data
  lines.push('FREQUENCY DATA');
  lines.push('Behavior,Count');
  Object.entries(data.behaviorCounts).forEach(([key, value]) => {
    const label = key.replace(/([A-Z])/g, ' $1').trim();
    lines.push(`${label},${value}`);
  });
  const transitionPercent = data.transitions.attempts > 0
    ? Math.round((data.transitions.successes / data.transitions.attempts) * 100)
    : 0;
  lines.push(`Transitions,${data.transitions.successes}/${data.transitions.attempts} (${transitionPercent}%)`);
  lines.push('');

  // Narrative Log
  lines.push('NARRATIVE LOG');
  lines.push('Time,Narrative');
  data.narratives.forEach((n) => {
    lines.push(`${n.time},${escapeCSV(n.text)}`);
  });
  lines.push('');

  // ABC Data
  lines.push('ABC DATA');
  lines.push('Time,Antecedent,Behavior,Consequence');
  data.abcEntries.forEach((e) => {
    lines.push(`${e.time},${escapeCSV(e.antecedent)},${escapeCSV(e.behavior)},${escapeCSV(e.consequence)}`);
  });
  lines.push('');

  // Recommendations
  lines.push('RECOMMENDATIONS');
  Object.entries(data.recommendations).forEach(([key, value]) => {
    if (value.checked) {
      const label = key.replace(/([A-Z])/g, ' $1').trim();
      lines.push(`${label},${escapeCSV(value.note || 'Yes')}`);
    }
  });
  lines.push('');

  // Next Steps
  lines.push('NEXT STEPS');
  data.nextSteps.forEach((step) => {
    const label = step.replace(/([A-Z])/g, ' $1').trim();
    lines.push(label);
  });

  return lines.join('\n');
}

function escapeCSV(value) {
  if (!value) return '';
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function getInitials(name) {
  if (!name) return 'OBS';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}

function formatDateForFilename(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const shortYear = year.slice(-2);
  return `${parseInt(month)}.${parseInt(day)}.${shortYear}`;
}

export function downloadCSV(data) {
  const csv = generateCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const initials = getInitials(data.header.studentName);
  const dateFormatted = formatDateForFilename(data.header.date);
  link.download = `Behavioral Observation Report ${initials} ${dateFormatted}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
