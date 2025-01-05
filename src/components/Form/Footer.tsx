import React from "react";

export default function Footer({
  nextIsDisabled,
  goToPreviousStep,
  goToNextStep,
  nextOverride,
}: {
  nextIsDisabled?: boolean;
  goToPreviousStep?: () => void;
  goToNextStep?: () => void;
  nextOverride?: React.ReactNode;
}) {
  return (
    <div className="flex justify-end p-2 gap-4 border-t-[1.5px] border-dark-color">
      {goToPreviousStep && (
        <button className="border" onClick={goToPreviousStep}>
          {"<"} Back
        </button>
      )}
      {nextOverride ||
        (goToNextStep && (
          <button
            className="border"
            onClick={goToNextStep}
            disabled={nextIsDisabled}
          >
            Next
          </button>
        ))}
    </div>
  );
}
