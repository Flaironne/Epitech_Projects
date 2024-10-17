import { FC, useState } from "react";
import { useUser } from "../contexts/UserContext";

interface ILoginModalProps {
  onPress: () => void;
}

const LoginModal: FC<ILoginModalProps> = ({ onPress }) => {
  const [isRegisterForm, setIsRegisterForm] = useState(false);
  const [formState, setFormState] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");

  const { login, register } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    console.log("registered or logged in")
    if (isRegisterForm) {
      if (formState.password === formState.confirmPassword) {
        register(formState.email, formState.password, formState.firstname, formState.lastname);
        setIsRegisterForm(false);
        onPress();
      } else {
        setError("Passwords does not match");
      }
    }
    else {
      login(formState.email, formState.password);
      setIsRegisterForm(false);
      onPress();
    }
  };

  return (
    <div className="h-0 py-0 flex flex-col justify-center">
      <div
        className="absolute h-screen w-full top-0 left-0 backdrop-blur"
        onClick={() => {
          console.log("isRegisterForm", isRegisterForm);
          onPress();
          setIsRegisterForm(false);
        }}
      />
      <div className="relative py-3 sm:max-w-xl sm:mx-auto translate-y-1/2">
        <div className="absolute inset-0 bg-gradient-to-r from-brown-02 to-pink-01 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-pink-01 shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-patrick">{isRegisterForm ? "Register" : "Login"}</h1>
            <div className="divide-y divide-brown-02">
              <div className="py-8 text-base leading-6 space-y-4 text-brown-01 sm:text-lg sm:leading-7">
                {isRegisterForm && (
                  <>
                    <div className="relative">
                      <input
                        autoComplete="off"
                        id="firstname"
                        name="firstname"
                        type="text"
                        value={formState.firstname}
                        onChange={handleChange}
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-brown-01 focus:outline-none focus:border-brown-01 font-patrick"
                        placeholder="First Name"
                      />
                      <label
                        htmlFor="firstname"
                        className="ml-1 absolute left-0 -top-3.5 text-brown-01 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-brown-01 peer-focus:text-sm font-patrick"
                      >
                        First Name
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        autoComplete="off"
                        id="lastname"
                        name="lastname"
                        type="text"
                        value={formState.lastname}
                        onChange={handleChange}
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-brown-01 focus:outline-none focus:border-brown-01 font-patrick"
                        placeholder="Last Name"
                      />
                      <label
                        htmlFor="lastname"
                        className="ml-1 absolute left-0 -top-3.5 text-brown-01 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-brown-01 peer-focus:text-sm font-patrick"
                      >
                        Last Name
                      </label>
                    </div>
                  </>)
                }
                <div className="relative">
                  <input
                    autoComplete="off"
                    id="email"
                    name="email"
                    type="text"
                    value={formState.email}
                    onChange={handleChange}
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-brown-01 focus:outline-none focus:border-brown-01 font-patrick"
                    placeholder="Email address"
                  />
                  <label
                    htmlFor="email"
                    className="ml-1 absolute left-0 -top-3.5 text-brown-01 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-brown-01 peer-focus:text-sm font-patrick"
                  >
                    Email Address
                  </label>
                </div>
                <div className="relative">
                  <input
                    autoComplete="off"
                    id="password"
                    name="password"
                    type="password"
                    value={formState.password}
                    onChange={handleChange}
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-brown-01 focus:outline-none focus:border-brown-01 font-patrick"
                    placeholder="Password"
                  />
                  <label
                    htmlFor="password"
                    className="ml-1 absolute left-0 -top-3.5 text-brown-01 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-brown-01 peer-focus:text-sm font-patrick"
                  >
                    Password
                  </label>
                </div>
                {isRegisterForm && (
                  <>
                    <div className="relative">
                      <input
                        autoComplete="off"
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formState.confirmPassword}
                        onChange={handleChange}
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-brown-01 focus:outline-none focus:border-brown-01 font-patrick"
                        placeholder="Confirm Password"
                      />
                      <label
                        htmlFor="confirmPassword"
                        className="ml-1 absolute left-0 -top-3.5 text-brown-01 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-brown-01 peer-focus:text-sm font-patrick"
                      >
                        Confirm Password
                      </label>
                    </div>
                    <span className="text-red-500 text-sm font-patrick">{error}</span>
                  </>
                )}
              </div>
            </div>
            <div className="py-1 text-base leading-6 space-y-4 text-brown-01 sm:text-lg sm:leading-7">
              <div className="relative">
                <button className="bg-brown-02 text-brown-01 hover:bg-brown-01 hover:text-brown-02 font-patrick rounded-md px-2 py-1"
                  onClick={handleSubmit}
                >
                  {isRegisterForm ? "Register" : "Submit"}
                </button>
              </div>
            </div>
            <div className="w-full flex justify-center text-brown-01 font-patrick">
              <span
                className="cursor-pointer hover:text-blue-700"
                onClick={() => setIsRegisterForm(!isRegisterForm)}
              >
                {isRegisterForm ? "Have an Account? Login" : "No Account? Register"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default LoginModal;
