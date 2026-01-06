import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, WidthType, BorderStyle, AlignmentType } from 'docx';
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

export async function generateDocx(data) {
  const sections = [];

  // Title
  sections.push(
    new Paragraph({
      text: 'Behavioral Observation Report',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({ text: '' })
  );

  // Session Information
  sections.push(
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
      ['RBT Present', data.header.rbtPresent === 'yes' ? 'Yes' : data.header.rbtPresent === 'no' ? 'No' : data.header.rbtPresent === 'na' ? 'N/A' : 'N/A'],
      data.header.rbtName ? ['RBT Name', data.header.rbtName] : null,
    ].filter(Boolean)),
    new Paragraph({ text: '' })
  );

  // Setting / Activity (combined with activity data)
  const studentTasks = data.studentTasks || [];

  sections.push(
    new Paragraph({
      text: 'Setting / Activity',
      heading: HeadingLevel.HEADING_2,
    }),
    new Paragraph({ text: `Location: ${formatArrayAsLabels(data.location) || 'N/A'}` }),
    new Paragraph({ text: `Activity: ${formatArrayAsLabels(data.activity) || 'N/A'}` })
  );

  // Add student task and engagement if present
  if (studentTasks.length > 0) {
    sections.push(
      new Paragraph({ text: `Student Task: ${formatStudentTasks(studentTasks, data.studentTaskOther)}` })
    );
  }
  if (data.studentEngagement) {
    sections.push(
      new Paragraph({ text: `Student Engagement: ${ENGAGEMENT_LABELS[data.studentEngagement] || data.studentEngagement}` })
    );
  }
  if (hasContent(data.interventionNotes)) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Activity Notes: ', bold: true }),
          new TextRun({ text: data.interventionNotes })
        ]
      })
    );
  }
  sections.push(new Paragraph({ text: '' }));

  // Observation Note (combines general note and narrative log)
  const hasObservationNote = hasContent(data.observationNote) || data.narratives.length > 0;
  if (hasObservationNote) {
    sections.push(
      new Paragraph({
        text: 'Observation Note',
        heading: HeadingLevel.HEADING_2,
      })
    );

    // General observation note (paragraph)
    if (hasContent(data.observationNote)) {
      sections.push(
        new Paragraph({ text: data.observationNote }),
        new Paragraph({ text: '' })
      );
    }

    // Timestamped narrative log (table)
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
    sections.push(
      new Paragraph({
        text: 'Data Collection Status',
        heading: HeadingLevel.HEADING_2,
      })
    );

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
            new TextRun({ text: 'Notes: ', bold: true }),
            new TextRun({ text: data.dataCollectionNotes })
          ]
        })
      );
    }
    sections.push(new Paragraph({ text: '' }));
  }

  // Supports Present in Setting
  const hasSupportsContent = data.supports.length > 0 || hasContent(data.supportsNotes);
  if (hasSupportsContent) {
    sections.push(
      new Paragraph({
        text: 'Supports Present in Setting',
        heading: HeadingLevel.HEADING_2,
      })
    );

    if (data.supports.length > 0) {
      // Create a table showing each support item with checkmark
      const supportsTableRows = [];
      Object.entries(SUPPORTS_LABELS).forEach(([key, label]) => {
        const isChecked = data.supports.includes(key);
        let displayLabel = label;
        if (key === 'other' && isChecked && data.supportsOther) {
          displayLabel = `Other: ${data.supportsOther}`;
        }
        supportsTableRows.push([displayLabel, isChecked ? '✓' : '']);
      });
      sections.push(createChecklistTable(supportsTableRows));
    }

    if (hasContent(data.supportsNotes)) {
      sections.push(
        new Paragraph({ text: '' }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Notes: ', bold: true }),
            new TextRun({ text: data.supportsNotes })
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
    sections.push(
      new Paragraph({
        text: 'Implementation of the BIP',
        heading: HeadingLevel.HEADING_2,
      })
    );

    if (data.bip.hasBIP !== null) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Student has a BIP: ', bold: true }),
            new TextRun({ text: formatYesNo(data.bip.hasBIP) })
          ]
        })
      );

      // If student has BIP, show the implementation details
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
            new TextRun({ text: 'Notes: ', bold: true }),
            new TextRun({ text: data.bipNotes })
          ]
        })
      );
    }
    sections.push(new Paragraph({ text: '' }));
  }

  // Duration Data
  sections.push(
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
    new Paragraph({ text: '' })
  );

  // Frequency Data
  const requestHelp = data.requestHelp || { successes: 0, attempts: 0 };
  const compliance = data.compliance || { successes: 0, attempts: 0 };

  sections.push(
    new Paragraph({
      text: 'Frequency Data',
      heading: HeadingLevel.HEADING_2,
    }),
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
  sections.push(
    new Paragraph({
      text: 'ABC Data',
      heading: HeadingLevel.HEADING_2,
    })
  );
  if (data.abcEntries.length > 0) {
    sections.push(
      createDataTable(
        ['Time', 'Antecedent', 'Behavior', 'Consequence'],
        data.abcEntries.map((e) => [e.time, e.antecedent, e.behavior, e.consequence])
      )
    );
  } else {
    sections.push(new Paragraph({ text: 'No ABC entries recorded.' }));
  }
  sections.push(new Paragraph({ text: '' }));

  // Recommendations
  const checkedRecommendations = Object.entries(data.recommendations).filter(([, value]) => value.checked);
  if (checkedRecommendations.length > 0) {
    sections.push(
      new Paragraph({
        text: 'Recommendations',
        heading: HeadingLevel.HEADING_2,
      })
    );
    checkedRecommendations.forEach(([key, value]) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: '• ', bold: true }),
            new TextRun({ text: formatCamelCase(key) }),
            value.note ? new TextRun({ text: `: ${value.note}` }) : null,
          ].filter(Boolean),
        })
      );
    });
    sections.push(new Paragraph({ text: '' }));
  }

  // Next Steps
  const hasNextSteps = data.nextSteps.length > 0 || hasContent(data.methodOfFollowUp);
  if (hasNextSteps) {
    sections.push(
      new Paragraph({
        text: 'Next Steps',
        heading: HeadingLevel.HEADING_2,
      })
    );

    data.nextSteps.forEach((step) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: '• ' }),
            new TextRun({ text: formatCamelCase(step) }),
          ],
        })
      );
    });

    // Method of Follow-Up
    if (hasContent(data.methodOfFollowUp)) {
      sections.push(
        new Paragraph({ text: '' }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Method of Follow-Up: ', bold: true }),
            new TextRun({ text: data.methodOfFollowUp })
          ]
        })
      );
    }

    sections.push(new Paragraph({ text: '' }));
  }

  // Signature
  sections.push(
    new Paragraph({
      text: `Behavior Analyst: ${data.behaviorAnalyst}`,
    })
  );

  const doc = new Document({
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

function createChecklistTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Support', bold: true })] })],
            shading: { fill: 'E0E0E0' },
            width: { size: 80, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Present', bold: true })] })],
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
                children: [new Paragraph({ text: label })],
              }),
              new TableCell({
                children: [new Paragraph({ text: checked, alignment: AlignmentType.CENTER })],
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
