export interface SleepData {
  date: string;
  stage: string;
  duration: number;
}

export interface SleepStageDistribution {
  stage: string;
  count: number;
}

export interface DailyTotalSleep {
  date: string;
  duration: number;
}
