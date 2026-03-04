import { Response } from "express";
export declare class UploadController {
    upload(file: Express.Multer.File): {
        url: string;
        filename: string;
        originalName: string;
        size: number;
        mimetype: string;
    };
    serve(folder: string, filename: string, res: Response): void | Response<any, Record<string, any>>;
}
