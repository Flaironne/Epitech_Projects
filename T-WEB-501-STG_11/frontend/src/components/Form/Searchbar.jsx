export default function Searchbar({ name, value, placeholder }) {
  return (
    <input
      type="text"
      name={name}
      id={name}
      value={value}
      className="form__search"
      placeholder={placeholder ?? "Rechercher"}
    />
  );
}
