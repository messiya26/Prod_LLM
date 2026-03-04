export declare class CreateCourseDto {
    title: string;
    description: string;
    thumbnail?: string;
    level?: string;
    price?: number;
    categoryId: string;
    instructorId?: string;
}
export declare class UpdateCourseDto {
    title?: string;
    description?: string;
    thumbnail?: string;
    level?: string;
    price?: number;
    published?: boolean;
    categoryId?: string;
    instructorId?: string;
}
