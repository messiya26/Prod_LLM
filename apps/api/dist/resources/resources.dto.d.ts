export declare enum ResourceType {
    PDF = "PDF",
    AUDIO = "AUDIO",
    VIDEO = "VIDEO",
    DOCUMENT = "DOCUMENT"
}
export declare class CreateResourceDto {
    title: string;
    description?: string;
    type: ResourceType;
    url: string;
    fileSize?: number;
    duration?: number;
    order?: number;
    moduleId?: string;
}
export declare class CreateQuizDto {
    title: string;
    description?: string;
    passingScore?: number;
}
export declare class CreateQuestionDto {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
    order?: number;
}
export declare class SubmitQuizDto {
    answers: {
        questionId: string;
        answer: string;
    }[];
}
