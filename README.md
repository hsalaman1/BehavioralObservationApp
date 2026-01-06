# Behavioral Observation App

A web-based behavioral observation application for Board Certified Behavior Analysts (BCBAs) conducting school visits. The app is tablet-friendly, works offline, and enables rapid data collection during live observations.

## Features

### Core Observation Tools

- **Timestamped Narrative Entry** - Real-time clock display (HH:MM:SS AM/PM), press Enter to log observations with automatic timestamps
- **Duration Timers** - Three independent timers for Crisis, On Task, and Off Task behaviors with cumulative tracking
- **Quick Tally Counters** - Tap-to-increment buttons for frequency data collection (Task Completion, Vocals, NFD, Elopement, Aggression, Property Destruction, SIB, Out of Seat, Out of Area)
- **Transition Tracking** - Success/failure tracking with automatic percentage calculation

### Form Sections

- **Visit Notes** - Student info, location, activity checkboxes
- **Intervention Implementation** - Student task, engagement level, notes
- **Data Collection Status** - Current data and form availability
- **Supports Present** - Token boards, visual schedules, timers, etc.
- **BIP Implementation** - Teaching, reinforcement, and prompting of replacement behaviors
- **Behavior Data Summary** - Consolidated view of all collected data
- **ABC Data Entry** - Antecedent-Behavior-Consequence logging with timestamps
- **Recommendations** - Checkboxes with notes for common interventions
- **Next Steps** - Follow-up actions and method of contact

### Data Management

- **Auto-Save** - Automatic localStorage persistence with timestamp indicator
- **Export to CSV** - Full data export in CSV format
- **Export to Word** - Professional formatted .docx document generation
- **Print Support** - Print-optimized layout

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- docx (Word document generation)
- localStorage for persistence

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app runs at `http://localhost:3000` by default.

## Project Structure

```
src/
├── components/
│   ├── Header/         # Observation header with start/end controls
│   ├── Timers/         # Duration timer components
│   ├── Counters/       # Quick tally behavior counters
│   ├── Narrative/      # Timestamped narrative entry
│   ├── Forms/          # All form sections
│   ├── Export/         # CSV and Word export
│   └── UI/             # Reusable UI components
├── hooks/              # Custom React hooks
├── App.jsx             # Main application
└── main.jsx            # Entry point
```

## Usage

1. **Start Observation** - Enter student name, school, and date, then click "Start Observation"
2. **Collect Data** - Use timers, counters, and narrative entry during the session
3. **Complete Forms** - Fill in visit notes, interventions, supports, and BIP info
4. **Add ABC Data** - Log behavioral incidents with antecedent/behavior/consequence
5. **Set Recommendations** - Check applicable recommendations and next steps
6. **End & Export** - Click "End Observation" and export to CSV or Word

## Mobile/Tablet Optimization

- Large touch targets (44px minimum)
- Responsive layout for portrait and landscape
- Sticky header with timer controls
- Collapsible quick tally panel
- Auto-expanding text areas

## License

Private - Internal Use
