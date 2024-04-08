export default function Input({ name, value }) {
  return (
    <input
      type="text"
      name={name}
      id={name}
      className="form__input"
      value={value}
    />
  )
}
