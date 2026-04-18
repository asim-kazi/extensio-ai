export default function ProgressViewer({ status }) {
  const steps = [
    { id: 'thinking', text: '🧠 AI is analyzing your request' },
    { id: 'generating', text: '⚙️ Writing extension code' },
    { id: 'zipping', text: '📦 Packaging ZIP file' },
    { id: 'done', text: '✅ Download complete!' },
  ];

  const getStepStatus = (stepId) => {
    const statusOrder = ['idle', 'thinking', 'generating', 'zipping', 'done'];
    const currentIndex = statusOrder.indexOf(status);
    const stepIndex = statusOrder.indexOf(stepId);

    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="flex justify-center items-center py-10 w-full animate-slide-up">
      <div className="bg-[#171c28] p-8 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-[450px]">
        <h2 className="mt-0 text-white text-xl mb-6 text-center font-bold">
          Creating your Extension...
        </h2>

        <div className="flex flex-col gap-3">
          {steps.map((step) => {
            const stepStatus = getStepStatus(step.id);
            if (stepStatus === 'pending') return null;

            return (
              <div
                key={step.id}
                className={`text-sm font-medium flex justify-between items-center p-4 rounded-xl animate-fade-in transition-all ${
                  stepStatus === 'active'
                    ? 'bg-indigo-900/30 border border-indigo-500/30 text-indigo-300'
                    : 'bg-slate-800/50 text-slate-400 border border-transparent'
                }`}
              >
                <span>
                  {step.text}
                  {stepStatus === 'active' && (
                    <span className="animate-pulse ml-1">...</span>
                  )}
                </span>
                {stepStatus === 'completed' && (
                  <span className="text-emerald-400 text-lg"> ✔️</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
