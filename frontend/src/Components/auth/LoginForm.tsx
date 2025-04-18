import { ChangeEvent, FormEvent } from "react";
import { FormDataT } from "../../pages/auth/Login";

import Input from "../ui/Input";
import { ErrorsT } from "../../pages/auth/Register";

type LoginFormProp = {
  handleFormInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  formData: FormDataT;
  errors: ErrorsT;
  isLoading: boolean;
};

const LoginForm = ({
  handleFormInputChange,
  handleSubmit,
  formData,
  errors,

  isLoading,
}: LoginFormProp) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-5 mb-4">
      {Object.keys(formData).map((elem) => (
        <Input
          key={elem}
          handleFormInputChange={handleFormInputChange}
          elem={elem}
          error={errors[elem as keyof ErrorsT]}
        />
      ))}

      <input
        type="submit"
        value={isLoading ? "Logging in..." : "Log In"}
        className={`w-full text-white py-2 rounded-full  transition ${
          isLoading ? "bg-gray-400 cursor-not-allowed" : " bg-black"
        }`}
        disabled={isLoading}
      />
    </form>
  );
};

export default LoginForm;
