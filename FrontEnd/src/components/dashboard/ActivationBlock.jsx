const ActivationBlock = ({
  greeting,
  subtitle,
  steps,
  children, // Add children prop
}) => (
  <div className="rounded-2xl p-6 mb-8 bg-slate-100 border border-slate-200 shadow-sm">
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">

      {/* Left */}
      <div className="flex-1">
        <h2 className="font-bold text-xl text-slate-800">{greeting}</h2>
        <p className="text-slate-500 text-sm mt-1 mb-4">{subtitle}</p>

        {/* Steps */}
        <div className="flex items-center gap-2 flex-wrap">
          {steps.map((s, i) => (
            <div key={s.number} className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-sm border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {s.number}
                </span>
                <span className="text-xs font-medium text-slate-700">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <span className="text-slate-400 text-xs">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right: Custom Content (The 4 Buttons) */}
      <div className="w-full lg:w-auto">
        {children}
      </div>

    </div>
  </div>
);

export default ActivationBlock;