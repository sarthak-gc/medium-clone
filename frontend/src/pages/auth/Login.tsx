import { ChangeEvent, FormEvent, useState } from "react";
import { AXIOS } from "../../utils/axios";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../../Components/auth/LoginForm";
import { useAppStore } from "../../store/appStore";
import { ErrorsT } from "./Register";

export type FormDataT = {
  username: string;
  password: string;
};

const Login = () => {
  const setIsLoggedIn = useAppStore((state) => state.setIsLoggedIn);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormDataT>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<ErrorsT>({
    username: {
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
    setFormData((prev) => {
      const { value } = e.target;
      const { id } = e.target;
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
      console.log(AXIOS);
      const response = await AXIOS.post("user/signin", {
        username: formData.username,
        password: formData.password,
      });
      const token = response.data.data.accessToken;
      localStorage.setItem("token", token);
      alert(response.data.message);
      document.cookie = `token=${token}; path=/; max-age=${3600 * 48}`;

      setIsLoggedIn(true);

      navigate("/");
    } catch (e) {
      if (e instanceof AxiosError) alert(e.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <LoginForm
          isLoading={isLoading}
          errors={errors}
          handleSubmit={handleSubmit}
          handleFormInputChange={handleFormInputChange}
          formData={formData}
        />
        <Link className="text-center  w-full block" to="/register">
          Go to Register page
        </Link>
      </div>
    </div>
  );
};

export default Login;
