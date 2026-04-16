import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../logs/activity-log.service';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

@Injectable()
export class MediasService {
  private uploadDir: string;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private activityLog: ActivityLogService,
  ) {
    this.uploadDir = this.config.get('UPLOAD_DIR') || './uploads';
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File, folder: string = 'general', userId: string, ipAddress?: string) {
    // Validate file
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Type de fichier non autorisé. Types acceptés: jpeg, png, webp, svg');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('Fichier trop volumineux. Taille max: 5MB');
    }

    // Generate unique filename
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    const filepath = path.join(this.uploadDir, filename);

    // Save file
    fs.writeFileSync(filepath, file.buffer);

    // Generate thumbnail (simplified - in production use sharp)
    let thumbnailUrl: string | null = null;
    // For now, thumbnail is the same as the original
    thumbnailUrl = `/api/medias/${filename}`;

    // Create media record
    const media = await this.prisma.media.create({
      data: {
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/api/medias/${filename}`,
        thumbnailUrl,
        folder,
        uploadedById: userId,
      },
    });

    await this.activityLog.log({
      action: 'UPLOAD',
      entity: 'Media',
      entityId: media.id,
      description: `Fichier "${file.originalname}" uploadé`,
      userId,
      ipAddress,
    });

    return media;
  }

  async uploadMultiple(files: Express.Multer.File[], folder: string = 'general', userId: string, ipAddress?: string) {
    const results = [];
    for (const file of files) {
      try {
        const media = await this.upload(file, folder, userId, ipAddress);
        results.push(media);
      } catch (error) {
        console.error(`Error uploading file ${file.originalname}:`, error);
      }
    }
    return results;
  }

  async findAll(query: { page?: number; limit?: number; folder?: string; search?: string }) {
    const { page = 1, limit = 20, folder, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (folder) where.folder = folder;
    if (search) {
      where.OR = [
        { originalName: { contains: search, mode: 'insensitive' } },
        { filename: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [medias, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
      this.prisma.media.count({ where }),
    ]);

    return {
      data: medias,
      meta: { total, page, perPage: limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
    if (!media) {
      throw new NotFoundException(`Média ${id} non trouvé`);
    }
    return media;
  }

  async getFile(filename: string): Promise<{ stream: fs.ReadStream; mimeType: string }> {
    const filepath = path.join(this.uploadDir, filename);
    if (!fs.existsSync(filepath)) {
      throw new NotFoundException('Fichier non trouvé');
    }

    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };

    return {
      stream: fs.createReadStream(filepath),
      mimeType: mimeTypes[ext] || 'application/octet-stream',
    };
  }

  async remove(id: string, userId: string, userRole: string, ipAddress?: string) {
    if (userRole !== 'SUPER_ADMIN') {
      throw new BadRequestException('Seuls les SUPER_ADMIN peuvent supprimer des médias');
    }

    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) {
      throw new NotFoundException(`Média ${id} non trouvé`);
    }

    // Delete file
    const filepath = path.join(this.uploadDir, media.filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    await this.prisma.media.delete({ where: { id } });

    await this.activityLog.log({
      action: 'DELETE',
      entity: 'Media',
      entityId: id,
      description: `Fichier "${media.originalName}" supprimé`,
      userId,
      ipAddress,
    });

    return { message: 'Média supprimé avec succès' };
  }
}