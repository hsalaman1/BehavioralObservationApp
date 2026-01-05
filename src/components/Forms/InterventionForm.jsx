import { RadioGroup } from '../UI/RadioGroup';
import { TextArea } from '../UI/TextArea';

const STUDENT_TASK_OPTIONS = [
  { value: 'wholeGroup', label: 'Whole Group Instruction' },
  { value: 'smallGroup', label: 'Small Group Instruction' },
  { value: 'independent', label: 'Independent Work' },
  { value: 'other', label: 'Other' }
];

const ENGAGEMENT_OPTIONS = [
  { value: 'engaged', label: 'Engaged with appropriate activity' },
  { value: 'notEngaged', label: 'Not engaged with appropriate activity' }
];

export function InterventionForm({ data, onChange }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
        Intervention Implementation
      </h2>

      {/* Student Task */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Student Task</h3>
        <RadioGroup
          name="studentTask"
          options={STUDENT_TASK_OPTIONS}
          value={data.studentTask}
          onChange={(value) => onChange('studentTask', value)}
          className="flex-col gap-2"
        />
        {data.studentTask === 'other' && (
          <input
            type="text"
            value={data.studentTaskOther || ''}
            onChange={(e) => onChange('studentTaskOther', e.target.value)}
            placeholder="Specify other..."
            className="mt-2 border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        )}
      </div>

      {/* Student Engagement */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Student Engagement</h3>
        <RadioGroup
          name="studentEngagement"
          options={ENGAGEMENT_OPTIONS}
          value={data.studentEngagement}
          onChange={(value) => onChange('studentEngagement', value)}
          className="flex-col gap-2"
        />
      </div>

      {/* Notes */}
      <TextArea
        label="Notes"
        value={data.interventionNotes}
        onChange={(value) => onChange('interventionNotes', value)}
        placeholder="Add notes about intervention implementation..."
        autoExpand
        minRows={3}
      />
    </div>
  );
}
