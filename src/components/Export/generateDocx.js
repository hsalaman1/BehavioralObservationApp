import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, BorderStyle, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { formatTotalDuration } from '../../hooks/useTimestamp';

// Label mappings for student task
const STUDENT_TASK_LABELS = {
  wholeGroup: 'Whole Group Instruction',
  smallGroup: 'Small Group Instruction',
  independent: 'Independent Work',
  other: 'Other'
};

// Label mappings for student engagement
const ENGAGEMENT_LABELS = {
  engaged: 'Engaged with appropriate activity',
  notEngaged: 'Not engaged with appropriate activity'
};

// Label mappings for supports
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

// Helper to format boolean values
function formatYesNo(value) {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return 'N/A';
}

// Helper to check if a section has content
function hasContent(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') {
    return Object.values(value).some(v => hasContent(v));
  }
  return true;
}

// Helper to format student tasks array
function formatStudentTasks(tasks, otherText) {
  if (!tasks || tasks.length === 0) return '';
  return tasks.map(task => {
    if (task === 'other' && otherText) {
      return `Other: ${otherText}`;
    }
    return STUDENT_TASK_LABELS[task] || task;
  }).join(', ');
}

// Creates the document title paragraph (centered, black, with bottom rule)
function createDocTitle(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Times New Roman', size: 32, color: '000000' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 160 },
    border: { bottom: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 } }
  });
}

// Creates a section heading paragraph (left-aligned, black, with bottom rule)
function createSectionHeading(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Times New Roman', size: 28, color: '000000' })],
    spacing: { before: 240, after: 120 },
    border: { bottom: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 } }
  });
}

