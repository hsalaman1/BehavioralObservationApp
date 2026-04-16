import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { formatTotalDuration } from '../../hooks/useTimestamp';

if (pdfFonts && pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else if (pdfFonts && pdfFonts.vfs) {
  pdfMake.vfs = pdfFonts.vfs;
}

const BLUE = '#2B579A';
const HEADER_BG = '#E8EEF4';
const ZEBRA = '#F5F5F5';
const BORDER = '#D0D0D0';
const TEXT = '#333333';
const MUTED = '#666666';
const WHITE = '#FFFFFF';

const STUDENT_TASK_LABELS = {
  wholeGroup: 'Whole Group Instruction',
  smallGroup: 'Small Group Instruction',
  independent: 'Independent Work',
  other: 'Other'
};

const ENGAGEMENT_LABELS = {
  engaged: 'Engaged with appropriate activity',
  notEngaged: 'Not engaged with appropriate activity'
};

const SUPPORTS_LABELS = {
  tokenBoard: 'Token Board',
  firstThen: 'First/Then Board',
  visualSchedule: 'Visual Schedule',
  timer: 'Timer',
  reinforcers: 'Reinforcers',
  communicationSupports: 'Communication Supports',
  breakArea: 'Break Area',
  other: 'Other'
};

function formatTime(t) {
  if (!t) return '';
  const m = t.match(/^(\d{1,2}:\d{2})(?::\d{2})?\s*(AM|PM)$/i);
  if (m) return `${m[1]} ${m[2].toUpperCase()}`;
  return t;
}

function formatDateLong(d) {
  if (!d) return '';
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const parts = d.split('-');
  if (parts.length !== 3) return d;
  const [y, mo, da] = parts;
  return `${months[parseInt(mo, 10) - 1]} ${parseInt(da, 10)}, ${y}`;
}

function fmtObserver(name, title) {
  if (!name) return '';
  return title ? `${name}, ${title}` : name;
}

function formatYesNo(value) {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return 'N/A';
}

function hasContent(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.values(value).some(v => hasContent(v));
  return true;
}

function formatStudentTasks(tasks, otherText) {
  if (!tasks || tasks.length === 0) return '';
  return tasks.map(task => {
    if (task === 'other' && otherText) return `Other: ${otherText}`;
    return STUDENT_TASK_LABELS[task] || task;
  }).join(', ');
}

function formatCamelCase(str) {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()).trim();
}

function formatArrayAsLabels(arr) {
  if (!arr || arr.length === 0) return '';
  return arr.map(item => formatCamelCase(item)).join(', ');
}

function pct(n, d) {
  return d > 0 ? `${n}/${d} (${Math.round((n / d) * 100)}%)` : '0/0 (0%)';
}

const tableLayout = {
  hLineColor: () => BORDER,
  vLineColor: () => BORDER,
  hLineWidth: () => 0.5,
  vLineWidth: () => 0.5,
  paddingLeft: () => 4,
  paddingRight: () => 4,
  paddingTop: () => 4,
  paddingBottom: () => 4,
};

function sectionHeader(title) {
  return {
    table: {
      widths: ['*'],
      body: [[{
        text: title.toUpperCase(),
        bold: true,
        fontSize: 10,
        color: BLUE,
        fillColor: HEADER_BG,
        border: [true, true, true, true],
      }]]
    },
    layout: tableLayout,
    margin: [0, 8, 0, 2],
  };
}

function kvTable(rows) {
  return {
    table: {
      widths: ['30%', '70%'],
      body: rows.map(([label, value]) => [
        {
          text: label,
          bold: true,
          fontSize: 9,
          color: MUTED,
          fillColor: HEADER_BG,
          border: [true, true, true, true],
        },
        {
          text: value || 'Not specified',
          fontSize: 10,
          color: value ? TEXT : MUTED,
          italics: !value,
          border: [true, true, true, true],
        },
      ]),
    },
    layout: tableLayout,
    margin: [0, 2, 0, 6],
  };
}

function dataTable(headers, rows) {
  const colCount = headers.length;
  const colWidth = `${Math.floor(100 / colCount)}%`;
  return {
    table: {
      headerRows: 1,
      widths: headers.map(() => colWidth),
      body: [
        headers.map(h => ({
          text: h,
          bold: true,
          fontSize: 9,
          color: TEXT,
          fillColor: HEADER_BG,
          border: [true, true, true, true],
        })),
        ...rows.map((row, i) => row.map((cell, ci) => ({
          text: cell ?? '',
          fontSize: 10,
          color: TEXT,
          fillColor: i % 2 === 0 ? WHITE : ZEBRA,
          alignment: ci === row.length - 1 && /^\d/.test(String(cell)) ? 'right' : 'left',
          border: [true, true, true, true],
        }))),
      ],
    },
    layout: tableLayout,
    margin: [0, 2, 0, 8],
  };
}

