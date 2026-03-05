import { PrismaService } from "../prisma";
export declare class ModulesService {
    private prisma;
    constructor(prisma: PrismaService);
    findByCourse(courseId: string): Promise<({
        lessons: {
            id: string;
            title: string;
            order: number;
            duration: number | null;
            moduleId: string;
            content: string | null;
            muxAssetId: string | null;
            muxPlaybackId: string | null;
        }[];
    } & {
        id: string;
        courseId: string;
        title: string;
        order: number;
    })[]>;
    createModule(courseId: string, dto: {
        title: string;
    }): Promise<{
        lessons: {
            id: string;
            title: string;
            order: number;
            duration: number | null;
            moduleId: string;
            content: string | null;
            muxAssetId: string | null;
            muxPlaybackId: string | null;
        }[];
    } & {
        id: string;
        courseId: string;
        title: string;
        order: number;
    }>;
    updateModule(id: string, dto: {
        title?: string;
        order?: number;
    }): Promise<{
        lessons: {
            id: string;
            title: string;
            order: number;
            duration: number | null;
            moduleId: string;
            content: string | null;
            muxAssetId: string | null;
            muxPlaybackId: string | null;
        }[];
    } & {
        id: string;
        courseId: string;
        title: string;
        order: number;
    }>;
    deleteModule(id: string): Promise<{
        deleted: boolean;
    }>;
    createLesson(moduleId: string, dto: {
        title: string;
        content?: string;
        duration?: number;
    }): Promise<{
        id: string;
        title: string;
        order: number;
        duration: number | null;
        moduleId: string;
        content: string | null;
        muxAssetId: string | null;
        muxPlaybackId: string | null;
    }>;
    updateLesson(id: string, dto: {
        title?: string;
        content?: string;
        duration?: number;
        order?: number;
    }): Promise<{
        id: string;
        title: string;
        order: number;
        duration: number | null;
        moduleId: string;
        content: string | null;
        muxAssetId: string | null;
        muxPlaybackId: string | null;
    }>;
    deleteLesson(id: string): Promise<{
        deleted: boolean;
    }>;
}
