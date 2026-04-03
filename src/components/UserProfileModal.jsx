import { useState } from 'react';

export function UserProfileModal({ onSave }) {
  const [name, setName] = useState('');
  const [credentials, setCredentials] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(name.trim(), credentials.trim());
  };

  const canSubmit = name.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Welcome</h2>
        <p className="text-sm text-gray-500 mb-5">
          Enter your name and credentials to pre-fill observer fields on every observation.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Smith"
              autoFocus
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Credentials / Title <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              placeholder="e.g. MS, BCBA"
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Save &amp; Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
