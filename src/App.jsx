import React, { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import ObservationHeader from './components/ObservationHeader'
import VisitSummary from './components/VisitSummary'

const TABS = [
  { id: 'summary', label: 'Visit Summary', icon: 'document' },
  { id: 'session', label: 'Session Info', icon: 'user' },
]

const initialData = {
  header: {
    studentName: '',
    observer: '',
    date: '',
    startTime: '',
    endTime: '',
    school: '',
  },
  visitSummary: {
    purpose: '',
    synopsis: '',
  },
}

function TabIcon({ icon, isActive }) {
  const color = isActive ? 'text-blue-600' : 'text-gray-500'

  if (icon === 'document') {
    return (
      <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }
  if (icon === 'user') {
    return (
      <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  }
  return null
}

export default function App() {
  const [data, setData] = useLocalStorage('observation-data', initialData)
  const [activeTab, setActiveTab] = useState('summary')

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setData(initialData)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return <VisitSummary data={data} onChange={setData} />
      case 'session':
        return <ObservationHeader data={data} onChange={setData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Behavioral Observation</h1>
                <p className="text-sm text-gray-500">Session Notes & Documentation</p>
              </div>
            </div>
            <button
              onClick={handleClearData}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <TabIcon icon={tab.icon} isActive={activeTab === tab.id} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {renderTabContent()}
      </main>

      {/* Footer with save indicator */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Auto-saved to browser
          </span>
          <span>
            {data.header?.studentName && `Student: ${data.header.studentName}`}
          </span>
        </div>
      </footer>
    </div>
  )
}
