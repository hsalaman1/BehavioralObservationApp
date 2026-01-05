import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, WidthType, BorderStyle, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { formatTotalDuration } from '../../hooks/useTimestamp';

export async function generateDocx(data) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: 'Behavioral Observation Report',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: '' }),

          // Session Information
          new Paragraph({
            text: 'Session Information',
            heading: HeadingLevel.HEADING_2,
          }),
          createInfoTable([
            ['Student Name', data.header.studentName],
            ['Student ID', data.header.studentId || 'N/A'],
            ['School', data.header.school],
            ['Date', data.header.date],
            ['Observer', data.header.observer],
            ['Time', `${data.header.startTime} - ${data.header.endTime}`],
            ['RBT Present', data.header.rbtPresent || 'N/A'],
            data.header.rbtName ? ['RBT Name', data.header.rbtName] : null,
          ].filter(Boolean)),
          new Paragraph({ text: '' }),

          // Location & Activity
          new Paragraph({
            text: 'Location & Activity',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ text: `Location: ${data.location.join(', ') || 'N/A'}` }),
          new Paragraph({ text: `Activity: ${data.activity.join(', ') || 'N/A'}` }),
          new Paragraph({ text: '' }),

          // Duration Data
          new Paragraph({
            text: 'Duration Data',
            heading: HeadingLevel.HEADING_2,
          }),
          createDataTable(
            ['Behavior', 'Total Duration', 'Instances'],
            [
              ['Crisis', formatTotalDuration(data.durationData.crisis.totalSeconds), String(data.durationData.crisis.instances)],
              ['On Task', formatTotalDuration(data.durationData.onTask.totalSeconds), String(data.durationData.onTask.instances)],
              ['Off Task', formatTotalDuration(data.durationData.offTask.totalSeconds), String(data.durationData.offTask.instances)],
            ]
          ),
          new Paragraph({ text: '' }),

          // Frequency Data
          new Paragraph({
            text: 'Frequency Data',
            heading: HeadingLevel.HEADING_2,
          }),
          createDataTable(
            ['Behavior', 'Count'],
            [
              ...Object.entries(data.behaviorCounts).map(([key, value]) => [
                key.replace(/([A-Z])/g, ' $1').trim(),
                String(value),
              ]),
              [
                'Transitions',
                `${data.transitions.successes}/${data.transitions.attempts} (${
                  data.transitions.attempts > 0
                    ? Math.round((data.transitions.successes / data.transitions.attempts) * 100)
                    : 0
                }%)`,
              ],
            ]
          ),
          new Paragraph({ text: '' }),

          // Narrative Log
          new Paragraph({
            text: 'Narrative Log',
            heading: HeadingLevel.HEADING_2,
          }),
          ...(data.narratives.length > 0
            ? [
                createDataTable(
                  ['Time', 'Narrative'],
                  data.narratives.map((n) => [n.time, n.text])
                ),
              ]
            : [new Paragraph({ text: 'No narrative entries recorded.' })]),
          new Paragraph({ text: '' }),

          // ABC Data
          new Paragraph({
            text: 'ABC Data',
            heading: HeadingLevel.HEADING_2,
          }),
          ...(data.abcEntries.length > 0
            ? [
                createDataTable(
                  ['Time', 'Antecedent', 'Behavior', 'Consequence'],
                  data.abcEntries.map((e) => [e.time, e.antecedent, e.behavior, e.consequence])
                ),
              ]
            : [new Paragraph({ text: 'No ABC entries recorded.' })]),
          new Paragraph({ text: '' }),

          // Recommendations
          new Paragraph({
            text: 'Recommendations',
            heading: HeadingLevel.HEADING_2,
          }),
          ...Object.entries(data.recommendations)
            .filter(([, value]) => value.checked)
            .map(
              ([key, value]) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: '• ', bold: true }),
                    new TextRun({
                      text: key.replace(/([A-Z])/g, ' $1').trim(),
                    }),
                    value.note ? new TextRun({ text: `: ${value.note}` }) : null,
                  ].filter(Boolean),
                })
            ),
          new Paragraph({ text: '' }),

          // Next Steps
          new Paragraph({
            text: 'Next Steps',
            heading: HeadingLevel.HEADING_2,
          }),
          ...data.nextSteps.map(
            (step) =>
              new Paragraph({
                children: [
                  new TextRun({ text: '• ' }),
                  new TextRun({
                    text: step.replace(/([A-Z])/g, ' $1').trim(),
                  }),
                ],
              })
          ),
          new Paragraph({ text: '' }),

          // Signature
          new Paragraph({
            text: `Behavior Analyst: ${data.behaviorAnalyst}`,
          }),
        ],
      },
    ],
  });

  return doc;
}

function createInfoTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map(
      ([label, value]) =>
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: label, bold: true })] })],
              width: { size: 30, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ text: value || '' })],
              width: { size: 70, type: WidthType.PERCENTAGE },
            }),
          ],
        })
    ),
  });
}

function createDataTable(headers, rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: headers.map(
          (header) =>
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: header, bold: true })] })],
              shading: { fill: 'E0E0E0' },
            })
        ),
      }),
      ...rows.map(
        (row) =>
          new TableRow({
            children: row.map(
              (cell) =>
                new TableCell({
                  children: [new Paragraph({ text: cell || '' })],
                })
            ),
          })
      ),
    ],
  });
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

export async function downloadDocx(data) {
  const doc = await generateDocx(data);
  const blob = await Packer.toBlob(doc);
  const initials = getInitials(data.header.studentName);
  const dateFormatted = formatDateForFilename(data.header.date);
  saveAs(blob, `Behavioral Observation Report ${initials} ${dateFormatted}.docx`);
}
