export const fetchLogs = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/logs");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des logs");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchLogs error:", error);
    throw error;
  }
};
