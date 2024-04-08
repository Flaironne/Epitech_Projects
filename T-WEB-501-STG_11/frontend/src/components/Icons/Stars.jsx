export default function Stars({filled}) {

    return (filled ?
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 100 100">
        <polygon points="50,5 61.4,38.2 97.2,38.2 68.6,61.8 80,95 50,72 20,95 31.4,61.8 2.8,38.2 38.6,38.2" fill="#53599a" />
      </svg>
      :
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 100 100">
        <polygon points="50,5 61.4,38.2 97.2,38.2 68.6,61.8 80,95 50,72 20,95 31.4,61.8 2.8,38.2 38.6,38.2" fill="none" stroke="#53599a" stroke-width="3"/>
      </svg>
    );
  }
  