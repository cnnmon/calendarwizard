import WindowBox from "../WindowBox";
import { Dispatch, useEffect, useState } from "react";
import IntroPage from "./IntroPage";
import EventsPage from "./EventsPage";
import { Step } from "./utils";
import { State } from "../constants";
import { Action } from "@/app/manager";
import CalendarFormPage from "./CalendarFormPage";

const steps: Step[] = [IntroPage, CalendarFormPage, EventsPage];

export default function Setup({
  state,
  dispatch,
  onExit,
}: {
  state: State;
  dispatch: Dispatch<Action>;
  onExit: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const Component = steps[currentStep];

  useEffect(() => {
    setCurrentStep(state.setupStep);
  }, [state.setupStep]);

  const goToNextStep = () => {
    dispatch({ type: "setSetupStep", payload: currentStep + 1 });
  };

  const goToPreviousStep = () => {
    dispatch({ type: "setSetupStep", payload: currentStep - 1 });
  };

  return (
    <WindowBox name="WizardingAssistant Setup ⚙️">
      <div className="sm:w-[700px]">
        <Component
          state={state}
          dispatch={dispatch}
          goToNextStep={
            currentStep < steps.length - 1 ? goToNextStep : undefined
          }
          goToPreviousStep={currentStep > 0 ? goToPreviousStep : undefined}
          onExit={onExit}
        />
      </div>
    </WindowBox>
  );
}
