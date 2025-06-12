import React from "react";
import AudiobookChapterUploader from "./AudiobookChapterUploader";
import { FormDataTwo } from "@/types/types";
import { StepStatus } from "./StepperForm";
import VerticalProgressIndicator from "./VerticalProgressIndicator";

interface FormTwoProps {
  formDataTwo: FormDataTwo;
  errorFormTwo: string | null;
  setFormDataTwo: React.Dispatch<React.SetStateAction<FormDataTwo>>;
  step1Status: StepStatus;
  step1Message: string;
  step2Status: StepStatus;
  step2Message: string;
  showProgress: boolean;
}

const FormTwo = ({
  formDataTwo,
  setFormDataTwo,
  step1Status,
  step1Message,
  step2Status,
  step2Message,
  showProgress,
}: FormTwoProps) => {
  return (
    <div>
      <AudiobookChapterUploader
        formDataTwo={formDataTwo}
        setFormDataTwo={setFormDataTwo}
      />
      {showProgress && (
        <div className="mb-6">
          <VerticalProgressIndicator
            step1Status={step1Status}
            step1Message={step1Message}
            step2Status={step2Status}
            step2Message={step2Message}
          />
        </div>
      )}
    </div>
  );
};

export default FormTwo;
