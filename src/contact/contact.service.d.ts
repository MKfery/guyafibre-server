import { PrismaService } from '../prisma/prisma.service';
import { EmailTemplatesService } from '../email-templates/email-templates.service';
import { ActivityLogService } from '../logs/activity-log.service';
export interface CreateContactDto {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}
export declare class ContactService {
    private prisma;
    private emailTemplates;
    private activityLog;
    constructor(prisma: PrismaService, emailTemplates: EmailTemplatesService, activityLog: ActivityLogService);
    create(data: CreateContactDto, ipAddress?: string): Promise<{
        id: string;
        reference: string;
    }>;
    findAll(query: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        data: {
            id: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            reference: string;
            phone: string | null;
            subject: string;
            message: string;
            isRead: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            perPage: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        reference: string;
        phone: string | null;
        subject: string;
        message: string;
        isRead: boolean;
    } | null>;
    markAsRead(id: string, userId: string, ipAddress?: string): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        reference: string;
        phone: string | null;
        subject: string;
        message: string;
        isRead: boolean;
    }>;
    delete(id: string, userId: string, ipAddress?: string): Promise<void>;
}
