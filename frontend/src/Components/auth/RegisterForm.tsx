import { ChangeEvent, FormEvent } from "react";

import Input from "../ui/Input";
import { ErrorsT, FormDataT } from "../../pages/auth/Register";

type RegisterFormProp = {
  handleFormInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  formData: FormDataT;
  errors: ErrorsT;
  isLoading: boolean;
};

const RegisterForm = ({
  handleSubmit,
  handleFormInputChange,
  formData,
  errors,
  isLoading,
}: RegisterFormProp) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-5 mb-4">
      {Object.keys(formData).map((elem) => (
        <Input
          key={elem}
          handleFormInputChange={handleFormInputChange}
          elem={elem}
          error={errors && errors[elem as keyof ErrorsT]}
        />
      ))}

      <input
        type="submit"
        value={isLoading ? "Registering..." : "Register"}
        className={`w-full text-white py-2 rounded-full  transition ${
          isLoading ? "bg-gray-400" : " bg-black"
        }`}
        disabled={isLoading}
      />
    </form>
  );
};

export default RegisterForm;
