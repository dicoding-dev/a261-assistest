import {SubmissionRequirement} from "../../../config/submission-requirement";

interface ReviewResult {
    rating: number,
    message: string,
    status: ReviewResultStatus,
    checklist: SubmissionRequirement,
    draft: boolean,
}

export enum ReviewResultStatus {
    Approve = "Approve",
    Reject = "Reject",
}

export default ReviewResult
