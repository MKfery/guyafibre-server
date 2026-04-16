import { StatsService } from './stats.service';
export declare class StatsController {
    private statsService;
    constructor(statsService: StatsService);
    getDashboard(): Promise<{
        devisThisMonth: number;
        devisLastMonth: number;
        devisChange: number;
        devisPending: number;
        devisInProgress: number;
        revenueEstimated: number;
        conversionRate: number;
        topServices: {
            name: string;
            count: number;
        }[];
        devisByStatus: {
            [k: string]: number;
        };
        recentActivity: {
            id: string;
            action: string;
            entity: string;
            description: string;
            user: string | null;
            createdAt: Date;
        }[];
    }>;
    getDevisStats(period: string): Promise<{
        total: number;
        accepted: number;
        rejected: number;
        date: string;
    }[]>;
}
