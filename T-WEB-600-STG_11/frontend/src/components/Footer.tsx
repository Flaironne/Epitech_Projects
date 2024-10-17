import { FC } from "react";
import { Link } from "react-router-dom";
import { Footer, FooterLink, FooterLinkGroup } from "flowbite-react";
import logo from "../assets/logo.png";

const FooterNav: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Footer
      container
      className="rounded-none w-full bg-brown-01 flex items-center justify-between p-4"
    >
      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className="flex items-center text-4xl font-bold"
          data-test="main-logo"
        >
          <img className="h-16 w-auto" src={logo} alt="logo" />
        </Link>
        <span className="text-brown-02 text-xl font-bold font-patrick">
          © {currentYear} <span className="mx-1">|</span> EQuest™
        </span>
      </div>

      <FooterLinkGroup className="flex space-x-8">
        <Link
          to="/partnership"
          className="text-brown-02 hover:underline text-xl font-bold font-patrick"
        >
          Partnership
        </Link>
        <Link
          to="/about"
          className="text-brown-02 hover:underline text-xl font-bold font-patrick"
        >
          About
        </Link>
        <Link
          to="/privacy-policy"
          className="text-brown-02 hover:underline text-xl font-bold font-patrick"
        >
          Privacy Policy
        </Link>
        <Link
          to="/contact"
          className="text-brown-02 hover:underline text-xl font-bold font-patrick"
        >
          Contact
        </Link>
      </FooterLinkGroup>
    </Footer>
  );
};

export default FooterNav;
