export default function Hamburger({ onClick }) {
  return (
    <a className="menu-icon" onClick={() => onClick()}>
      <div></div>
      <div></div>
      <div></div>
    </a>
  );
}
