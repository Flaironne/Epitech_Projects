export default function NavbarLink({ link, title, onClick }) {
  return (
    <a href={link ?? "#"} onClick={onClick}>
      {title}
    </a>
  );
}
