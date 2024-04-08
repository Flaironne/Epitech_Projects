import "JQ/styles/components/Footer.css";
import Link from "next/link";

export default function Footer() {
  let year = new Date().getFullYear();

  return (
    <footer>
      <div className="content">
        <p>&copy; {year} Job Quest Inc. All Rights Reserved.</p>
        <p>
          <Link href="/legal-notice">Legal notice</Link>&nbsp;|&nbsp;
          <Link href="/privacy-policy">Privacy policy</Link>&nbsp;|&nbsp;
          <Link href="/cgus">Usage terms and conditions</Link>
        </p>
      </div>
    </footer>
  );
}
