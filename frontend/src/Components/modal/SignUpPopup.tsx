import { Link } from "react-router-dom";

const SignUpPopup = ({
  popUp,
}: {
  popUp: boolean;
  setPopUp: (val: boolean) => void;
}) => {
  if (!popUp) return null;

  return (
    <div
      onClick={() => {
        // setPopUp(false);
      }}
      className="fixed inset-0  bg-opacity-50 flex items-center justify-center  px-4 "
    >
      <div className="rounded-lg p-8 max-w-md w-full space-y-6 shadow-lg bg-[#f2f1ed]">
        <h2 className="text-2xl font-bold text-center">Join Medium.</h2>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="font-semibold text-green-600 hover:underline"
          >
            Login
          </Link>
        </div>

        <div className="text-center text-sm">
          Don&apos; have an account?{" "}
          <Link
            to={"/register"}
            className="font-semibold text-green-600 hover:underline"
          >
            Register
          </Link>
        </div>

        <div className="text-xs text-gray-500 text-center leading-relaxed">
          Click “Sign up” to agree to Medium&apos;s{" "}
          <span className="underline">Terms of Service</span>
          and acknowledge that Medium&apos;s{" "}
          <span className="underline"> Privacy Policy</span>
          applies to you.
        </div>
      </div>
    </div>
  );
};

export default SignUpPopup;