function textBox(text) {
  return {
    table: {
      widths: ['*'],
      body: [[{ text, fontSize: 10, color: TEXT, border: [true, true, true, true] }]],
    },
    layout: tableLayout,
    margin: [0, 2, 0, 8],
  };
}

function buildDocDef(data) {
  const content = [];

  const timeRange = [formatTime(data.header.startTime), formatTime(data.header.endTime)]
    .filter(Boolean).join(' \u2013 ');

  content.push(sectionHeader('Session Information'));
  content.push(kvTable([
    ['Student Name', data.header.studentName],
    ['Date', formatDateLong(data.header.date)],
    ['School', data.header.school],
    ['Time', timeRange],
    ['Observer', fmtObserver(data.header.observer, data.header.observerTitle)],
    ...(data.header.studentId ? [['Student ID', data.header.studentId]] : []),
  ]));

  const settingRows = [];
  if (hasContent(data.location)) settingRows.push(['Location', formatArrayAsLabels(data.location)]);
  if (hasContent(data.activity)) settingRows.push(['Activity', formatArrayAsLabels(data.activity)]);
  const taskStr = formatStudentTasks(data.studentTasks, data.studentTaskOther);
  if (taskStr) settingRows.push(['Student Task', taskStr]);
  if (data.studentEngagement) settingRows.push(['Student Engagement', ENGAGEMENT_LABELS[data.studentEngagement] || data.studentEngagement]);

  if (settingRows.length > 0 || hasContent(data.interventionNotes)) {
    content.push(sectionHeader('Setting / Activity'));
    if (settingRows.length > 0) content.push(kvTable(settingRows));
    if (hasContent(data.interventionNotes))
      content.push({ text: data.interventionNotes, fontSize: 10, color: TEXT, margin: [0, 2, 0, 8] });
  }

  const hasObsNote = hasContent(data.observationNote);
  const hasNarratives = data.narratives && data.narratives.length > 0;
  if (hasObsNote || hasNarratives) {
    content.push(sectionHeader('Observation Summary'));
    if (hasObsNote) content.push(textBox(data.observationNote));
    if (hasNarratives) {
      content.push(sectionHeader('Observation Narrative'));
      content.push(dataTable(
        ['Time', 'Narrative'],
        data.narratives.map(n => [formatTime(n.time), n.text])
      ));
    }
  }

  const hasDataCollection =
    data.dataCollection.dataCurrent !== null ||
    data.dataCollection.pastFormsAvailable !== null ||
    hasContent(data.dataCollectionNotes);
  if (hasDataCollection) {
    content.push(sectionHeader('Data Collection Status'));
    const dcRows = [];
    if (data.dataCollection.dataCurrent !== null)
      dcRows.push(['Data is Current', formatYesNo(data.dataCollection.dataCurrent)]);
    if (data.dataCollection.pastFormsAvailable !== null)
      dcRows.push(['Past Data Forms Available', formatYesNo(data.dataCollection.pastFormsAvailable)]);
    if (dcRows.length > 0) content.push(kvTable(dcRows));
    if (hasContent(data.dataCollectionNotes))
      content.push({ text: data.dataCollectionNotes, fontSize: 10, color: TEXT, margin: [0, 2, 0, 8] });
  }

  const checkedSupports = data.supports || [];
  if (checkedSupports.length > 0 || hasContent(data.supportsNotes)) {
    content.push(sectionHeader('Supports Present'));
    if (checkedSupports.length > 0) {
      const items = checkedSupports.map(key => {
        let label = SUPPORTS_LABELS[key] || formatCamelCase(key);
        if (key === 'other' && data.supportsOther) label = `Other: ${data.supportsOther}`;
        return label;
      });
      content.push(textBox(items.join('  \u2022  ')));
    }
    if (hasContent(data.supportsNotes))
      content.push({ text: data.supportsNotes, fontSize: 10, color: TEXT, margin: [0, 2, 0, 8] });
  }

  const hasBIP = data.bip.hasBIP !== null || hasContent(data.bipNotes);
  if (hasBIP) {
    content.push(sectionHeader('Implementation of the BIP'));
    const bipRows = [];
    if (data.bip.hasBIP !== null) bipRows.push(['Student Has a BIP', formatYesNo(data.bip.hasBIP)]);
    if (data.bip.hasBIP === true) {
      bipRows.push(
        ['Teaching/Practice of Replacement Behaviors', formatYesNo(data.bip.teachingReplacement)],
        ['Reinforcement of Replacement Behaviors', formatYesNo(data.bip.reinforcementReplacement)],
        ['Reinforcement Delivered as Outlined', formatYesNo(data.bip.reinforcementAsOutlined)],
        ['Prompting of Replacement Behaviors', formatYesNo(data.bip.promptingReplacement)],
      );
    }
    if (bipRows.length > 0) content.push(kvTable(bipRows));
    if (hasContent(data.bipNotes))
      content.push({ text: data.bipNotes, fontSize: 10, color: TEXT, margin: [0, 2, 0, 8] });
  }

  content.push(sectionHeader('Duration Data'));
  content.push(dataTable(
    ['Behavior', 'Total Duration', 'Instances'],
    [
      ['Crisis',   formatTotalDuration(data.durationData.crisis.totalSeconds),  String(data.durationData.crisis.instances)],
      ['On Task',  formatTotalDuration(data.durationData.onTask.totalSeconds),  String(data.durationData.onTask.instances)],
      ['Off Task', formatTotalDuration(data.durationData.offTask.totalSeconds), String(data.durationData.offTask.instances)],
    ]
  ));

  const requestHelp = data.requestHelp || { successes: 0, attempts: 0 };
  const compliance  = data.compliance  || { successes: 0, attempts: 0 };
  const transitions = data.transitions || { successes: 0, attempts: 0 };

  const freqRows = [
    ...Object.entries(data.behaviorCounts)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => [formatCamelCase(k), String(v)]),
    ['Transitions',  pct(transitions.successes,  transitions.attempts)],
    ['Request Help', pct(requestHelp.successes,   requestHelp.attempts)],
    ['Compliance',   pct(compliance.successes,    compliance.attempts)],
  ];
  content.push(sectionHeader('Frequency Data'));
  content.push(dataTable(['Behavior', 'Count'], freqRows));

  content.push(sectionHeader('ABC Data'));
  if (data.abcEntries && data.abcEntries.length > 0) {
    content.push(dataTable(
      ['Time', 'Antecedent', 'Behavior', 'Consequence'],
      data.abcEntries.map(e => [formatTime(e.time), e.antecedent, e.behavior, e.consequence])
    ));
  } else {
    content.push({ text: 'No ABC entries recorded.', italics: true, color: MUTED, fontSize: 10, margin: [0, 2, 0, 8] });
  }

  const checkedRecs = Object.entries(data.recommendations || {}).filter(([, v]) => v.checked);
  if (checkedRecs.length > 0) {
    content.push(sectionHeader('Recommendations'));
    content.push({
      ul: checkedRecs.map(([key, value]) => ({
        text: value.note ? `${formatCamelCase(key)}: ${value.note}` : formatCamelCase(key),
        fontSize: 10,
        color: TEXT,
      })),
      margin: [0, 2, 0, 8],
    });
  }

  const hasNextSteps = (data.nextSteps && data.nextSteps.length > 0) || hasContent(data.methodOfFollowUp);
  if (hasNextSteps) {
    content.push(sectionHeader('Next Steps'));
    if (data.nextSteps && data.nextSteps.length > 0) {
      content.push({
        ul: data.nextSteps.map(step => ({ text: formatCamelCase(step), fontSize: 10, color: TEXT })),
        margin: [0, 2, 0, 4],
      });
    }
    if (hasContent(data.methodOfFollowUp)) {
      content.push({
        text: [{ text: 'Method of Follow-Up: ', bold: true }, data.methodOfFollowUp],
        fontSize: 10,
        color: TEXT,
        margin: [0, 4, 0, 8],
      });
    }
  }

  return {
    pageSize: 'LETTER',
    pageMargins: [54, 90, 54, 60],
    header: () => ({
      stack: [
        {
          text: 'CONFIDENTIAL BEHAVIORAL DOCUMENTATION',
          alignment: 'center',
          fontSize: 8,
          color: MUTED,
          bold: true,
          margin: [54, 12, 54, 2],
        },
        {
          text: 'Behavioral Observation Report',
          alignment: 'center',
          fontSize: 16,
          bold: true,
          color: TEXT,
          margin: [54, 0, 54, 6],
        },
        {
          canvas: [{ type: 'line', x1: 54, y1: 0, x2: 558, y2: 0, lineWidth: 0.5, lineColor: BORDER }],
        },
      ],
    }),
    footer: (currentPage, pageCount) => ({
      columns: [
        {
          text: 'This document contains confidential student information protected under FERPA.',
          fontSize: 8,
          color: MUTED,
          margin: [54, 8, 10, 0],
        },
        {
          text: `Page ${currentPage} of ${pageCount}`,
          alignment: 'right',
          fontSize: 8,
          color: MUTED,
          margin: [10, 8, 54, 0],
        },
      ],
    }),
    content,
    defaultStyle: { fontSize: 10, color: TEXT },
  };
}

export async function generatePdf(data) {
  return buildDocDef(data);
}

export async function downloadPdf(data) {
  const docDef = buildDocDef(data);
  const initials = data.header.studentName
    ? data.header.studentName.split(' ').map(w => w[0].toUpperCase()).join('')
    : 'OBS';
  const dateStr = data.header.date
    ? (() => { const [y, m, d] = data.header.date.split('-'); return `${parseInt(m)}.${parseInt(d)}.${y.slice(-2)}`; })()
    : '';
  pdfMake.createPdf(docDef).download(`Behavioral Observation Report ${initials} ${dateStr}.pdf`);
}
