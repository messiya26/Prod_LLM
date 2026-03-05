import { LiveService } from "./live.service";
import { CreateLiveSessionDto, UpdateLiveSessionDto } from "./live.dto";
export declare class LiveController {
    private readonly svc;
    constructor(svc: LiveService);
    findAll(): Promise<({
        _count: {
            attendees: number;
        };
    } & {
        id: string;
        title: string;
        description: string | null;
        platform: import(".prisma/client").$Enums.LivePlatform;
        status: import(".prisma/client").$Enums.LiveStatus;
        meetingUrl: string | null;
        meetingId: string | null;
        roomName: string;
        hostId: string;
        courseId: string | null;
        maxAttendees: number;
        scheduledAt: Date;
        startedAt: Date | null;
        endedAt: Date | null;
        duration: number | null;
        replayUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findUpcoming(): Promise<({
        _count: {
            attendees: number;
        };
    } & {
        id: string;
        title: string;
        description: string | null;
        platform: import(".prisma/client").$Enums.LivePlatform;
        status: import(".prisma/client").$Enums.LiveStatus;
        meetingUrl: string | null;
        meetingId: string | null;
        roomName: string;
        hostId: string;
        courseId: string | null;
        maxAttendees: number;
        scheduledAt: Date;
        startedAt: Date | null;
        endedAt: Date | null;
        duration: number | null;
        replayUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findPast(): Promise<({
        _count: {
            attendees: number;
        };
    } & {
        id: string;
        title: string;
        description: string | null;
        platform: import(".prisma/client").$Enums.LivePlatform;
        status: import(".prisma/client").$Enums.LiveStatus;
        meetingUrl: string | null;
        meetingId: string | null;
        roomName: string;
        hostId: string;
        courseId: string | null;
        maxAttendees: number;
        scheduledAt: Date;
        startedAt: Date | null;
        endedAt: Date | null;
        duration: number | null;
        replayUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findMyLive(req: any): Promise<({
        _count: {
            attendees: number;
        };
    } & {
        id: string;
        title: string;
        description: string | null;
        platform: import(".prisma/client").$Enums.LivePlatform;
        status: import(".prisma/client").$Enums.LiveStatus;
        meetingUrl: string | null;
        meetingId: string | null;
        roomName: string;
        hostId: string;
        courseId: string | null;
        maxAttendees: number;
        scheduledAt: Date;
        startedAt: Date | null;
        endedAt: Date | null;
        duration: number | null;
        replayUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findById(id: string): Promise<({
        attendees: {
            id: string;
            userId: string;
            sessionId: string;
            joinedAt: Date;
            leftAt: Date | null;
        }[];
        _count: {
            attendees: number;
        };
    } & {
        id: string;
        title: string;
        description: string | null;
        platform: import(".prisma/client").$Enums.LivePlatform;
        status: import(".prisma/client").$Enums.LiveStatus;
        meetingUrl: string | null;
        meetingId: string | null;
        roomName: string;
        hostId: string;
        courseId: string | null;
        maxAttendees: number;
        scheduledAt: Date;
        startedAt: Date | null;
        endedAt: Date | null;
        duration: number | null;
        replayUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    create(req: any, dto: CreateLiveSessionDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        platform: import(".prisma/client").$Enums.LivePlatform;
        status: import(".prisma/client").$Enums.LiveStatus;
        meetingUrl: string | null;
        meetingId: string | null;
        roomName: string;
        hostId: string;
        courseId: string | null;
        maxAttendees: number;
        scheduledAt: Date;
        startedAt: Date | null;
        endedAt: Date | null;
        duration: number | null;
        replayUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateLiveSessionDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        platform: import(".prisma/client").$Enums.LivePlatform;
        status: import(".prisma/client").$Enums.LiveStatus;
        meetingUrl: string | null;
        meetingId: string | null;
        roomName: string;
        hostId: string;
        courseId: string | null;
        maxAttendees: number;
        scheduledAt: Date;
        startedAt: Date | null;
        endedAt: Date | null;
        duration: number | null;
        replayUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    start(id: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        platform: import(".prisma/client").$Enums.LivePlatform;
        status: import(".prisma/client").$Enums.LiveStatus;
        meetingUrl: string | null;
        meetingId: string | null;
        roomName: string;
        hostId: string;
        courseId: string | null;
        maxAttendees: number;
        scheduledAt: Date;
        startedAt: Date | null;
        endedAt: Date | null;
        duration: number | null;
        replayUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    end(id: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        platform: import(".prisma/client").$Enums.LivePlatform;
        status: import(".prisma/client").$Enums.LiveStatus;
        meetingUrl: string | null;
        meetingId: string | null;
        roomName: string;
        hostId: string;
        courseId: string | null;
        maxAttendees: number;
        scheduledAt: Date;
        startedAt: Date | null;
        endedAt: Date | null;
        duration: number | null;
        replayUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    cancel(id: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        platform: import(".prisma/client").$Enums.LivePlatform;
        status: import(".prisma/client").$Enums.LiveStatus;
        meetingUrl: string | null;
        meetingId: string | null;
        roomName: string;
        hostId: string;
        courseId: string | null;
        maxAttendees: number;
        scheduledAt: Date;
        startedAt: Date | null;
        endedAt: Date | null;
        duration: number | null;
        replayUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        platform: import(".prisma/client").$Enums.LivePlatform;
        status: import(".prisma/client").$Enums.LiveStatus;
        meetingUrl: string | null;
        meetingId: string | null;
        roomName: string;
        hostId: string;
        courseId: string | null;
        maxAttendees: number;
        scheduledAt: Date;
        startedAt: Date | null;
        endedAt: Date | null;
        duration: number | null;
        replayUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    join(req: any, id: string): Promise<{
        id: string;
        userId: string;
        sessionId: string;
        joinedAt: Date;
        leftAt: Date | null;
    }>;
    leave(req: any, id: string): Promise<{
        id: string;
        userId: string;
        sessionId: string;
        joinedAt: Date;
        leftAt: Date | null;
    }>;
}
