import Container from "../Container";
import { useState } from "react";
import IntroPage from "./IntroPage";
import CalendarPage from "./CalendarPage";
import { Step } from "../constants";

const steps: Step[] = [IntroPage, CalendarPage, IntroPage];

export default function Setup() {
  const [currentStep, setCurrentStep] = useState(0);
  const Component = steps[currentStep];

  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Container name="WizardAssistant Setup">
      <div className="sm:w-[700px]">
        <Component
          goToNextStep={
            currentStep < steps.length - 1 ? goToNextStep : undefined
          }
          goToPreviousStep={currentStep > 0 ? goToPreviousStep : undefined}
        />
      </div>
    </Container>
  );
}
