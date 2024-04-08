import "JQ/styles/components/Error.css";

export default function Error({ message }) {
  return (
    <div className="error">
      {Array.isArray(message) ? (
        message.map((message, index) => <p key={index}>{message}</p>)
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}
