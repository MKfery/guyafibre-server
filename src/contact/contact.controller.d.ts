import { ContactService, CreateContactDto } from './contact.service';
export declare class ContactController {
    private contactService;
    constructor(contactService: ContactService);
    create(createContactDto: CreateContactDto, req: any): Promise<{
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
    markAsRead(id: string, req: any): Promise<{
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
    remove(id: string, req: any): Promise<void>;
}
