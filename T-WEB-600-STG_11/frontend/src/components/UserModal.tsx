import { FC, useState } from "react";

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

interface UserModalProps {
    user: User | null;
    onPress: () => void;
}

const UserModal: FC<UserModalProps> = ({ user, onPress }) => {

    const [userState, setUserState] = useState<User | null>(user);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setUserState((prevState) => ({
            ...prevState,
            [name]: value,
        }) as User | null);
    };

    const handleUpdateProduct = () => {
        if (userState) {
            onPress(); // Close the modal after updating
        }
    };

    return (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center"

        >
            <div className="absolute inset-0 bg-gray-800 opacity-50" onClick={onPress}></div>
            <div className="relative bg-white p-8 rounded-lg" style={{ width: "500px" }}>
                <h1 className="text-2xl font-patrick mb-4">Modify Product</h1>
                <div className="divide-y divide-brown-02">
                    <div className="py-8 text-base leading-6 space-y-4 text-brown-01 sm:text-lg sm:leading-7">
                        <div className="relative">
                            <input
                                autoComplete="off"
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={userState?.firstName || ''}
                                onChange={handleChange}
                                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-brown-01 focus:outline-none focus:border-brown-01 font-patrick"
                                placeholder="firstName"
                            />
                            <label
                                htmlFor="name"
                                className="ml-1 absolute left-0 -top-3.5 text-brown-01 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-brown-01 peer-focus:text-sm font-patrick"
                            >
                                FirstName
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                autoComplete="off"
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={userState?.lastName || ''}
                                onChange={handleChange}
                                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-brown-01 focus:outline-none focus:border-brown-01 font-patrick"
                                placeholder="lastName"
                            />
                            <label
                                htmlFor="name"
                                className="ml-1 absolute left-0 -top-3.5 text-brown-01 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-brown-01 peer-focus:text-sm font-patrick"
                            >
                                LastName
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                autoComplete="off"
                                id="email"
                                name="email"
                                type="text"
                                value={userState?.email || ''}
                                onChange={handleChange}
                                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-brown-01 focus:outline-none focus:border-brown-01 font-patrick"
                                placeholder="email"
                            />
                            <label
                                htmlFor="name"
                                className="ml-1 absolute left-0 -top-3.5 text-brown-01 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-brown-01 peer-focus:text-sm font-patrick"
                            >
                                Name
                            </label>
                        </div>
                    </div>
                </div>
                <div className="py-1 text-base leading-6 space-y-4 text-brown-01 sm:text-lg sm:leading-7">
                    <div className="relative">
                        <button
                            className="bg-brown-02 text-brown-01 hover:bg-brown-01 hover:text-brown-02 font-patrick rounded-md px-2 py-1"
                            onClick={handleUpdateProduct}
                        >
                            {user ? "Update" : "Add"}
                        </button>
                        <button
                            className="bg-gray-200 text-brown-01 hover:bg-gray-300 hover:text-gray-700 font-patrick rounded-md px-2 py-1 ml-2"
                            onClick={onPress}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserModal;
