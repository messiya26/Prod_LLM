import { PrismaService } from "../prisma";
import { CreateResourceDto, CreateQuizDto, CreateQuestionDto, SubmitQuizDto } from "./resources.dto";
export declare class ResourcesService {
    private prisma;
    constructor(prisma: PrismaService);
    getCourseResources(courseId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ResourceType;
        title: string;
        courseId: string;
        description: string | null;
        order: number;
        duration: number | null;
        moduleId: string | null;
        url: string;
        fileSize: number | null;
    }[]>;
    addResource(courseId: string, dto: CreateResourceDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ResourceType;
        title: string;
        courseId: string;
        description: string | null;
        order: number;
        duration: number | null;
        moduleId: string | null;
        url: string;
        fileSize: number | null;
    }>;
    updateResource(id: string, dto: Partial<CreateResourceDto>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ResourceType;
        title: string;
        courseId: string;
        description: string | null;
        order: number;
        duration: number | null;
        moduleId: string | null;
        url: string;
        fileSize: number | null;
    }>;
    deleteResource(id: string): Promise<{
        deleted: boolean;
    }>;
    getCourseQuiz(courseId: string): Promise<({
        questions: {
            id: string;
            order: number;
            quizId: string;
            question: string;
            options: string;
            correctAnswer: string;
            explanation: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        courseId: string;
        description: string | null;
        passingScore: number;
    }) | null>;
    createOrUpdateQuiz(courseId: string, dto: CreateQuizDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        courseId: string;
        description: string | null;
        passingScore: number;
    }>;
    addQuestion(quizId: string, dto: CreateQuestionDto): Promise<{
        id: string;
        order: number;
        quizId: string;
        question: string;
        options: string;
        correctAnswer: string;
        explanation: string | null;
    }>;
    deleteQuestion(id: string): Promise<{
        deleted: boolean;
    }>;
    submitQuiz(userId: string, quizId: string, dto: SubmitQuizDto): Promise<{
        score: number;
        passed: boolean;
        correct: number;
        total: number;
        attempt: {
            id: string;
            createdAt: Date;
            userId: string;
            quizId: string;
            answers: string;
            score: number;
            passed: boolean;
        };
    }>;
    getMyAttempts(userId: string, quizId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        quizId: string;
        answers: string;
        score: number;
        passed: boolean;
    }[]>;
    markLessonComplete(userId: string, lessonId: string, enrollmentId: string): Promise<{
        id: string;
        userId: string;
        enrollmentId: string;
        lessonId: string;
        completed: boolean;
        watchedAt: Date;
    }>;
    getCompletedLessons(userId: string, enrollmentId: string): Promise<string[]>;
}
