const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export default function Calendar({ range, handleDateClick, isInRange }) {
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="p-8">
      <div className="grid grid-cols-7 gap-y-2 text-center">
        {DAYS.map(day => (
          <span key={day} className="text-[10px] font-bold text-gray-400 mb-4 tracking-tighter">
            {day}
          </span>
        ))}
        
        {daysInMonth.map(day => {
          const isStart = range.start === day;
          const isEnd = range.end === day;
          const highlighted = isInRange(day);

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`relative py-3 text-sm font-semibold transition-all duration-200
                ${isStart || isEnd ? 'bg-sky-500 text-white rounded-full scale-90 z-10 shadow-md' : 'text-gray-600'}
                ${highlighted ? 'bg-sky-100 text-sky-700' : 'hover:bg-gray-50 hover:rounded-full'}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}