import { CheckboxWithNote, Checkbox } from '../UI/Checkbox';
import { TextArea } from '../UI/TextArea';

const RECOMMENDATIONS = [
  { id: 'increaseReinforcement', label: 'Increase rate of reinforcement' },
  { id: 'thinReinforcement', label: 'Thin schedule of reinforcement' },
  { id: 'increaseLevelPrompts', label: 'Increase level of prompts' },
  { id: 'decreaseLevelPrompts', label: 'Decrease level of prompts' },
  { id: 'increasePrompting', label: 'Increase prompting' },
  { id: 'fadePrompting', label: 'Fade prompting' },
  { id: 'plannedIgnoring', label: 'Planned ignoring of' },
  { id: 'precisionRequest', label: 'Utilize precision request' },
  { id: 'increaseSupervision', label: 'Increase supervision' },
  { id: 'increaseBreaks', label: 'Increase breaks' },
  { id: 'accommodateSensory', label: 'Accommodate sensory needs' },
  { id: 'movementBreaks', label: 'Provide movement breaks' },
  { id: 'visualSupports', label: 'Implement/Increase visual supports' },
  { id: 'reteachExpectations', label: 'Re-teach expectations' },
  { id: 'modifyDemands', label: 'Modify presentation of demands or tasks' }
];

const NEXT_STEPS = [
  { id: 'followUpObservation', label: 'Follow-Up Observation' },
  { id: 'staffTraining', label: 'Staff Training' },
  { id: 'modelSupports', label: 'Model Supports' },
  { id: 'crisisPlanning', label: 'Crisis Planning' },
  { id: 'preferenceAssessment', label: 'Preference Assessment' },
  { id: 'reviewBIP', label: 'Review BIP' },
  { id: 'requestFBA', label: 'Request FBA' },
  { id: 'continueImplementation', label: 'Continue implementation as planned' },
  { id: 'consultSLPOT', label: 'Consult with SLP/OT' }
];

export function RecommendationsForm({ data, onChange }) {
  const handleRecommendationChange = (id, field, value) => {
    onChange('recommendations.' + id + '.' + field, value);
  };

  const handleNextStepChange = (stepId, checked) => {
    const newSteps = checked
      ? [...data.nextSteps, stepId]
      : data.nextSteps.filter((s) => s !== stepId);
    onChange('nextSteps', newSteps);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
        Recommendations and Next Steps
      </h2>

      {/* Recommendations */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Recommendations</h3>
        <div className="space-y-3">
          {RECOMMENDATIONS.map(({ id, label }) => (
            <CheckboxWithNote
              key={id}
              label={label}
              checked={data.recommendations[id]?.checked || false}
              note={data.recommendations[id]?.note || ''}
              onCheckedChange={(checked) => handleRecommendationChange(id, 'checked', checked)}
              onNoteChange={(note) => handleRecommendationChange(id, 'note', note)}
            />
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Next Steps</h3>
        <div className="flex flex-wrap gap-4">
          {NEXT_STEPS.map(({ id, label }) => (
            <Checkbox
              key={id}
              label={label}
              checked={data.nextSteps.includes(id)}
              onChange={(checked) => handleNextStepChange(id, checked)}
            />
          ))}
        </div>
      </div>

      {/* Method of Follow-Up */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Method of Follow-Up</label>
        <input
          type="text"
          value={data.methodOfFollowUp}
          onChange={(e) => onChange('methodOfFollowUp', e.target.value)}
          placeholder="Enter method of follow-up..."
          className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      {/* Additional Documents */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Documents</label>
        <input
          type="text"
          value={data.additionalDocuments}
          onChange={(e) => onChange('additionalDocuments', e.target.value)}
          placeholder="List any additional documents..."
          className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      {/* Behavior Analyst Signature */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Behavior Analyst</label>
        <input
          type="text"
          value={data.behaviorAnalyst}
          onChange={(e) => onChange('behaviorAnalyst', e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
    </div>
  );
}
