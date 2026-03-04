import { ResourcesService } from "./resources.service";
import { CreateResourceDto, CreateQuizDto, CreateQuestionDto, SubmitQuizDto } from "./resources.dto";
export declare class ResourcesController {
    private readonly svc;
    constructor(svc: ResourcesService);
    getCourseResources(courseId: string): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ResourceType;
        title: string;
        description: string | null;
        courseId: string;
        order: number;
        duration: number | null;
        moduleId: string | null;
        fileSize: number | null;
    }[]>;
    addResource(courseId: string, dto: CreateResourceDto): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ResourceType;
        title: string;
        description: string | null;
        courseId: string;
        order: number;
        duration: number | null;
        moduleId: string | null;
        fileSize: number | null;
    }>;
    updateResource(id: string, dto: Partial<CreateResourceDto>): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ResourceType;
        title: string;
        description: string | null;
        courseId: string;
        order: number;
        duration: number | null;
        moduleId: string | null;
        fileSize: number | null;
    }>;
    deleteResource(id: string): Promise<{
        deleted: boolean;
    }>;
    getCourseQuiz(courseId: string): Promise<({
        questions: {
            options: string;
            id: string;
            order: number;
            question: string;
            correctAnswer: string;
            explanation: string | null;
            quizId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        courseId: string;
        passingScore: number;
    }) | null>;
    createOrUpdateQuiz(courseId: string, dto: CreateQuizDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        courseId: string;
        passingScore: number;
    }>;
    addQuestion(quizId: string, dto: CreateQuestionDto): Promise<{
        options: string;
        id: string;
        order: number;
        question: string;
        correctAnswer: string;
        explanation: string | null;
        quizId: string;
    }>;
    deleteQuestion(id: string): Promise<{
        deleted: boolean;
    }>;
    submitQuiz(quizId: string, dto: SubmitQuizDto, req: any): Promise<{
        score: number;
        passed: boolean;
        correct: number;
        total: number;
        attempt: {
            id: string;
            createdAt: Date;
            userId: string;
            answers: string;
            quizId: string;
            score: number;
            passed: boolean;
        };
    }>;
    getMyAttempts(quizId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        answers: string;
        quizId: string;
        score: number;
        passed: boolean;
    }[]>;
    markComplete(lessonId: string, body: {
        enrollmentId: string;
    }, req: any): Promise<{
        id: string;
        userId: string;
        enrollmentId: string;
        lessonId: string;
        completed: boolean;
        watchedAt: Date;
    }>;
    getCompleted(enrollmentId: string, req: any): Promise<string[]>;
}
