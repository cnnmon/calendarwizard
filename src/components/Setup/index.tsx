import Window from "@/components/Window";
import { useEffect, useState } from "react";
import IntroPage from "./IntroPage";
import CalendarPage from "./CalendarPage";
import EventsPage from "./EventsPage";
import { Step } from "./utils";
import { saveSetupStep } from "./storage";
import { getSetupStep } from "./storage";

const steps: Step[] = [IntroPage, CalendarPage, EventsPage];

export default function Setup({ exitWindow }: { exitWindow: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const Component = steps[currentStep];

  useEffect(() => {
    const step = getSetupStep();
    if (step) {
      setCurrentStep(step);
    }
  }, []);

  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
    saveSetupStep(currentStep + 1);
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
    saveSetupStep(currentStep - 1);
  };

  return (
    <Window name="WizardingAssistant Setup ⚙️">
      <div className="sm:w-[700px]">
        <Component
          goToNextStep={
            currentStep < steps.length - 1 ? goToNextStep : undefined
          }
          goToPreviousStep={currentStep > 0 ? goToPreviousStep : undefined}
          exitWindow={exitWindow}
        />
      </div>
    </Window>
  );
}
