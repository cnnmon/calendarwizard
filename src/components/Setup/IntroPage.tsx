import Image from "next/image";
import Footer from "./Footer";
import { StepProps } from "../constants";

export default function IntroPage({ goToNextStep }: StepProps) {
  return (
    <>
      <div className="flex">
        <div className="w-2/5 relative h-[400px]">
          <Image
            src="/profile.png"
            alt="profile"
            fill
            className="object-cover no-drag"
          />
        </div>

        <div className="w-3/5 flex flex-col gap-4 p-4">
          <h2 className="text-xl font-medium">
            Welcome to WizardAssistant Setup
          </h2>
          <p>
            This wizard will guide you through the installation of
            WizardAssistant.
          </p>
          <p>Click Next to continue.</p>
        </div>
      </div>
      <Footer goToNextStep={goToNextStep} />
    </>
  );
}
