export default function Form({ onSubmit, method, children, className }) {
  return (
    <form
      method={method}
      className={`form ${className ?? ""}`}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
}
