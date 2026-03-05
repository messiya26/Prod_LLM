import { PrismaService } from '../prisma/prisma.service';
export declare class CertificatesService {
    private prisma;
    constructor(prisma: PrismaService);
    getByUser(userId: string): Promise<{
        id: string;
        userId: string;
        certificateId: string;
        courseId: string;
        studentName: string;
        courseName: string;
        instructorName: string | null;
        issuedAt: Date;
        grade: string | null;
        hoursCompleted: number;
        verificationHash: string;
        pdfUrl: string | null;
    }[]>;
    verify(certificateId: string): Promise<{
        valid: boolean;
        certificate: {
            id: string;
            userId: string;
            certificateId: string;
            courseId: string;
            studentName: string;
            courseName: string;
            instructorName: string | null;
            issuedAt: Date;
            grade: string | null;
            hoursCompleted: number;
            verificationHash: string;
            pdfUrl: string | null;
        } | null;
    }>;
    generate(enrollmentId: string, userId: string): Promise<{
        id: string;
        userId: string;
        certificateId: string;
        courseId: string;
        studentName: string;
        courseName: string;
        instructorName: string | null;
        issuedAt: Date;
        grade: string | null;
        hoursCompleted: number;
        verificationHash: string;
        pdfUrl: string | null;
    }>;
    private computeHash;
}
