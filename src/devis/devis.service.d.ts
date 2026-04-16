import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../logs/activity-log.service';
import { EmailService } from '../email/email.service';
import { CreateDevisDto, UpdateDevisStatusDto, AddNoteDto, RespondDevisDto, DevisQueryDto } from './dto';
export declare class DevisService {
    private prisma;
    private activityLog;
    private emailService;
    constructor(prisma: PrismaService, activityLog: ActivityLogService, emailService: EmailService);
    create(createDevisDto: CreateDevisDto, ipAddress?: string): Promise<{
        id: string;
        reference: string;
        clientName: string;
        clientEmail: string;
        clientPhone: string;
        company: string | null;
        services: string[];
        location: string;
        address: string | null;
        description: string;
        urgency: import(".prisma/client").$Enums.Urgency;
        status: import(".prisma/client").$Enums.DevisStatus;
        amount: string | null;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string | null;
    }>;
    findAll(query: DevisQueryDto): Promise<{
        data: ({
            assignedTo: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            } | null;
            _count: {
                notes: number;
                responses: number;
            };
        } & {
            id: string;
            reference: string;
            clientName: string;
            clientEmail: string;
            clientPhone: string;
            company: string | null;
            services: string[];
            location: string;
            address: string | null;
            description: string;
            urgency: import(".prisma/client").$Enums.Urgency;
            status: import(".prisma/client").$Enums.DevisStatus;
            amount: string | null;
            createdAt: Date;
            updatedAt: Date;
            assignedToId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            perPage: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        notes: ({
            author: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            content: string;
            devisId: string;
            authorId: string;
        })[];
        responses: ({
            sentBy: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            sentAt: Date;
            devisId: string;
            subject: string;
            body: string;
            sentById: string;
        })[];
        assignedTo: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        reference: string;
        clientName: string;
        clientEmail: string;
        clientPhone: string;
        company: string | null;
        services: string[];
        location: string;
        address: string | null;
        description: string;
        urgency: import(".prisma/client").$Enums.Urgency;
        status: import(".prisma/client").$Enums.DevisStatus;
        amount: string | null;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string | null;
    }>;
    updateStatus(id: string, updateStatusDto: UpdateDevisStatusDto, userId: string, ipAddress?: string): Promise<{
        id: string;
        reference: string;
        clientName: string;
        clientEmail: string;
        clientPhone: string;
        company: string | null;
        services: string[];
        location: string;
        address: string | null;
        description: string;
        urgency: import(".prisma/client").$Enums.Urgency;
        status: import(".prisma/client").$Enums.DevisStatus;
        amount: string | null;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string | null;
    }>;
    addNote(id: string, addNoteDto: AddNoteDto, userId: string, ipAddress?: string): Promise<{
        author: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        devisId: string;
        authorId: string;
    }>;
    respond(id: string, respondDevisDto: RespondDevisDto, userId: string, ipAddress?: string): Promise<{
        sentBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        sentAt: Date;
        devisId: string;
        subject: string;
        body: string;
        sentById: string;
    }>;
    exportCsv(query: DevisQueryDto): Promise<string>;
    remove(id: string, userId: string, userRole: string, ipAddress?: string): Promise<{
        message: string;
    }>;
    assign(id: string, assignedToId: string, userId: string, ipAddress?: string): Promise<{
        id: string;
        reference: string;
        clientName: string;
        clientEmail: string;
        clientPhone: string;
        company: string | null;
        services: string[];
        location: string;
        address: string | null;
        description: string;
        urgency: import(".prisma/client").$Enums.Urgency;
        status: import(".prisma/client").$Enums.DevisStatus;
        amount: string | null;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string | null;
    }>;
}
