export default function HeroSection({ month, year }) {
  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden bg-gray-200">
      {/* Decorative Binder Rings */}
      <div className="absolute top-0 left-0 right-0 flex justify-center space-x-2 -mt-2 z-20">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-2 h-6 bg-gray-400 rounded-full border-t-2 border-gray-600 shadow-sm" />
        ))}
      </div>

      {/* Image Background */}
      <img 
        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b" 
        className="w-full h-full object-cover" 
        alt="Mountain" 
      />

      {/* Geometric Blue Overlays */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 flex">
        <div className="bg-sky-500 w-1/2 h-full" style={{ clipPath: 'polygon(0 50%, 100% 100%, 0 100%)' }}></div>
        <div className="bg-sky-600 w-1/2 h-full relative" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 20%)' }}>
           <div className="absolute bottom-6 right-8 text-right text-white">
              <h2 className="text-xl font-light leading-none">{year}</h2>
              <h1 className="text-4xl font-bold uppercase tracking-widest">{month}</h1>
           </div>
        </div>
      </div>
    </div>
  );
}