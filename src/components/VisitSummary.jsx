import React from 'react'

export default function VisitSummary({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      visitSummary: {
        ...data.visitSummary,
        [field]: value
      }
    })
  }

  const summary = data.visitSummary || { purpose: '', synopsis: '' }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Visit Summary / Session Notes
      </h2>

      <div className="space-y-6">
        {/* Purpose of Observation */}
        <div>
          <label
            htmlFor="purpose"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Purpose of Observation
          </label>
          <textarea
            id="purpose"
            value={summary.purpose}
            onChange={(e) => handleChange('purpose', e.target.value)}
            placeholder="Describe the reason for this observation visit (e.g., initial assessment, follow-up observation, behavior monitoring, intervention review...)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
            rows={3}
          />
          <p className="mt-1 text-xs text-gray-500">
            Why was this observation conducted?
          </p>
        </div>

        {/* Synopsis */}
        <div>
          <label
            htmlFor="synopsis"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Synopsis / What Took Place
          </label>
          <textarea
            id="synopsis"
            value={summary.synopsis}
            onChange={(e) => handleChange('synopsis', e.target.value)}
            placeholder="Provide a summary of the observation session. Include key observations, notable behaviors, environmental factors, interactions observed, and any significant events that occurred during the visit..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
            rows={8}
          />
          <p className="mt-1 text-xs text-gray-500">
            Summarize what happened during this observation session
          </p>
        </div>

        {/* Character count indicators */}
        <div className="flex justify-between text-xs text-gray-400">
          <span>Purpose: {summary.purpose.length} characters</span>
          <span>Synopsis: {summary.synopsis.length} characters</span>
        </div>
      </div>
    </div>
  )
}
