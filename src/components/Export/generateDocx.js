import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, BorderStyle, AlignmentType, ShadingType,
  Header, Footer, PageNumber, TabStopType
} from 'docx';
import { saveAs } from 'file-saver';
import { formatTotalDuration } from '../../hooks/useTimestamp';

const FONT = 'Arial';
const BLUE = '2B579A';
const HEADER_BG = 'E8EEF4';
const ZEBRA = 'F5F5F5';
const BORDER_COLOR = 'D0D0D0';
const TEXT = '333333';
const MUTED = '666666';
const WHITE = 'FFFFFF';
const BODY_SIZE = 20;
const SMALL_SIZE = 18;
const TITLE_SIZE = 32;

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

const BD = {
  top:    { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
  left:   { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
  right:  { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
};

const NO_BD = {
  top:    { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left:   { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right:  { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};

function tr(text, opts = {}) {
  return new TextRun({ text: String(text ?? ''), font: FONT, size: BODY_SIZE, color: TEXT, ...opts });
}

const sp = () => new Paragraph({ children: [], spacing: { before: 0, after: 80 } });

function sectionHeader(title) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({
      children: [new TableCell({
        children: [new Paragraph({
          children: [new TextRun({
            text: title.toUpperCase(),
            bold: true, font: FONT, size: BODY_SIZE, color: BLUE,
          })],
          spacing: { before: 0, after: 0 },
        })],
        shading: { type: ShadingType.CLEAR, color: 'auto', fill: HEADER_BG },
        borders: BD,
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
      })],
    })],
  });
}

function kvTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map(([label, value]) => new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [tr(label, { bold: true, color: MUTED, size: SMALL_SIZE })] })],
          width: { size: 30, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, color: 'auto', fill: HEADER_BG },
          borders: BD,
          margins: { top: 60, bottom: 60, left: 100, right: 100 },
        }),
        new TableCell({
          children: [new Paragraph({
            children: [tr(value || 'Not specified', !value ? { italics: true, color: MUTED } : {})],
          })],
          width: { size: 70, type: WidthType.PERCENTAGE },
          borders: BD,
          margins: { top: 60, bottom: 60, left: 100, right: 100 },
        }),
      ],
    })),
  });
}

function dataTable(headers, rows) {
  const headerRow = new TableRow({
    children: headers.map(h => new TableCell({
      children: [new Paragraph({ children: [tr(h, { bold: true, size: SMALL_SIZE })] })],
      shading: { type: ShadingType.CLEAR, color: 'auto', fill: HEADER_BG },
      borders: BD,
      margins: { top: 40, bottom: 40, left: 80, right: 80 },
    })),
  });

  const dataRows = rows.map((row, i) => new TableRow({
    children: row.map((cell, ci) => new TableCell({
      children: [new Paragraph({
        children: [tr(cell ?? '')],
        alignment: ci === row.length - 1 && /^\d/.test(String(cell)) ? AlignmentType.RIGHT : AlignmentType.LEFT,
      })],
      shading: { type: ShadingType.CLEAR, color: 'auto', fill: i % 2 === 0 ? WHITE : ZEBRA },
      borders: BD,
      margins: { top: 40, bottom: 40, left: 80, right: 80 },
    })),
  }));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
  });
}

function makeHeader() {
  return new Header({
    children: [
      new Paragraph({
        children: [tr('CONFIDENTIAL BEHAVIORAL DOCUMENTATION', { size: 16, color: MUTED, bold: true })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 40 },
      }),
      new Paragraph({
        children: [tr('Behavioral Observation Report', { size: TITLE_SIZE, bold: true })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR } },
      }),
    ],
  });
}

function makeFooter() {
  return new Footer({
    children: [
      new Paragraph({
        children: [
          tr('This document contains confidential student information protected under FERPA.', { size: 16, color: MUTED }),
          new TextRun({ text: '\t', font: FONT }),
          tr('Page ', { size: 16, color: MUTED }),
          new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: MUTED }),
          tr(' of ', { size: 16, color: MUTED }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 16, color: MUTED }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: 9000 }],
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR } },
        spacing: { before: 80 },
      }),
    ],
  });
}

