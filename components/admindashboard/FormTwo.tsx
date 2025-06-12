import React, { useState } from "react";
import AudiobookChapterUploader from "./AudiobookChapterUploader";
import { FormDataTwo } from "@/types/types";
import { StepStatus } from "./StepperForm";
import VerticalProgressIndicator from "./VerticalProgressIndicator";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";

interface FormTwoProps {
  formDataTwo: FormDataTwo;
  errorFormTwo: string | null;
  setFormDataTwo: React.Dispatch<React.SetStateAction<FormDataTwo>>;
  step1Status: StepStatus;
  step1Message: string;
  step2Status: StepStatus;
  step2Message: string;
  showProgress: boolean;
  onChapterFormDirtyChange?: (isDirty: boolean) => void; // New prop
}

const FormTwo = ({
  formDataTwo,
  setFormDataTwo,
  step1Status,
  step1Message,
  step2Status,
  step2Message,
  showProgress,
  onChapterFormDirtyChange,
}: FormTwoProps) => {
  return (
    <div>
      <AudiobookChapterUploader
        formDataTwo={formDataTwo}
        setFormDataTwo={setFormDataTwo}
        onDirtyStateChange={onChapterFormDirtyChange}
      />
      {formDataTwo.chapters.length === 0 && (
        <div className="my-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <IconAlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
            <span className="text-sm text-yellow-800">
              No chapters added yet.
            </span>
          </div>
        </div>
      )}

      {formDataTwo.chapters.length > 0 && (
        <div className="my-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <IconCheck className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-sm text-green-800">
              {formDataTwo.chapters.length} chapter
              {formDataTwo.chapters.length !== 1 ? "s" : ""} ready for
              submission
            </span>
          </div>
        </div>
      )}

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
