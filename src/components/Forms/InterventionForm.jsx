import { Checkbox } from '../UI/Checkbox';
import { TextArea } from '../UI/TextArea';

const STUDENT_TASK_OPTIONS = [
  { id: 'wholeGroup', label: 'Whole Group Instruction' },
  { id: 'smallGroup', label: 'Small Group Instruction' },
  { id: 'independent', label: 'Independent Work' },
  { id: 'other', label: 'Other' }
];

const ENGAGEMENT_OPTIONS = [
  { value: 'engaged', label: 'Engaged with appropriate activity' },
  { value: 'notEngaged', label: 'Not engaged with appropriate activity' }
];

export function InterventionForm({ data, onChange }) {
  // Handle checkbox changes for student tasks (now an array)
  const handleTaskChange = (taskId, checked) => {
    const currentTasks = data.studentTasks || [];
    const newTasks = checked
      ? [...currentTasks, taskId]
      : currentTasks.filter((t) => t !== taskId);
    onChange('studentTasks', newTasks);
  };

  const studentTasks = data.studentTasks || [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
        Intervention Implementation
      </h2>

      {/* Student Task - Now checkboxes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Student Task</h3>
        <div className="flex flex-wrap gap-4">
          {STUDENT_TASK_OPTIONS.map(({ id, label }) => (
            <Checkbox
              key={id}
              label={label}
              checked={studentTasks.includes(id)}
              onChange={(checked) => handleTaskChange(id, checked)}
            />
          ))}
        </div>
        {studentTasks.includes('other') && (
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
        <div className="flex flex-wrap gap-4">
          {ENGAGEMENT_OPTIONS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="studentEngagement"
                value={value}
                checked={data.studentEngagement === value}
                onChange={(e) => onChange('studentEngagement', e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
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
