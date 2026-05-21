export const fetchLatestNFT = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/nfts");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des NFTs");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchLatestNFT error:", error);
    throw error;
  }
};
