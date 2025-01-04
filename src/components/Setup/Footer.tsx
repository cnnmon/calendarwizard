export default function Footer({
  nextIsDisabled,
  goToPreviousStep,
  goToNextStep,
}: {
  nextIsDisabled?: boolean;
  goToPreviousStep?: () => void;
  goToNextStep?: () => void;
}) {
  return (
    <div className="flex justify-end p-2 gap-4 border-t-[1.5px] border-dark-color">
      {goToPreviousStep && (
        <button onClick={goToPreviousStep}>{"<"} Back</button>
      )}
      {goToNextStep && (
        <button onClick={goToNextStep} disabled={nextIsDisabled}>
          Next
        </button>
      )}
    </div>
  );
}
