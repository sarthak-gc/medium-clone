import { ChangeEvent, useState } from "react";
import { ErrorT } from "../../pages/auth/Register";

type FormInputProp = {
  handleFormInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  elem: string;
  error?: ErrorT;
};

const Input = ({ handleFormInputChange, elem, error }: FormInputProp) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");

  const showLabel = isFocused || value !== "";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    handleFormInputChange(e);
  };

  return (
    <div className="relative w-full mt-6">
      <input
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        type={elem === "password" ? "password" : "text"}
        id={elem}
        value={value}
        className={`w-full px-3 pt-5 pb-2 text-sm border-2 rounded-md placeholder-transparent text-gray-700 transition duration-200 outline-none
          ${error?.status && value ? " border-red-500" : " border-gray-300"}
        `}
      />
      <label
        htmlFor={elem}
        className={`absolute left-3 transition-all  bg-white text-gray-500 ${
          showLabel ? "text-xs -top-3" : "text-sm top-3 "
        }
        ${error?.status && value ? "text-red-400" : ""}
        ${isFocused && !value ? "" : ""}`}
      >
        {error?.status && value
          ? error.message
          : elem.charAt(0).toUpperCase() + elem.slice(1)}
      </label>
    </div>
  );
};

export default Input;
