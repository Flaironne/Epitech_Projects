import {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import {
  User,
  fetchLogin,
  fetchMe,
  fetchModifyUsers,
  fetchRegister,
} from "../api/auth/authApi";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

interface IUserContext {
  token: string | null;
  user: User | null;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => void;
  login: (email: string, password: string) => void;
  modify: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    token: string
  ) => void;
  logout: () => void;
}

const UserContext = createContext<IUserContext>({} as IUserContext);

export const UserProvider = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => {
  const [token, setToken] = useLocalStorage("token", null);
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      fetchMe(token)
        .then((newUser) => {
          console.log(newUser);
          setUser(newUser.user);
        })
        .catch(() => {
          setUser(null);
          setToken(null);
        });
    } catch (error) {
      setUser(null);
      setToken(null);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const newUser = await fetchLogin(email, password);
      setToken(newUser.token);
      setUser(newUser.user);
    } catch (error) {}
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const newUser = await fetchRegister(email, password, firstName, lastName);
      setToken(newUser.token);
      setUser(newUser.user);
    } catch (error) {}
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  const modify = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    token: string
  ) => {
    try {
      const newUser = await fetchModifyUsers(
        email,
        password,
        firstName,
        lastName,
        token
      );
      setToken(newUser.token);
      setUser(newUser.user);
    } catch (error) {}
  };

  const contextValue = useMemo(
    () => ({ token, user, register, login, modify, logout }),
    [token, user]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
