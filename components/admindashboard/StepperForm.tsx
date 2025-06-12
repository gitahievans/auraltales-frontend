import { Button, Group, Stepper } from "@mantine/core";
import { IconCheck, IconUpload } from "@tabler/icons-react";
import React, { useState } from "react";
import FormOne from "./FormOne";
import {
  Author,
  Category,
  Collection,
  FormDataOne,
  FormDataTwo,
  Narrator,
} from "@/types/types";
import FormTwo from "./FormTwo";

// Define StepStatus type here if not already defined elsewhere
export type StepStatus = "idle" | "pending" | "uploading" | "success" | "error";

const StepperForm = ({
  handleSubmit,
  formDataOne,
  formDataTwo,
  errorFormTwo,
  setFormDataTwo,
  errorFormOne,
  setFormDataOne,
  categories,
  collections,
  narrators,
  authors,
  isUploading,
  step1Status,
  step1Message,
  step2Status,
  step2Message,
}: {
  handleSubmit: (e: React.FormEvent) => void;
  formDataOne: FormDataOne;
  formDataTwo: FormDataTwo;
  errorFormTwo: string | null;
  setFormDataTwo: React.Dispatch<React.SetStateAction<FormDataTwo>>;
  errorFormOne: string | null;
  setFormDataOne: React.Dispatch<React.SetStateAction<FormDataOne>>;
  categories: Category[] | null;
  collections: Collection[] | null;
  authors: Author[] | null;
  narrators: Narrator[] | null;
  isUploading: boolean;
  step1Status: StepStatus;
  step1Message: string;
  step2Status: StepStatus;
  step2Message: string;
}) => {
  const [active, setActive] = useState(0);

  const nextStep = () =>
    setActive((current) => (current < 2 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleClick = (e: React.FormEvent) => {
    if (active === steps.length - 1) {
      handleSubmit(e);
    } else {
      nextStep();
    }
  };

  const steps = [
    {
      label: "Book Details",
      description: "Add Audiobook Details",
      icon: <IconUpload size={18} />,
      component: (
        <FormOne
          formDataOne={formDataOne}
          errorFormOne={errorFormOne}
          setFormDataOne={setFormDataOne}
          collections={collections}
          categories={categories}
          authors={authors}
          narrators={narrators}
        />
      ),
    },
    {
      label: "Chapters",
      description: "Upload Chapters",
      icon: <IconCheck size={18} />,
      component: (
        <FormTwo
          formDataTwo={formDataTwo}
          errorFormTwo={errorFormTwo}
          setFormDataTwo={setFormDataTwo}
          step1Status={step1Status}
          step1Message={step1Message}
          step2Status={step2Status}
          step2Message={step2Message}
          showProgress={step1Status !== "idle"}
        />
      ),
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Stepper
        active={active}
        onStepClick={setActive}
        classNames={{
          root: "mb-8",
          stepLabel: "text-sm font-medium",
          stepDescription: "text-xs text-gray-500",
        }}
      >
        {steps.map((step, index) => (
          <Stepper.Step
            key={index}
            label={step.label}
            description={step.description}
            icon={step.icon}
          >
            <div className="mt-6">{step.component}</div>
          </Stepper.Step>
        ))}
      </Stepper>

      <Group justify="center" mt="xl" className="space-x-4">
        {active !== 0 && (
          <Button
            variant="outline"
            onClick={prevStep}
            className="hover:bg-gray-50 transition-colors"
            disabled={isUploading}
          >
            Back
          </Button>
        )}
        <Button
          variant="filled"
          onClick={(e) => handleClick(e)}
          className="bg-blue-600 hover:bg-blue-700 transition-colors"
          disabled={isUploading}
          loading={isUploading}
        >
          {active === steps.length - 1 ? "Submit" : "Next"}
        </Button>
      </Group>
    </div>
  );
};

export default StepperForm;
