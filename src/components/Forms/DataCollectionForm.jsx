import { YesNoRadio } from '../UI/RadioGroup';
import { TextArea } from '../UI/TextArea';

export function DataCollectionForm({ data, onChange }) {
  const handleDataCollectionChange = (field, value) => {
    onChange('dataCollection.' + field, value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
        Data Collection Status
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data is current
          </label>
          <YesNoRadio
            name="dataCurrent"
            value={data.dataCollection.dataCurrent === true ? 'yes' : data.dataCollection.dataCurrent === false ? 'no' : ''}
            onChange={(value) => handleDataCollectionChange('dataCurrent', value === 'yes')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Past data forms are available
          </label>
          <YesNoRadio
            name="pastFormsAvailable"
            value={data.dataCollection.pastFormsAvailable === true ? 'yes' : data.dataCollection.pastFormsAvailable === false ? 'no' : ''}
            onChange={(value) => handleDataCollectionChange('pastFormsAvailable', value === 'yes')}
          />
        </div>
      </div>

      <TextArea
        label="Notes"
        value={data.dataCollectionNotes}
        onChange={(value) => onChange('dataCollectionNotes', value)}
        placeholder="Add notes about data collection..."
        autoExpand
        minRows={3}
      />
    </div>
  );
}
