import { PrismaService } from "../prisma";
export declare class ModulesService {
    private prisma;
    constructor(prisma: PrismaService);
    findByCourse(courseId: string): Promise<({
        lessons: {
            id: string;
            title: string;
            content: string | null;
            order: number;
            muxAssetId: string | null;
            muxPlaybackId: string | null;
            duration: number | null;
            moduleId: string;
        }[];
    } & {
        id: string;
        title: string;
        courseId: string;
        order: number;
    })[]>;
    createModule(courseId: string, dto: {
        title: string;
    }): Promise<{
        lessons: {
            id: string;
            title: string;
            content: string | null;
            order: number;
            muxAssetId: string | null;
            muxPlaybackId: string | null;
            duration: number | null;
            moduleId: string;
        }[];
    } & {
        id: string;
        title: string;
        courseId: string;
        order: number;
    }>;
    updateModule(id: string, dto: {
        title?: string;
        order?: number;
    }): Promise<{
        lessons: {
            id: string;
            title: string;
            content: string | null;
            order: number;
            muxAssetId: string | null;
            muxPlaybackId: string | null;
            duration: number | null;
            moduleId: string;
        }[];
    } & {
        id: string;
        title: string;
        courseId: string;
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
        content: string | null;
        order: number;
        muxAssetId: string | null;
        muxPlaybackId: string | null;
        duration: number | null;
        moduleId: string;
    }>;
    updateLesson(id: string, dto: {
        title?: string;
        content?: string;
        duration?: number;
        order?: number;
    }): Promise<{
        id: string;
        title: string;
        content: string | null;
        order: number;
        muxAssetId: string | null;
        muxPlaybackId: string | null;
        duration: number | null;
        moduleId: string;
    }>;
    deleteLesson(id: string): Promise<{
        deleted: boolean;
    }>;
}
