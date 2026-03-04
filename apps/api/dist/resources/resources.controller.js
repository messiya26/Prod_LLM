"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourcesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const resources_service_1 = require("./resources.service");
const resources_dto_1 = require("./resources.dto");
let ResourcesController = class ResourcesController {
    constructor(svc) {
        this.svc = svc;
    }
    getCourseResources(courseId) {
        return this.svc.getCourseResources(courseId);
    }
    addResource(courseId, dto) {
        return this.svc.addResource(courseId, dto);
    }
    updateResource(id, dto) {
        return this.svc.updateResource(id, dto);
    }
    deleteResource(id) {
        return this.svc.deleteResource(id);
    }
    getCourseQuiz(courseId) {
        return this.svc.getCourseQuiz(courseId);
    }
    createOrUpdateQuiz(courseId, dto) {
        return this.svc.createOrUpdateQuiz(courseId, dto);
    }
    addQuestion(quizId, dto) {
        return this.svc.addQuestion(quizId, dto);
    }
    deleteQuestion(id) {
        return this.svc.deleteQuestion(id);
    }
    submitQuiz(quizId, dto, req) {
        return this.svc.submitQuiz(req.user.id, quizId, dto);
    }
    getMyAttempts(quizId, req) {
        return this.svc.getMyAttempts(req.user.id, quizId);
    }
    markComplete(lessonId, body, req) {
        return this.svc.markLessonComplete(req.user.id, lessonId, body.enrollmentId);
    }
    getCompleted(enrollmentId, req) {
        return this.svc.getCompletedLessons(req.user.id, enrollmentId);
    }
};
exports.ResourcesController = ResourcesController;
__decorate([
    (0, common_1.Get)("course/:courseId"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("courseId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "getCourseResources", null);
__decorate([
    (0, common_1.Post)("course/:courseId"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("courseId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, resources_dto_1.CreateResourceDto]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "addResource", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "updateResource", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "deleteResource", null);
__decorate([
    (0, common_1.Get)("quiz/course/:courseId"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("courseId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "getCourseQuiz", null);
__decorate([
    (0, common_1.Post)("quiz/course/:courseId"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("courseId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, resources_dto_1.CreateQuizDto]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "createOrUpdateQuiz", null);
__decorate([
    (0, common_1.Post)("quiz/:quizId/questions"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("quizId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, resources_dto_1.CreateQuestionDto]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "addQuestion", null);
__decorate([
    (0, common_1.Delete)("quiz/questions/:id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "deleteQuestion", null);
__decorate([
    (0, common_1.Post)("quiz/:quizId/submit"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("quizId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, resources_dto_1.SubmitQuizDto, Object]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "submitQuiz", null);
__decorate([
    (0, common_1.Get)("quiz/:quizId/attempts"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("quizId")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "getMyAttempts", null);
__decorate([
    (0, common_1.Post)("lessons/:lessonId/complete"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("lessonId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "markComplete", null);
__decorate([
    (0, common_1.Get)("lessons/completed/:enrollmentId"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("enrollmentId")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "getCompleted", null);
exports.ResourcesController = ResourcesController = __decorate([
    (0, common_1.Controller)("resources"),
    __metadata("design:paramtypes", [resources_service_1.ResourcesService])
], ResourcesController);
//# sourceMappingURL=resources.controller.js.map