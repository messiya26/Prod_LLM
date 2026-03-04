export declare enum LivePlatformDto {
    JITSI = "JITSI",
    ZOOM = "ZOOM",
    GOOGLE_MEET = "GOOGLE_MEET"
}
export declare class CreateLiveSessionDto {
    title: string;
    description?: string;
    platform: string;
    scheduledAt: string;
    courseId?: string;
    maxAttendees?: number;
    meetingUrl?: string;
}
export declare class UpdateLiveSessionDto {
    title?: string;
    description?: string;
    platform?: string;
    scheduledAt?: string;
    courseId?: string;
    maxAttendees?: number;
    meetingUrl?: string;
    replayUrl?: string;
    status?: string;
}
