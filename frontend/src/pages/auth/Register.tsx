import { ChangeEvent, FormEvent, useState } from "react";
import { AXIOS } from "../../utils/axios";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import RegisterForm from "../../Components/auth/RegisterForm";

export type FormDataT = {
  username: string;
  email: string;
  password: string;
};

export type ErrorT = {
  status: boolean;
  message: string;
};

export type ErrorsT = {
  username: ErrorT;
  email?: ErrorT;
  password: ErrorT;
};

const Register = () => {
  const [formData, setFormData] = useState<FormDataT>({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorsT>({
    username: {
      status: false,
      message: "",
    },
    email: {
      status: false,
      message: "",
    },
    password: {
      status: false,
      message: "",
    },
  });

  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.username.trim()) {
      setErrors((prev) => {
        return {
          ...prev,
          username: {
            status: true,
            message: "Username is required",
          },
        };
      });
      return false;
    } else if (formData.username.length < 6) {
      setErrors((prev) => {
        return {
          ...prev,
          username: {
            status: true,
            message: "Short username",
          },
        };
      });
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          username: {
            status: false,
            message: "",
          },
        };
      });
    }

    if (!formData.email.trim()) {
      setErrors((prev) => {
        return {
          ...prev,
          email: {
            status: true,
            message: "Email is required",
          },
        };
      });
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setErrors((prev) => {
        return {
          ...prev,
          email: {
            status: true,
            message: "Email is invalid",
          },
        };
      });
      return false;
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          email: {
            status: false,
            message: "",
          },
        };
      });
    }

    if (!formData.password.trim()) {
      setErrors((prev) => {
        return {
          ...prev,
          password: {
            status: true,
            message: "Password is required",
          },
        };
      });
      return false;
    } else if (formData.password.length < 6) {
      setErrors((prev) => {
        return {
          ...prev,
          password: {
            status: true,
            message: "Short Password",
          },
        };
      });
      return false;
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          password: {
            status: false,
            message: "",
          },
        };
      });
    }

    return true;
  };

  const handleFormInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    validateForm();
    const { value, id } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [id]: value,
      };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    try {
      setIsLoading(true);
      // const theme = useAppStore.getState().darkTheme;
      // // console.log(theme);
      const response = await AXIOS.post("user/signup", {
        username: formData.username,
        password: formData.password,
        email: formData.email,
      });
      alert(response.data.message);
      navigate("/login");
    } catch (e) {
      if (e instanceof AxiosError) alert(e.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        <RegisterForm
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          handleFormInputChange={handleFormInputChange}
          formData={formData}
          errors={errors}
        />
        <Link className="text-center w-full block" to="/login">
          Go to Login page
        </Link>
      </div>
    </div>
  );
};

export default Register;
