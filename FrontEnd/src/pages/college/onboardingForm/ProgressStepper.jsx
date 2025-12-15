import { FaCheck } from 'react-icons/fa';

export default function ProgressStepper({ currentStep, totalSteps }) {
  return (
    <div className="flex justify-center py-8">
      <div className="flex items-center">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={stepNumber} className="flex items-center">
              {/* Step Circle */}
              <div
                className={`relative flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-300
                  ${isCompleted 
                    ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white shadow-md' 
                    : isActive 
                    ? 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white shadow-lg ring-3 ring-[#93c5fd]/20' 
                    : 'bg-white/80 backdrop-blur-sm text-gray-500 border border-gray-200'}`}
              >
                {isCompleted ? (
                  <FaCheck size={14} className="text-white" />
                ) : (
                  <span className="font-medium">{stepNumber}</span>
                )}
              </div>

              {/* Line between steps */}
              {stepNumber < totalSteps && (
                <div className="relative w-20 h-1.5 mx-2">
                  {/* Background line */}
                  <div className="absolute inset-0 bg-gray-200/60 backdrop-blur-sm rounded-full"></div>
                  
                  {/* Progress line */}
                  <div 
                    className={`absolute inset-0 rounded-full transition-all duration-500 ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] w-full' 
                        : isActive 
                        ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] w-1/2' 
                        : 'w-0'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}