export async function generateDocx(data) {
  const children = [];

  const timeRange = [formatTime(data.header.startTime), formatTime(data.header.endTime)]
    .filter(Boolean).join(' – ');

  children.push(
    sectionHeader('Session Information'),
    kvTable([
      ['Student Name', data.header.studentName],
      ['Date', formatDateLong(data.header.date)],
      ['School', data.header.school],
      ['Time', timeRange],
      ['Observer', fmtObserver(data.header.observer, data.header.observerTitle)],
      ...(data.header.studentId ? [['Student ID', data.header.studentId]] : []),
    ]),
    sp()
  );

  const settingRows = [];
  if (hasContent(data.location)) settingRows.push(['Location', formatArrayAsLabels(data.location)]);
  if (hasContent(data.activity)) settingRows.push(['Activity', formatArrayAsLabels(data.activity)]);
  const taskStr = formatStudentTasks(data.studentTasks, data.studentTaskOther);
  if (taskStr) settingRows.push(['Student Task', taskStr]);
  if (data.studentEngagement) settingRows.push(['Student Engagement', ENGAGEMENT_LABELS[data.studentEngagement] || data.studentEngagement]);

  if (settingRows.length > 0 || hasContent(data.interventionNotes)) {
    children.push(sectionHeader('Setting / Activity'));
    if (settingRows.length > 0) children.push(kvTable(settingRows));
    if (hasContent(data.interventionNotes)) {
      children.push(sp(), new Paragraph({ children: [tr(data.interventionNotes)] }));
    }
    children.push(sp());
  }

  const hasObsNote = hasContent(data.observationNote);
  const hasNarratives = data.narratives && data.narratives.length > 0;

  if (hasObsNote || hasNarratives) {
    children.push(sectionHeader('Observation Summary'));
    if (hasObsNote) {
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [new TableRow({
            children: [new TableCell({
              children: [new Paragraph({ children: [tr(data.observationNote)] })],
              borders: BD,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
            })],
          })],
        }),
        sp()
      );
    }
    if (hasNarratives) {
      children.push(
        sectionHeader('Observation Narrative'),
        dataTable(
          ['Time', 'Narrative'],
          data.narratives.map(n => [formatTime(n.time), n.text])
        )
      );
    }
    children.push(sp());
  }

  const hasDataCollection =
    data.dataCollection.dataCurrent !== null ||
    data.dataCollection.pastFormsAvailable !== null ||
    hasContent(data.dataCollectionNotes);

  if (hasDataCollection) {
    children.push(sectionHeader('Data Collection Status'));
    const dcRows = [];
    if (data.dataCollection.dataCurrent !== null)
      dcRows.push(['Data is Current', formatYesNo(data.dataCollection.dataCurrent)]);
    if (data.dataCollection.pastFormsAvailable !== null)
      dcRows.push(['Past Data Forms Available', formatYesNo(data.dataCollection.pastFormsAvailable)]);
    if (dcRows.length > 0) children.push(kvTable(dcRows));
    if (hasContent(data.dataCollectionNotes))
      children.push(sp(), new Paragraph({ children: [tr(data.dataCollectionNotes)] }));
    children.push(sp());
  }

  const checkedSupports = data.supports || [];
  if (checkedSupports.length > 0 || hasContent(data.supportsNotes)) {
    children.push(sectionHeader('Supports Present'));
    if (checkedSupports.length > 0) {
      const supportItems = checkedSupports.map(key => {
        let label = SUPPORTS_LABELS[key] || formatCamelCase(key);
        if (key === 'other' && data.supportsOther) label = `Other: ${data.supportsOther}`;
        return label;
      });
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [new TableRow({
            children: [new TableCell({
              children: [new Paragraph({ children: [tr(supportItems.join('  •  '))] })],
              borders: BD,
              margins: { top: 60, bottom: 60, left: 100, right: 100 },
            })],
          })],
        })
      );
    }
    if (hasContent(data.supportsNotes))
      children.push(sp(), new Paragraph({ children: [tr(data.supportsNotes)] }));
    children.push(sp());
  }

  const hasBIP = data.bip.hasBIP !== null || hasContent(data.bipNotes);
  if (hasBIP) {
    children.push(sectionHeader('Implementation of the BIP'));
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
    if (bipRows.length > 0) children.push(kvTable(bipRows));
    if (hasContent(data.bipNotes))
      children.push(sp(), new Paragraph({ children: [tr(data.bipNotes)] }));
    children.push(sp());
  }

  children.push(
    sectionHeader('Duration Data'),
    dataTable(
      ['Behavior', 'Total Duration', 'Instances'],
      [
        ['Crisis',   formatTotalDuration(data.durationData.crisis.totalSeconds),  String(data.durationData.crisis.instances)],
        ['On Task',  formatTotalDuration(data.durationData.onTask.totalSeconds),  String(data.durationData.onTask.instances)],
        ['Off Task', formatTotalDuration(data.durationData.offTask.totalSeconds), String(data.durationData.offTask.instances)],
      ]
    ),
    sp()
  );

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

  children.push(
    sectionHeader('Frequency Data'),
    dataTable(['Behavior', 'Count'], freqRows),
    sp()
  );

  children.push(sectionHeader('ABC Data'));
  if (data.abcEntries && data.abcEntries.length > 0) {
    children.push(
      dataTable(
        ['Time', 'Antecedent', 'Behavior', 'Consequence'],
        data.abcEntries.map(e => [formatTime(e.time), e.antecedent, e.behavior, e.consequence])
      )
    );
  } else {
    children.push(new Paragraph({ children: [tr('No ABC entries recorded.', { italics: true, color: MUTED })] }));
  }
  children.push(sp());

  const checkedRecs = Object.entries(data.recommendations || {}).filter(([, v]) => v.checked);
  if (checkedRecs.length > 0) {
    children.push(sectionHeader('Recommendations'));
    checkedRecs.forEach(([key, value]) => {
      children.push(new Paragraph({
        children: [
          tr('\u2022 ', { bold: true }),
          tr(formatCamelCase(key)),
          ...(value.note ? [tr(`: ${value.note}`)] : []),
        ],
        spacing: { before: 40, after: 40 },
      }));
    });
    children.push(sp());
  }

  const hasNextSteps = (data.nextSteps && data.nextSteps.length > 0) || hasContent(data.methodOfFollowUp);
  if (hasNextSteps) {
    children.push(sectionHeader('Next Steps'));
    (data.nextSteps || []).forEach(step => {
      children.push(new Paragraph({
        children: [tr('\u2022 ', { bold: true }), tr(formatCamelCase(step))],
        spacing: { before: 40, after: 40 },
      }));
    });
    if (hasContent(data.methodOfFollowUp)) {
      children.push(
        sp(),
        new Paragraph({ children: [tr('Method of Follow-Up: ', { bold: true }), tr(data.methodOfFollowUp)] })
      );
    }
    children.push(sp());
  }

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: FONT, size: BODY_SIZE, color: TEXT } },
      },
    },
    sections: [{
      headers: { default: makeHeader() },
      footers: { default: makeFooter() },
      properties: {
        page: {
          margin: { top: 1440, bottom: 1080, left: 1080, right: 1080 },
        },
      },
      children,
    }],
  });

  return doc;
}

function getInitials(name) {
  if (!name) return 'OBS';
  return name.split(' ').map(w => w.charAt(0).toUpperCase()).join('');
}

function formatDateForFilename(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${parseInt(month)}.${parseInt(day)}.${year.slice(-2)}`;
}

export async function downloadDocx(data) {
  const doc = await generateDocx(data);
  const blob = await Packer.toBlob(doc);
  const initials = getInitials(data.header.studentName);
  const dateStr = formatDateForFilename(data.header.date);
  saveAs(blob, `Behavioral Observation Report ${initials} ${dateStr}.docx`);
}
