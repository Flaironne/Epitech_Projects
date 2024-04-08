import useAuth from "JQ/hooks/auth";
import Loading from "./Loading";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { NextUIProvider } from "@nextui-org/react";

export default function Layout({ children, mainSize = null }) {
  const { isLoading, isLogged, isAdmin } = useAuth();

  return (
    <NextUIProvider>
      {isLoading ? (
        <div>
          <Loading full={true} />
        </div>
      ) : (
        <>
          <Navbar isLogged={isLogged} isAdmin={isAdmin} />
          <main style={mainSize === "lg" ? { maxWidth: "1400px" } : {}}>
            {children}
          </main>
          <Footer />
        </>
      )}
    </NextUIProvider>
  );
}
