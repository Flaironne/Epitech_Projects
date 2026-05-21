export type TripRequest = {
  id: string;
  state: 'pending' | 'processing' | 'processed' | 'failed';
  pathfinder: {
    departure: {
      name: string;
      lat: number;
      lon: number;
    } | null;
    destination: {
      name: string;
      lat: number;
      lon: number;
    } | null;
    options: TripOption[];
  };
};

export type TripOption = {
  id: string;
  rank: number;
  duration: {
    human: string;
  };
  counts: {
    transfers: number;
  };
  stops: Array<{
    name: string;
    lat: number;
    lon: number;
  }>;
};
