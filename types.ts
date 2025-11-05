
export interface Meeting {
  date: string;
  book: string;
  exclude: boolean;
}

export interface Award {
  name: string;
  type: 'gold' | 'silver' | 'bronze';
  description: string;
}

export interface ResultsData {
  name: string;
  periodText: string;
  attendanceCount: number;
  awards: Award[];
}
