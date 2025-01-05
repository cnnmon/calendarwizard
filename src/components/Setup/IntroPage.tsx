import Image from "next/image";
import Footer from "../Form/Footer";
import { StepProps } from "./utils";

export default function IntroPage({ goToNextStep }: StepProps) {
  return (
    <>
      <div className="flex">
        <div className="w-2/5 relative h-[400px]">
          <Image
            src="/incubation.png"
            alt="profile"
            width={1500}
            height={800}
            className="object-cover no-drag h-full"
          />
        </div>

        <div className="w-3/5 flex flex-col gap-4 p-4">
          <h2 className="text-xl font-medium">
            Welcome to WizardingAssistant Setup
          </h2>
          <p>
            This wizard will guide you through the installation of
            WizardingAssistant. WizardingAssistant is a wizard of calendars that
            will help you manage your busy life temporally.
          </p>
          <p>Click Next to continue.</p>
        </div>
      </div>
      <Footer goToNextStep={goToNextStep} />
    </>
  );
}
