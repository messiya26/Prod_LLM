import { PrismaService } from "../prisma";
import { CreateResourceDto, CreateQuizDto, CreateQuestionDto, SubmitQuizDto } from "./resources.dto";
export declare class ResourcesService {
    private prisma;
    constructor(prisma: PrismaService);
    getCourseResources(courseId: string): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        title: string;
        description: string | null;
        type: import(".prisma/client").$Enums.ResourceType;
        order: number;
        fileSize: number | null;
        duration: number | null;
        moduleId: string | null;
    }[]>;
    addResource(courseId: string, dto: CreateResourceDto): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        title: string;
        description: string | null;
        type: import(".prisma/client").$Enums.ResourceType;
        order: number;
        fileSize: number | null;
        duration: number | null;
        moduleId: string | null;
    }>;
    updateResource(id: string, dto: Partial<CreateResourceDto>): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        title: string;
        description: string | null;
        type: import(".prisma/client").$Enums.ResourceType;
        order: number;
        fileSize: number | null;
        duration: number | null;
        moduleId: string | null;
    }>;
    deleteResource(id: string): Promise<{
        deleted: boolean;
    }>;
    getCourseQuiz(courseId: string): Promise<({
        questions: {
            id: string;
            order: number;
            question: string;
            options: string;
            correctAnswer: string;
            explanation: string | null;
            quizId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        title: string;
        description: string | null;
        passingScore: number;
    }) | null>;
    createOrUpdateQuiz(courseId: string, dto: CreateQuizDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        title: string;
        description: string | null;
        passingScore: number;
    }>;
    addQuestion(quizId: string, dto: CreateQuestionDto): Promise<{
        id: string;
        order: number;
        question: string;
        options: string;
        correctAnswer: string;
        explanation: string | null;
        quizId: string;
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