export async function generateDocx(data) {
  const sections = [];

  // Title
  sections.push(
    createDocTitle('Behavioral Observation Report'),
    new Paragraph({ text: '' })
  );

  // Session Information
  sections.push(
    createSectionHeading('Session Information'),
    createInfoTable([
      ['Student Name', data.header.studentName],
      ['Student ID', data.header.studentId || 'N/A'],
      ['School', data.header.school],
      ['Date', data.header.date],
      ['Observer', data.header.observer],
      data.header.observerTitle ? ['Observer Title', data.header.observerTitle] : null,
      ['Time', `${data.header.startTime} - ${data.header.endTime}`],
      ['RBT Present', data.header.rbtPresent === 'yes' ? 'Yes' : data.header.rbtPresent === 'no' ? 'No' : data.header.rbtPresent === 'na' ? 'N/A' : 'N/A'],
      data.header.rbtName ? ['RBT Name', data.header.rbtName] : null,
    ].filter(Boolean)),
    new Paragraph({ text: '' })
  );

  // Setting / Activity
  const studentTasks = data.studentTasks || [];

  sections.push(
    createSectionHeading('Setting / Activity'),
    new Paragraph({
      children: [new TextRun({ text: `Location: ${formatArrayAsLabels(data.location) || 'N/A'}`, font: 'Times New Roman', size: 22, color: '000000' })]
    }),
    new Paragraph({
      children: [new TextRun({ text: `Activity: ${formatArrayAsLabels(data.activity) || 'N/A'}`, font: 'Times New Roman', size: 22, color: '000000' })]
    })
  );

  if (studentTasks.length > 0) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: `Student Task: ${formatStudentTasks(studentTasks, data.studentTaskOther)}`, font: 'Times New Roman', size: 22, color: '000000' })]
      })
    );
  }
  if (data.studentEngagement) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: `Student Engagement: ${ENGAGEMENT_LABELS[data.studentEngagement] || data.studentEngagement}`, font: 'Times New Roman', size: 22, color: '000000' })]
      })
    );
  }
  if (hasContent(data.interventionNotes)) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Activity Notes: ', bold: true, font: 'Times New Roman', size: 22, color: '000000' }),
          new TextRun({ text: data.interventionNotes, font: 'Times New Roman', size: 22, color: '000000' })
        ]
      })
    );
  }
  sections.push(new Paragraph({ text: '' }));

  // Observation Note
  const hasObservationNote = hasContent(data.observationNote) || data.narratives.length > 0;
  if (hasObservationNote) {
    sections.push(createSectionHeading('Observation Note'));

    if (hasContent(data.observationNote)) {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: data.observationNote, font: 'Times New Roman', size: 22, color: '000000' })]
        }),
        new Paragraph({ text: '' })
      );
    }

    if (data.narratives.length > 0) {
      sections.push(
        createDataTable(
          ['Time', 'Narrative'],
          data.narratives.map((n) => [n.time, n.text])
        )
      );
    }
    sections.push(new Paragraph({ text: '' }));
  }

  // Data Collection Status
  const hasDataCollectionContent =
    data.dataCollection.dataCurrent !== null ||
    data.dataCollection.pastFormsAvailable !== null ||
    hasContent(data.dataCollectionNotes);

  if (hasDataCollectionContent) {
    sections.push(createSectionHeading('Data Collection Status'));

    const dataCollectionRows = [];
    if (data.dataCollection.dataCurrent !== null) {
      dataCollectionRows.push(['Data is current', formatYesNo(data.dataCollection.dataCurrent)]);
    }
    if (data.dataCollection.pastFormsAvailable !== null) {
      dataCollectionRows.push(['Past data forms are available', formatYesNo(data.dataCollection.pastFormsAvailable)]);
    }

    if (dataCollectionRows.length > 0) {
      sections.push(createInfoTable(dataCollectionRows));
    }

    if (hasContent(data.dataCollectionNotes)) {
      sections.push(
        new Paragraph({ text: '' }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Notes: ', bold: true, font: 'Times New Roman', size: 22, color: '000000' }),
            new TextRun({ text: data.dataCollectionNotes, font: 'Times New Roman', size: 22, color: '000000' })
          ]
        })
      );
    }
    sections.push(new Paragraph({ text: '' }));
  }

  // Supports Present in Setting
  const hasSupportsContent = data.supports.length > 0 || hasContent(data.supportsNotes);
  if (hasSupportsContent) {
    sections.push(createSectionHeading('Supports Present in Setting'));

    if (data.supports.length > 0) {
      const supportsTableRows = [];
      Object.entries(SUPPORTS_LABELS).forEach(([key, label]) => {
        const isChecked = data.supports.includes(key);
        let displayLabel = label;
        if (key === 'other' && isChecked && data.supportsOther) {
          displayLabel = `Other: ${data.supportsOther}`;
        }
        supportsTableRows.push([displayLabel, isChecked ? '\u2713' : '']);
      });
      sections.push(createChecklistTable(supportsTableRows));
    }

    if (hasContent(data.supportsNotes)) {
      sections.push(
        new Paragraph({ text: '' }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Notes: ', bold: true, font: 'Times New Roman', size: 22, color: '000000' }),
            new TextRun({ text: data.supportsNotes, font: 'Times New Roman', size: 22, color: '000000' })
          ]
        })
      );
    }
    sections.push(new Paragraph({ text: '' }));
  }

  // Implementation of the BIP
  const hasBIPContent =
    data.bip.hasBIP !== null ||
    hasContent(data.bipNotes);

  if (hasBIPContent) {
    sections.push(createSectionHeading('Implementation of the BIP'));

    if (data.bip.hasBIP !== null) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Student has a BIP: ', bold: true, font: 'Times New Roman', size: 22, color: '000000' }),
            new TextRun({ text: formatYesNo(data.bip.hasBIP), font: 'Times New Roman', size: 22, color: '000000' })
          ]
        })
      );

      if (data.bip.hasBIP === true) {
        sections.push(new Paragraph({ text: '' }));
        const bipRows = [
          ['Teaching/practice of replacement behaviors', formatYesNo(data.bip.teachingReplacement)],
          ['Reinforcement of replacement behaviors', formatYesNo(data.bip.reinforcementReplacement)],
          ['Reinforcement delivered as outlined in the BIP', formatYesNo(data.bip.reinforcementAsOutlined)],
          ['Prompting of replacement behaviors', formatYesNo(data.bip.promptingReplacement)],
        ];
        sections.push(createInfoTable(bipRows));
      }
    }

    if (hasContent(data.bipNotes)) {
      sections.push(
        new Paragraph({ text: '' }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Notes: ', bold: true, font: 'Times New Roman', size: 22, color: '000000' }),
            new TextRun({ text: data.bipNotes, font: 'Times New Roman', size: 22, color: '000000' })
          ]
        })
      );
    }
    sections.push(new Paragraph({ text: '' }));
  }

  // Duration Data
  sections.push(
    createSectionHeading('Duration Data'),
    createDataTable(
      ['Behavior', 'Total Duration', 'Instances'],
      [
        ['Crisis', formatTotalDuration(data.durationData.crisis.totalSeconds), String(data.durationData.crisis.instances)],
        ['On Task', formatTotalDuration(data.durationData.onTask.totalSeconds), String(data.durationData.onTask.instances)],
        ['Off Task', formatTotalDuration(data.durationData.offTask.totalSeconds), String(data.durationData.offTask.instances)],
      ]
    ),
    new Paragraph({ text: '' })
  );

  // Frequency Data
  const requestHelp = data.requestHelp || { successes: 0, attempts: 0 };
  const compliance = data.compliance || { successes: 0, attempts: 0 };

  sections.push(
    createSectionHeading('Frequency Data'),
    createDataTable(
      ['Behavior', 'Count'],
      [
        ...Object.entries(data.behaviorCounts).map(([key, value]) => [
          formatCamelCase(key),
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
        [
          'Request Help',
          `${requestHelp.successes}/${requestHelp.attempts} (${
            requestHelp.attempts > 0
              ? Math.round((requestHelp.successes / requestHelp.attempts) * 100)
              : 0
          }%)`,
        ],
        [
          'Compliance',
          `${compliance.successes}/${compliance.attempts} (${
            compliance.attempts > 0
              ? Math.round((compliance.successes / compliance.attempts) * 100)
              : 0
          }%)`,
        ],
      ]
    ),
    new Paragraph({ text: '' })
  );

  // ABC Data
  sections.push(createSectionHeading('ABC Data'));
  if (data.abcEntries.length > 0) {
    sections.push(
      createDataTable(
        ['Time', 'Antecedent', 'Behavior', 'Consequence'],
        data.abcEntries.map((e) => [e.time, e.antecedent, e.behavior, e.consequence])
      )
    );
  } else {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: 'No ABC entries recorded.', font: 'Times New Roman', size: 22, color: '000000' })]
      })
    );
  }
  sections.push(new Paragraph({ text: '' }));

  // Recommendations
  const checkedRecommendations = Object.entries(data.recommendations).filter(([, value]) => value.checked);
  if (checkedRecommendations.length > 0) {
    sections.push(createSectionHeading('Recommendations'));
    checkedRecommendations.forEach(([key, value]) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: '\u2022 ', bold: true, font: 'Times New Roman', size: 22, color: '000000' }),
            new TextRun({ text: formatCamelCase(key), font: 'Times New Roman', size: 22, color: '000000' }),
            value.note ? new TextRun({ text: `: ${value.note}`, font: 'Times New Roman', size: 22, color: '000000' }) : null,
          ].filter(Boolean),
        })
      );
    });
    sections.push(new Paragraph({ text: '' }));
  }

  // Next Steps
  const hasNextSteps = data.nextSteps.length > 0 || hasContent(data.methodOfFollowUp);
  if (hasNextSteps) {
    sections.push(createSectionHeading('Next Steps'));

    data.nextSteps.forEach((step) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: '\u2022 ', font: 'Times New Roman', size: 22, color: '000000' }),
            new TextRun({ text: formatCamelCase(step), font: 'Times New Roman', size: 22, color: '000000' }),
          ],
        })
      );
    });

    if (hasContent(data.methodOfFollowUp)) {
      sections.push(
        new Paragraph({ text: '' }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Method of Follow-Up: ', bold: true, font: 'Times New Roman', size: 22, color: '000000' }),
            new TextRun({ text: data.methodOfFollowUp, font: 'Times New Roman', size: 22, color: '000000' })
          ]
        })
      );
    }

    sections.push(new Paragraph({ text: '' }));
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Times New Roman', size: 22, color: '000000' }
        }
      }
    },
    sections: [
      {
        properties: {},
        children: sections,
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
              children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, font: 'Times New Roman', size: 22, color: '000000' })] })],
              width: { size: 30, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: value || '', font: 'Times New Roman', size: 22, color: '000000' })] })],
              width: { size: 70, type: WidthType.PERCENTAGE },
            }),
          ],
        })
    ),
  });
}

function createChecklistTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Support', bold: true, font: 'Times New Roman', size: 22, color: '000000' })] })],
            shading: { fill: 'E0E0E0' },
            width: { size: 80, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Present', bold: true, font: 'Times New Roman', size: 22, color: '000000' })] })],
            shading: { fill: 'E0E0E0' },
            width: { size: 20, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
      ...rows.map(
        ([label, checked]) =>
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: label, font: 'Times New Roman', size: 22, color: '000000' })] })],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: checked, font: 'Times New Roman', size: 22, color: '000000' })], alignment: AlignmentType.CENTER })],
              }),
            ],
          })
      ),
    ],
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
              children: [new Paragraph({ children: [new TextRun({ text: header, bold: true, font: 'Times New Roman', size: 22, color: '000000' })] })],
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
                  children: [new Paragraph({ children: [new TextRun({ text: cell || '', font: 'Times New Roman', size: 22, color: '000000' })] })],
                })
            ),
          })
      ),
    ],
  });
}

// Format camelCase to Title Case with spaces
function formatCamelCase(str) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

// Format array of camelCase values to readable labels
function formatArrayAsLabels(arr) {
  if (!arr || arr.length === 0) return '';
  return arr.map(item => formatCamelCase(item)).join(', ');
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
