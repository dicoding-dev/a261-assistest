import ReviewResult, {ReviewResultStatus} from "../../entities/review-result/course-submission-review/review-result";
import * as fs from "fs";
import {existsSync, readFileSync, writeFileSync} from "fs";
import * as templates from "../../config/review-template.json";
import raiseDomainEvent from "../../common/domain-event";
import {join} from "path";

class ReportGenerator {
    private readonly reportPath: string;
    private result = []

    constructor(reportPath: string) {
        this.reportPath = reportPath;
    }

    generate(reviewResult: ReviewResult, submissionPath: string) {
        const isApproved = reviewResult.status === ReviewResultStatus.Approve

        const autoReviewConfig = this.getAutoReviewConfig(submissionPath)

        const isMassiveRejection = autoReviewConfig.rejected_count >= 5

        const isNeedSpecialAttention = isMassiveRejection && !isApproved;

        const summary = {
            submission_id: autoReviewConfig?.id,
            review_id: Date.now(),
            is_approved: isApproved,
            rating: reviewResult.rating,
            message: isNeedSpecialAttention ? '<p></p>' : this.getReviewMessageWithTemplate(reviewResult, autoReviewConfig),
            note: isNeedSpecialAttention ? 'Dear reviewer, karena siswa sudah di-reject 5 kali atau lebih. Minta tolong review secara lebih intens ya! ^_^' : undefined,
            submission_path: submissionPath,
            checklist: reviewResult.checklist,
            checklist_keys: this.getCompletedChecklist(reviewResult),
            is_passed: isApproved,
            is_draft: this.getDraftDecision(isApproved, autoReviewConfig),
        };

        this.result.push(summary);
        fs.mkdirSync(this.reportPath, {recursive: true});
        const fileReportPath = join(this.reportPath, 'report.json')

        writeFileSync(fileReportPath, JSON.stringify(this.result), {
            mode: '0664'
        })
        raiseDomainEvent('report generated')
    }

    private getDraftDecision(isApproved: boolean, autoReviewConfig: any): boolean | null {
        if (isApproved) {
            return null;
        }

        const rejectedCount = autoReviewConfig.rejected_count;

        if (rejectedCount < 3) {
            return null;
        }

        return true;
    }

    private getCompletedChecklist(reviewResult: ReviewResult) {
        return Object.keys(reviewResult.checklist)
            .filter(requirementName => reviewResult.checklist[requirementName].status)

    }

    getReviewMessageWithTemplate(reviewResult: ReviewResult, autoReviewConfig: any) {
        const mainTemplate = templates.find(template => template.courseId === autoReviewConfig?.course_id)

        if (!mainTemplate) {
            return reviewResult.message
        }

        let template: string
        if (reviewResult.status === ReviewResultStatus.Approve) {
            template = mainTemplate.approvalTemplate
        } else {
            template = mainTemplate.rejectionTemplate
        }

        return template
            .replace('$submitter_name', autoReviewConfig.submitter_name)
            .replace('$review_message', reviewResult.message)
    }


    private getAutoReviewConfig(projectPath: string): any | null {

        const configFilePath = `${projectPath}/auto-review-config.json`
        if (!existsSync(configFilePath)) {
            return
        }
        const getConfigFile = (configFilePath: string) => {
            try {
                return JSON.parse(readFileSync(configFilePath).toString())
            } catch {
                return null
            }
        }

        return getConfigFile(configFilePath)
    }
}

export default ReportGenerator
