import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Devis this month
    const devisThisMonth = await this.prisma.devis.count({
      where: { createdAt: { gte: startOfMonth } },
    });

    // Devis last month
    const devisLastMonth = await this.prisma.devis.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    // Devis by status
    const devisByStatus = await this.prisma.devis.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    // Devis pending and in progress
    const devisPending = await this.prisma.devis.count({
      where: { status: 'PENDING' },
    });
    const devisInProgress = await this.prisma.devis.count({
      where: { status: 'IN_PROGRESS' },
    });

    // Top services
    const allDevis = await this.prisma.devis.findMany({
      select: { services: true },
    });
    const serviceCounts: Record<string, number> = {};
    for (const devis of allDevis) {
      for (const service of devis.services) {
        serviceCounts[service] = (serviceCounts[service] || 0) + 1;
      }
    }
    const topServices = Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Recent activity
    const recentActivity = await this.prisma.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    // Calculate conversion rate (accepted / total)
    const totalDevis = await this.prisma.devis.count();
    const acceptedDevis = await this.prisma.devis.count({
      where: { status: 'ACCEPTED' },
    });
    const conversionRate = totalDevis > 0 ? Math.round((acceptedDevis / totalDevis) * 100) : 0;

    // Estimated revenue (sum of amounts for accepted devis)
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

  async getDevisStats(period: string) {
    const now = new Date();
    let startDate: Date;

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

    // Group by date
    const dailyStats: Record<string, { total: number; accepted: number; rejected: number }> = {};
    for (const d of devis) {
      const date = d.createdAt.toISOString().split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { total: 0, accepted: 0, rejected: 0 };
      }
      dailyStats[date].total++;
      if (d.status === 'ACCEPTED') dailyStats[date].accepted++;
      if (d.status === 'REJECTED') dailyStats[date].rejected++;
    }

    return Object.entries(dailyStats)
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}