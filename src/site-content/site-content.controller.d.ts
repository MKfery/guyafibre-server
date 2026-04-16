import { SiteContentService } from './site-content.service';
export declare class SiteContentController {
    private siteContentService;
    constructor(siteContentService: SiteContentService);
    findAll(): Promise<Record<string, any>>;
    findOne(section: string): Promise<any>;
    update(section: string, content: any, req: any): Promise<{
        id: string;
        updatedAt: Date;
        content: import("@prisma/client/runtime/library").JsonValue;
        updatedById: string | null;
        section: string;
    }>;
    reset(section: string, req: any): Promise<{
        id: string;
        updatedAt: Date;
        content: import("@prisma/client/runtime/library").JsonValue;
        updatedById: string | null;
        section: string;
    }>;
}
