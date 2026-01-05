import { downloadCSV } from './generateCSV';
import { downloadDocx } from './generateDocx';

export function ExportButtons({ data, onClear }) {
  const handleExportCSV = () => {
    downloadCSV(data);
  };

  const handleExportDocx = async () => {
    await downloadDocx(data);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg no-print">
      <div className="max-w-4xl mx-auto px-4 py-3 flex gap-3">
        <button
          onClick={handleExportCSV}
          className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          CSV
        </button>
        <button
          onClick={handleExportDocx}
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Word
        </button>
        <button
          onClick={handlePrint}
          className="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
        >
          🖨️
        </button>
        <button
          onClick={onClear}
          className="bg-red-100 text-red-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
