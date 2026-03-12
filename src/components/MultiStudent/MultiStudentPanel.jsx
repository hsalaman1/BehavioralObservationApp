import { StudentCard } from './StudentCard';
import { STUDENT_COLORS } from '../SessionSetup/SessionSetup';

export function MultiStudentPanel({ students, onStudentFieldChange, onAddNarrative }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {students.map((student, index) => (
        <StudentCard
          key={index}
          student={student}
          studentIndex={index}
          color={STUDENT_COLORS[index]}
          onStudentFieldChange={onStudentFieldChange}
          onAddNarrative={onAddNarrative}
        />
      ))}
    </div>
  );
}
