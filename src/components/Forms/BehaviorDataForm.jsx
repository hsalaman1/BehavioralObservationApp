import { Checkbox } from '../UI/Checkbox';
import { formatTotalDuration } from '../../hooks/useTimestamp';

const BEHAVIORS_OBSERVED = [
  { id: 'outOfSeat', label: 'Out of Seat' },
  { id: 'outOfArea', label: 'Out of Area' },
  { id: 'elopement', label: 'Elopement' },
  { id: 'aggression', label: 'Aggression' },
  { id: 'propertyDestruction', label: 'Property Destruction' },
  { id: 'refusalRelated', label: 'Refusal Related Behaviors' },
  { id: 'sib', label: 'SIB' },
  { id: 'disrobing', label: 'Disrobing' },
  { id: 'other1', label: 'Other' },
  { id: 'other2', label: 'Other' },
  { id: 'noTargetBehaviors', label: 'No Target Behaviors Observed' }
];

export function BehaviorDataForm({ data, onChange }) {
  const handleBehaviorChange = (behaviorId, checked) => {
    let newBehaviors;
    if (behaviorId === 'noTargetBehaviors' && checked) {
      // If "No Target Behaviors" is checked, uncheck all others
      newBehaviors = ['noTargetBehaviors'];
    } else {
      newBehaviors = checked
        ? [...data.behaviorsObserved.filter((b) => b !== 'noTargetBehaviors'), behaviorId]
        : data.behaviorsObserved.filter((b) => b !== behaviorId);
    }
    onChange('behaviorsObserved', newBehaviors);
  };

  const handleOtherChange = (index, value) => {
    const newOthers = [...data.behaviorsObservedOther];
    newOthers[index] = value;
    onChange('behaviorsObservedOther', newOthers);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
        Behavior Observation and Data
      </h2>

      {/* Behaviors Observed Checkboxes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Behaviors Observed</h3>
        <div className="flex flex-wrap gap-4">
          {BEHAVIORS_OBSERVED.map(({ id, label }, index) => (
            <div key={id} className="flex items-center gap-2">
              <Checkbox
                label={label}
                checked={data.behaviorsObserved.includes(id)}
                onChange={(checked) => handleBehaviorChange(id, checked)}
              />
              {(id === 'other1' || id === 'other2') && data.behaviorsObserved.includes(id) && (
                <input
                  type="text"
                  value={data.behaviorsObservedOther[id === 'other1' ? 0 : 1] || ''}
                  onChange={(e) => handleOtherChange(id === 'other1' ? 0 : 1, e.target.value)}
                  placeholder="Specify..."
                  className="border rounded px-2 py-1 text-sm w-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Duration Data Summary */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Duration Data</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-600">Behavior</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-600">Total Duration</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-600">Instances</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-3 py-2 font-medium text-red-600">Crisis</td>
                <td className="px-3 py-2 text-center">{formatTotalDuration(data.durationData.crisis.totalSeconds)}</td>
                <td className="px-3 py-2 text-center">{data.durationData.crisis.instances}</td>
              </tr>
              <tr className="border-t">
                <td className="px-3 py-2 font-medium text-green-600">On Task</td>
                <td className="px-3 py-2 text-center">{formatTotalDuration(data.durationData.onTask.totalSeconds)}</td>
                <td className="px-3 py-2 text-center">{data.durationData.onTask.instances}</td>
              </tr>
              <tr className="border-t">
                <td className="px-3 py-2 font-medium text-orange-600">Off Task</td>
                <td className="px-3 py-2 text-center">{formatTotalDuration(data.durationData.offTask.totalSeconds)}</td>
                <td className="px-3 py-2 text-center">{data.durationData.offTask.instances}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequency Data Summary */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Frequency Data</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-600">Behavior</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-600">Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.behaviorCounts).map(([key, value]) => (
                <tr key={key} className="border-t">
                  <td className="px-3 py-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </td>
                  <td className="px-3 py-2 text-center font-medium">{value}</td>
                </tr>
              ))}
              <tr className="border-t">
                <td className="px-3 py-2">Transitions</td>
                <td className="px-3 py-2 text-center font-medium">
                  {data.transitions.successes}/{data.transitions.attempts}
                  {data.transitions.attempts > 0 && (
                    <span className="text-gray-500 ml-1">
                      ({Math.round((data.transitions.successes / data.transitions.attempts) * 100)}%)
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
