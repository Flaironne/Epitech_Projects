import Hamburger from "JQ/components/Hamburger";
import HamburgerList from "./HamburgerList";
import { useState, useEffect } from "react";
import Image from "next/image";
import "JQ/styles/components/Nav.css";

export default function Navbar({ isLogged, isAdmin }) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    document.body.setAttribute("theme", localStorage.getItem("theme"));
  }, []);

  function toggleTheme() {
    if (document.body.getAttribute("theme") === "day") {
      document.body.setAttribute("theme", "night");
    } else {
      document.body.setAttribute("theme", "day");
    }
    localStorage.setItem("theme", document.body.getAttribute("theme"));
  }

  return (
    <nav>
      <div>
        <Image
          src="/jobquest.png"
          alt="JQ logo"
          width="50"
          height="50"
          onClick={toggleTheme}
          style={{ cursor: "pointer" }}
        />
        <a href="..">JOBQUEST</a>
      </div>
      <Hamburger onClick={() => toggleMenu()} />
      <HamburgerList isOpen={isOpen} isAdmin={isAdmin} isLogged={isLogged} />
    </nav>
  );
}
