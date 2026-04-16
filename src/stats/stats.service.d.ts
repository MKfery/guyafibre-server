import { PrismaService } from '../prisma/prisma.service';
export declare class StatsService {
    private prisma;
    constructor(prisma: PrismaService);
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
