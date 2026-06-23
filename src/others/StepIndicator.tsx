interface StepIndicatorProps {
  currentStep: number;
}

const steps = ["Cart", "Checkout", "Payment", "Confirmation"];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between relative">

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;

          return (
            <div key={index} className="flex-1 flex flex-col items-center relative">

              {/* Line */}
              {index !== 0 && (
                <div
                  className={`absolute top-4 -left-1/2 w-full h-1 
                  ${currentStep > stepNumber ? "bg-blue-600" : "bg-gray-300"}`}
                />
              )}

              {/* Circle */}
              <div
                className={`z-10 flex items-center justify-center w-9 h-9 rounded-full font-semibold text-sm
                ${
                  isCompleted
                    ? "bg-blue-600 text-white"
                    : isActive
                    ? "border-2 border-blue-600 text-blue-600 bg-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>

              {/* Label */}
              <p
                className={`mt-2 text-sm font-medium text-center
                ${
                  isCompleted || isActive
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}