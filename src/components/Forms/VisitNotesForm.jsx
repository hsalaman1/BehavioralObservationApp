import { Checkbox } from '../UI/Checkbox';
import { YesNoNARadio } from '../UI/RadioGroup';
import { TextArea } from '../UI/TextArea';

const LOCATIONS = [
  { id: 'classroom', label: 'Classroom' },
  { id: 'outsideArea', label: 'Outside Area' },
  { id: 'cafeteria', label: 'Cafeteria' },
  { id: 'hallway', label: 'Hallway' },
  { id: 'other', label: 'Other' }
];

const ACTIVITIES = [
  { id: 'academics', label: 'Academics' },
  { id: 'unstructuredTime', label: 'Unstructured Time' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'recess', label: 'Recess' },
  { id: 'block', label: 'Block' },
  { id: 'arrival', label: 'Arrival' },
  { id: 'dismissal', label: 'Dismissal' },
  { id: 'other', label: 'Other' }
];

export function VisitNotesForm({ data, onChange }) {
  const handleHeaderChange = (field, value) => {
    onChange('header.' + field, value);
  };

  const handleLocationChange = (locationId, checked) => {
    const newLocations = checked
      ? [...data.location, locationId]
      : data.location.filter((l) => l !== locationId);
    onChange('location', newLocations);
  };

  const handleActivityChange = (activityId, checked) => {
    const newActivities = checked
      ? [...data.activity, activityId]
      : data.activity.filter((a) => a !== activityId);
    onChange('activity', newActivities);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Visit Notes</h2>

      {/* Header Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Session Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Student ID</label>
            <input
              type="text"
              value={data.header.studentId}
              onChange={(e) => handleHeaderChange('studentId', e.target.value)}
              placeholder="Optional"
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Observer</label>
            <input
              type="text"
              value={data.header.observer}
              onChange={(e) => handleHeaderChange('observer', e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* RBT Present */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">RBT Present</label>
          <YesNoNARadio
            name="rbtPresent"
            value={data.header.rbtPresent}
            onChange={(value) => handleHeaderChange('rbtPresent', value)}
          />
          {data.header.rbtPresent === 'yes' && (
            <input
              type="text"
              value={data.header.rbtName}
              onChange={(e) => handleHeaderChange('rbtName', e.target.value)}
              placeholder="RBT's Name"
              className="mt-2 w-full md:w-1/2 border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Location</h3>
        <div className="flex flex-wrap gap-4">
          {LOCATIONS.map(({ id, label }) => (
            <Checkbox
              key={id}
              label={label}
              checked={data.location.includes(id)}
              onChange={(checked) => handleLocationChange(id, checked)}
            />
          ))}
        </div>
        {data.location.includes('other') && (
          <input
            type="text"
            value={data.locationOther || ''}
            onChange={(e) => onChange('locationOther', e.target.value)}
            placeholder="Specify other location..."
            className="mt-2 border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        )}
      </div>

      {/* Activity/Event */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Activity/Event</h3>
        <div className="flex flex-wrap gap-4">
          {ACTIVITIES.map(({ id, label }) => (
            <Checkbox
              key={id}
              label={label}
              checked={data.activity.includes(id)}
              onChange={(checked) => handleActivityChange(id, checked)}
            />
          ))}
        </div>
        {data.activity.includes('other') && (
          <input
            type="text"
            value={data.activityOther || ''}
            onChange={(e) => onChange('activityOther', e.target.value)}
            placeholder="Specify other activity..."
            className="mt-2 border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        )}
      </div>
    </div>
  );
}
