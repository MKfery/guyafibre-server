"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StatsService = class StatsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const devisThisMonth = await this.prisma.devis.count({
            where: { createdAt: { gte: startOfMonth } },
        });
        const devisLastMonth = await this.prisma.devis.count({
            where: {
                createdAt: {
                    gte: startOfLastMonth,
                    lte: endOfLastMonth,
                },
            },
        });
        const devisByStatus = await this.prisma.devis.groupBy({
            by: ['status'],
            _count: { status: true },
        });
        const devisPending = await this.prisma.devis.count({
            where: { status: 'PENDING' },
        });
        const devisInProgress = await this.prisma.devis.count({
            where: { status: 'IN_PROGRESS' },
        });
        const allDevis = await this.prisma.devis.findMany({
            select: { services: true },
        });
        const serviceCounts = {};
        for (const devis of allDevis) {
            for (const service of devis.services) {
                serviceCounts[service] = (serviceCounts[service] || 0) + 1;
            }
        }
        const topServices = Object.entries(serviceCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        const recentActivity = await this.prisma.activityLog.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { firstName: true, lastName: true },
                },
            },
        });
        const totalDevis = await this.prisma.devis.count();
        const acceptedDevis = await this.prisma.devis.count({
            where: { status: 'ACCEPTED' },
        });
        const conversionRate = totalDevis > 0 ? Math.round((acceptedDevis / totalDevis) * 100) : 0;
        const acceptedDevisWithAmount = await this.prisma.devis.findMany({
            where: { status: 'ACCEPTED', amount: { not: null } },
            select: { amount: true },
        });
        const revenueEstimated = acceptedDevisWithAmount.reduce((sum, d) => {
            const amount = parseFloat(d.amount?.replace(/[^\d.-]/g, '') || '0');
            return sum + amount;
        }, 0);
        return {
            devisThisMonth,
            devisLastMonth,
            devisChange: devisLastMonth > 0 ? Math.round(((devisThisMonth - devisLastMonth) / devisLastMonth) * 100) : 0,
            devisPending,
            devisInProgress,
            revenueEstimated,
            conversionRate,
            topServices,
            devisByStatus: Object.fromEntries(devisByStatus.map((s) => [s.status.toLowerCase(), s._count.status])),
            recentActivity: recentActivity.map((a) => ({
                id: a.id,
                action: a.action,
                entity: a.entity,
                description: a.description,
                user: a.user ? `${a.user.firstName} ${a.user.lastName}` : null,
                createdAt: a.createdAt,
            })),
        };
    }
    async getDevisStats(period) {
        const now = new Date();
        let startDate;
        switch (period) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'quarter':
                startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        const devis = await this.prisma.devis.findMany({
            where: { createdAt: { gte: startDate } },
            select: { createdAt: true, status: true },
        });
        const dailyStats = {};
        for (const d of devis) {
            const date = d.createdAt.toISOString().split('T')[0];
            if (!dailyStats[date]) {
                dailyStats[date] = { total: 0, accepted: 0, rejected: 0 };
            }
            dailyStats[date].total++;
            if (d.status === 'ACCEPTED')
                dailyStats[date].accepted++;
            if (d.status === 'REJECTED')
                dailyStats[date].rejected++;
        }
        return Object.entries(dailyStats)
            .map(([date, stats]) => ({ date, ...stats }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StatsService);
//# sourceMappingURL=stats.service.js.map