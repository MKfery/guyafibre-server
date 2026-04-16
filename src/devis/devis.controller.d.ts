import { Response } from 'express';
import { DevisService } from './devis.service';
import { CreateDevisDto, UpdateDevisStatusDto, AddNoteDto, RespondDevisDto, DevisQueryDto } from './dto';
export declare class DevisController {
    private devisService;
    constructor(devisService: DevisService);
    create(createDevisDto: CreateDevisDto, req: any): Promise<{
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
    exportCsv(query: DevisQueryDto, res: Response): Promise<void>;
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
    updateStatus(id: string, updateStatusDto: UpdateDevisStatusDto, req: any): Promise<{
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
    addNote(id: string, addNoteDto: AddNoteDto, req: any): Promise<{
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
    respond(id: string, respondDevisDto: RespondDevisDto, req: any): Promise<{
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
    assign(id: string, assignedToId: string, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
