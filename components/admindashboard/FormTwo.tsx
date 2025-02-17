import React from "react";
import AudiobookChapterUploader from "./AudiobookChapterUploader";
import { FormDataTwo } from "@/types/types";

interface FormTwoProps {
  formDataTwo: FormDataTwo;
  errorFormTwo: string | null;
  setFormDataTwo: (data: FormDataTwo) => void;
}

const FormTwo = ({ formDataTwo, setFormDataTwo }: FormTwoProps) => {

  return (
    <div>
      <div>
        <h1>Add Audiobook Chapters</h1>
      </div>
      <AudiobookChapterUploader
        formDataTwo={formDataTwo}
        setFormDataTwo={setFormDataTwo}
      />
    </div>
  );
};

export default FormTwo;
