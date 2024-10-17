import { FC, useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { Button } from "flowbite-react/components/Button";
import { useNavigate } from "react-router-dom";
import { fetchModifyUsers } from "../api/auth/authApi";

const Profil: FC = () => {
  const { user, token, modify, logout } = useUser();

  const [formState, setFormState] = useState({
    firstname: user?.firstname,
    lastname: user?.lastname,
    email: user?.email,
    password: user?.password,
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleModifyProfil = async (e: React.FormEvent) => {
    e.preventDefault();
    modify(
      formState.email ?? "",
      formState.password ?? "",
      formState.firstname ?? "",
      formState.lastname ?? "",
      token ?? ""
    );
  };

  return (
    <div className="bg-brown-02 font-lato h-auto flex flex-wrap justify-center items-center my-10 lg:h-screen bg-cover">
      <div className="w-full md:w-3/4 lg:w-2/5 bg-pink-01 rounded-lg shadow-2xl opacity-90 p-4 md:p-12 mx-6 text-center">
        <div
          className="block rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover"
          style={{
            backgroundImage: "url('https://i.ibb.co/vqxXhH6/logo.png')",
          }}
        ></div>
        <h1 className="text-3xl font-bold pt-8">
          {user?.firstname} {user?.lastname}
        </h1>
        <div className="w-4/5 mx-auto pt-3 border-b-2 border-brown-01 opacity-25"></div>
      </div>

      <div className="w-full lg:w-3/5 rounded-lg lg:rounded-l-none bg-pink-01 opacity-75 mx-6 lg:mx-0">
        <form className="p-4 md:p-12" onSubmit={handleModifyProfil}>
          <div className="py-8 text-base leading-6 space-y-4 text-brown-01 sm:text-lg sm:leading-7">
            <div className="relative">
              <input
                autoComplete="off"
                id="firstname"
                name="firstname"
                type="text"
                value={formState.firstname}
                onChange={handleChange}
                className="peer placeholder-transparent h-10 w-full font-patrick border-b-2 border-brown-01 text-gray-900 focus:outline-none focus:border-brown-01"
                placeholder="First Name"
              />
              <label
                htmlFor="firstname"
                className="absolute left-0 -top-3.5 text-brown-01 font-patrick text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-brwon-01"
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
                className="peer placeholder-transparent h-10 w-full font-patrick border-b-2 border-brown-01 text-brown-01 focus:outline-none focus:border-brown-01"
                placeholder="Last Name"
              />
              <label
                htmlFor="lastname"
                className="absolute left-0 -top-3.5 text-brown-01 font-patrick text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-brown-01"
              >
                Last Name
              </label>
            </div>
            <div className="relative">
              <input
                autoComplete="off"
                id="email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                className="peer placeholder-transparent h-10 font-patrick w-full border-b-2 border-brown-01 text-brown-01 focus:outline-none focus:border-brown-01"
                placeholder="Email"
              />
              <label
                htmlFor="email"
                className="absolute left-0 -top-3.5 text-brown-01 font-patrick text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-brown-01"
              >
                Email
              </label>
            </div>
            <button
              type="submit"
              className="bg-teal-500 hover:bg-teal-700 text-white font-patrick font-bold py-2 px-4 rounded-full"
            >
              Modify Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-patrick font-bold py-2 px-4 rounded-full mt-8"
            >
              Logout
            </button>
          </div>
        </form>
      </div>

      <div className="mt-12 w-full lg:w-3/5 rounded-lg lg:rounded-l-none bg-pink-01 opacity-75 mx-6 lg:mx-0 ">
        <h1 className="text-3xl font-bold mt-4 ml-4">My Orders</h1>

        <div className="w-4/5 mx-auto pt-3 border-b-2 border-brown-01 opacity-25"></div>

        {user?.orders.map((order) => (
          <>
            <div key={order.id} className="p-4 flex justify-between">
              <h2 className="text-xl font-bold">#{order.id}</h2>
              <p className="text-lg">
                {new Date(order.created_at).toLocaleString().split(",")[0]}
              </p>
              <p className="text-lg px-2">{order.products.length} products</p>
              {/* payed bg-teal-500  */}
              <p
                className={
                  "text-lg rounded-full px-2" +
                  (order.payed ? " bg-teal-500" : " bg-red-500")
                }
              >
                {order.payed ? "Payed" : "Not Payed"}
              </p>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default Profil;
