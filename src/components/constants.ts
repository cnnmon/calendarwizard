export type Message = {
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
};

export type Step = React.FC<StepProps>;

export type StepProps = {
  goToNextStep?: () => void;
  goToPreviousStep?: () => void;
};

export interface Calendar {
  id: string;
  summary: string;
}