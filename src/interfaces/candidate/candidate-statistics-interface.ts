export interface IUserActivityStatistics {
    appliedJobs: number;
    savedJobs: number;
    followedCompanies: number;
    monthlyActivity: IMonthlyActivity[];
}

export interface IMonthlyActivity {
    month: string;
    appliedJobs: number;
    savedJobs: number;
    followedCompanies: number;
}

