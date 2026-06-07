import React, { useState, useEffect } from 'react';

// --- SUB-COMPONENT: Hero Section ---
const HeroSection = ({ month, year }) => (
  <div className="relative w-full h-64 md:h-80 overflow-hidden bg-gray-200">
    <div className="absolute top-0 left-0 right-0 flex justify-center space-x-2 -mt-2 z-20">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="w-1.5 h-5 bg-gray-400 rounded-full border-t border-gray-600 shadow-sm" />
      ))}
    </div>
    <img 
      src="https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=1000" 
      className="w-full h-full object-cover" 
      alt="Calendar Header" 
    />
    <div className="absolute bottom-0 left-0 w-full h-1/2 flex">
      <div className="bg-sky-500 w-1/2 h-full" style={{ clipPath: 'polygon(0 60%, 100% 100%, 0 100%)' }}></div>
      <div className="bg-sky-600 w-1/2 h-full relative" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 20%)' }}>
         <div className="absolute bottom-4 right-6 text-right text-white">
            <h2 className="text-xl font-light leading-none tracking-tighter">{year}</h2>
            <h1 className="text-3xl font-bold uppercase tracking-widest">{month}</h1>
         </div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [viewDate, setViewDate] = useState(new Date(2022, 0, 1)); 
  const [activeRange, setActiveRange] = useState({ start: null, end: null });
  const [currentNote, setCurrentNote] = useState("");
  
  // This stores ALL saved ranges persistently
  const [savedRanges, setSavedRanges] = useState(() => {
    const saved = localStorage.getItem('permanent_ranges');
    return saved ? JSON.parse(saved).map(r => ({
        ...r, 
        start: new Date(r.start), 
        end: new Date(r.end)
    })) : [];
  });

  useEffect(() => {
    localStorage.setItem('permanent_ranges', JSON.stringify(savedRanges));
  }, [savedRanges]);

  // --- Handlers ---
  const handleDateClick = (clickedDate) => {
    const date = new Date(clickedDate.setHours(0,0,0,0));
    if (!activeRange.start || (activeRange.start && activeRange.end)) {
      setActiveRange({ start: date, end: null });
    } else if (date < activeRange.start) {
      setActiveRange({ start: date, end: null });
    } else {
      setActiveRange({ ...activeRange, end: date });
    }
  };

  const saveCurrentRange = () => {
    if (!activeRange.start || !activeRange.end) return;
    const newEntry = {
      id: Date.now(),
      start: activeRange.start,
      end: activeRange.end,
      note: currentNote || "No memo"
    };
    setSavedRanges([...savedRanges, newEntry]);
    setActiveRange({ start: null, end: null }); // Clear for next selection
    setCurrentNote("");
  };

  const deleteRange = (id) => {
    setSavedRanges(savedRanges.filter(r => r.id !== id));
  };

  const changeMonth = (offset) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  // --- Helpers for Styling ---
  const getDayStatus = (thisDate) => {
    const time = thisDate.getTime();
    // Check if it's the current active selection
    if (activeRange.start?.getTime() === time || activeRange.end?.getTime() === time) return 'active-boundary';
    if (activeRange.start && activeRange.end && time > activeRange.start && time < activeRange.end) return 'active-mid';
    
    // Check if it's inside ANY saved range
    const isSaved = savedRanges.some(r => time >= r.start.getTime() && time <= r.end.getTime());
    return isSaved ? 'saved' : 'none';
  };

  const year = viewDate.getFullYear();
  const monthName = viewDate.toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(year, viewDate.getMonth() + 1, 0).getDate();
  const offset = new Date(year, viewDate.getMonth(), 1).getDay() === 0 ? 6 : new Date(year, viewDate.getMonth(), 1).getDay() - 1;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
      
      {/* Month Nav */}
      <div className="flex items-center space-x-10 mb-6 bg-white px-8 py-3 rounded-full shadow-sm border">
        <button onClick={() => changeMonth(-1)} className="font-black text-sky-600 hover:scale-110">PREV</button>
        <span className="font-bold text-lg min-w-[150px] text-center">{monthName} {year}</span>
        <button onClick={() => changeMonth(1)} className="font-black text-sky-600 hover:scale-110">NEXT</button>
      </div>

      <div className="bg-white shadow-2xl w-full max-w-6xl flex flex-col md:flex-row overflow-hidden rounded-xl border-t-[12px] border-slate-800">
        
        {/* CALENDAR */}
        <div className="md:w-2/3 border-r border-slate-100">
          <HeroSection month={monthName} year={year} />
          <div className="p-10">
            <div className="grid grid-cols-7 gap-y-2 text-center">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => <span key={d} className="text-[10px] font-black text-slate-300 mb-6">{d}</span>)}
              {[...Array(offset)].map((_, i) => <div key={`e-${i}`} />)}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const date = new Date(year, viewDate.getMonth(), day, 0,0,0,0);
                const status = getDayStatus(date);

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(date)}
                    className={`py-3 text-sm font-bold transition-all
                      ${status === 'active-boundary' ? 'bg-sky-500 text-white rounded-full z-10 scale-90' : ''}
                      ${status === 'active-mid' ? 'bg-sky-100 text-sky-600' : ''}
                      ${status === 'saved' ? 'bg-slate-800 text-white rounded-sm' : 'text-slate-600 hover:bg-slate-50'}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SIDEBAR: SAVED RANGES & NOTES */}
        <div className="md:w-1/3 p-8 bg-white flex flex-col">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">New Selection</h3>
          
          <div className="bg-slate-50 p-4 rounded-lg mb-8">
            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase">Current Range</p>
            <p className="text-xs mb-4">
                {activeRange.start ? activeRange.start.toDateString() : 'Pick start'} → {activeRange.end ? activeRange.end.toDateString() : '...'}
            </p>
            <input 
                type="text" 
                placeholder="Add a memo for this range..."
                className="w-full bg-white border border-slate-200 p-2 text-sm rounded mb-3 outline-none focus:border-sky-500"
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
            />
            <button 
                onClick={saveCurrentRange}
                disabled={!activeRange.end}
                className="w-full bg-sky-600 text-white font-bold py-2 rounded text-xs disabled:opacity-30"
            >
                SAVE TO CALENDAR
            </button>
          </div>

          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Saved Memos</h3>
          <div className="flex-grow overflow-y-auto space-y-3 max-h-[300px]">
            {savedRanges.length === 0 && <p className="text-xs text-slate-300 italic">No saved dates yet.</p>}
            {savedRanges.map(range => (
              <div key={range.id} className="border-l-4 border-slate-800 bg-slate-50 p-3 relative group">
                <button 
                    onClick={() => deleteRange(range.id)}
                    className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 text-[10px]"
                >
                    DELETE
                </button>
                <p className="text-[10px] font-bold text-sky-600 mb-1">
                    {range.start.toLocaleDateString()} - {range.end.toLocaleDateString()}
                </p>
                <p className="text-sm text-slate-700 italic">{range.note}</p>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}