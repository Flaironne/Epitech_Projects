export default function Select({
  name,
  disableAll = false,
  options,
  defaultValue,
  onChange = () => {},
}) {
  return (
    <select name={name} id={name} className="form__select" onChange={onChange}>
      {!disableAll && <option value="">All {name.split("_")[0] + "s"}</option>}
      {options.map((option) => {
        return (
          <option
            key={option.id}
            value={`${option.id}`}
            selected={option.id == defaultValue}
          >
            {option.label}
          </option>
        );
      })}
    </select>
  );
}
