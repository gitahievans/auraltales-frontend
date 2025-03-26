import { PhoneNumberUtil } from "google-libphonenumber";
import React, { useEffect, useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const phoneUtil = PhoneNumberUtil.getInstance();

type PhoneInputProps = {
  defaultCountry?: string;
  onChange: (phone: string, valid: boolean) => void;
  value?: string;
};
const PhoneInputComponent = ({
  defaultCountry = "ke",
  onChange,
  value,
}: PhoneInputProps) => {
  const [phoneNumber, setPhoneNumber] = useState(value || "");
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [country, setCountry] = useState(defaultCountry);

  useEffect(() => {
    (async () => {
      const fetchCountry = await fetch("/api/detect-country-for-phone");
      const countryCode = await fetchCountry.json();
      console.log("countryCode", countryCode.country);
      setCountry(countryCode.country);
    })();
  }, []);

  const isPhoneValidForCountry = (phone: string, country: string) => {
    try {
      const parsedPhone = phoneUtil.parseAndKeepRawInput(
        phone,
        country.toUpperCase()
      );
      return phoneUtil.isValidNumber(parsedPhone);
    } catch (error) {
      return false;
    }
  };

  const handlePhoneChange = (newPhone: string) => {
    setPhoneNumber(newPhone);
    const valid = isPhoneValidForCountry(newPhone, country);
    setIsPhoneValid(valid);
    onChange(newPhone, valid);
  };

  return (
    <div className="contact flex flex-col gap-1 my-2">
      <label htmlFor="phone number" className="text-sm text-white">
        Phone number
      </label>
      <PhoneInput
        defaultCountry={country}
        value={phoneNumber}
        hideDropdown={false}
        required
        onChange={handlePhoneChange}
        inputStyle={{
          border: "#6b7280 1px solid",
          background: "transparent",
          padding: "12px",
          color: "#c1c2c5",
          width: "100%",
          minHeight: "40px",
          fontSize: "13px",
          borderTopRightRadius: "6px",
          borderBottomRightRadius: "6px",
        }}
        inputClassName="text-lg text-white"
        placeholder="Please add a phone number"
        countrySelectorStyleProps={{
          className: "rounded-md",
          buttonClassName: "px-2 min-h-full",
          buttonContentWrapperClassName: "px-4 h-full",
          style: {
            backgroundColor: "black",
            color: "white",
          },
        }}
      />
      {phoneNumber?.length > 5 && !isPhoneValid && (
        <div style={{ color: "red" }}>Phone number is not valid</div>
      )}
    </div>
  );
};

export default PhoneInputComponent;
