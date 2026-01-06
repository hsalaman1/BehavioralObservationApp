import { RadioGroup, YesNoRadio } from '../UI/RadioGroup';
import { TextArea } from '../UI/TextArea';

const BIP_OPTIONS = [
  { value: 'hasBIP', label: 'The student has a BIP' },
  { value: 'noBIP', label: 'Student does not have a BIP' }
];

export function BIPForm({ data, onChange }) {
  const handleBIPFieldChange = (field, value) => {
    onChange('bip.' + field, value);
  };

  const hasBIP = data.bip.hasBIP === true;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
        Implementation of the BIP
      </h2>

      <RadioGroup
        name="hasBIP"
        options={BIP_OPTIONS}
        value={data.bip.hasBIP === true ? 'hasBIP' : data.bip.hasBIP === false ? 'noBIP' : ''}
        onChange={(value) => handleBIPFieldChange('hasBIP', value === 'hasBIP')}
        className="flex-col gap-2"
      />

      {hasBIP && (
        <div className="space-y-4 pl-4 border-l-2 border-blue-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teaching/practice of replacement behaviors
            </label>
            <YesNoRadio
              name="teachingReplacement"
              value={data.bip.teachingReplacement === true ? 'yes' : data.bip.teachingReplacement === false ? 'no' : ''}
              onChange={(value) => handleBIPFieldChange('teachingReplacement', value === 'yes')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reinforcement of replacement behaviors
            </label>
            <YesNoRadio
              name="reinforcementReplacement"
              value={data.bip.reinforcementReplacement === true ? 'yes' : data.bip.reinforcementReplacement === false ? 'no' : ''}
              onChange={(value) => handleBIPFieldChange('reinforcementReplacement', value === 'yes')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reinforcement delivered as outlined in the BIP
            </label>
            <YesNoRadio
              name="reinforcementAsOutlined"
              value={data.bip.reinforcementAsOutlined === true ? 'yes' : data.bip.reinforcementAsOutlined === false ? 'no' : ''}
              onChange={(value) => handleBIPFieldChange('reinforcementAsOutlined', value === 'yes')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prompting of replacement behaviors
            </label>
            <YesNoRadio
              name="promptingReplacement"
              value={data.bip.promptingReplacement === true ? 'yes' : data.bip.promptingReplacement === false ? 'no' : ''}
              onChange={(value) => handleBIPFieldChange('promptingReplacement', value === 'yes')}
            />
          </div>
        </div>
      )}

      <TextArea
        label="Notes"
        value={data.bipNotes}
        onChange={(value) => onChange('bipNotes', value)}
        placeholder="Add notes about BIP implementation..."
        autoExpand
        minRows={3}
      />
    </div>
  );
}
