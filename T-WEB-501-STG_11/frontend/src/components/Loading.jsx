import "JQ/styles/components/Loading.css";

export default function Loading({ full = false, style = {} }) {
  return (
    <div className={"loading" + (full ? " full" : "")} style={style}>
      <div className="loading__spinner"></div>
    </div>
  );
}
