import { CertificatesService } from './certificates.service';
export declare class CertificatesController {
    private svc;
    constructor(svc: CertificatesService);
    getMy(req: any): Promise<{
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
    verify(id: string): Promise<{
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
    generate(enrollmentId: string, req: any): Promise<{
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
}
