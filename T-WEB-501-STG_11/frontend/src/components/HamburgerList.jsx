import NavbarLink from "JQ/components/NavbarLink";
import "JQ/styles/components/HamburgerList.css";
import useAuth from "JQ/hooks/auth";

export default function HamburgerList({ isOpen, isLogged, isAdmin }) {
  const { logout } = useAuth();

  const handleLogout = async () => await logout();

  return (
    <div className={isOpen ? "menuO-list" : "menuC-list"}>
      <NavbarLink title="Companies" link="/companies" />
      {isLogged ? (
        <>
          <NavbarLink title="Saved jobs" link="/saved" />
          <NavbarLink title="Job applications" link="/applications" />
          {isAdmin ? (
            <>
              <NavbarLink title="Administration" link="/admin" />
              <NavbarLink title="Notifications" link="/notifications" />
            </>
          ) : null}
          <NavbarLink title="Account" link="/account" />
          <NavbarLink title="Logout" onClick={handleLogout} />
        </>
      ) : (
        <>
          <NavbarLink title="Login" link="/login" />
          <NavbarLink title="Register" link="/register" />
        </>
      )}
    </div>
  );
}
