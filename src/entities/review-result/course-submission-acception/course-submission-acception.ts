import exceptionToReviewMessage from "../../../exception/exception-to-review-message";
import SubmissionRatingFactory from "../../../factories/submission-rating/submission-rating-factory";
import SubmissionCriteriaCheck, {ReviewChecklistResult} from "../submission-criteria-check/submission-criteria-check";


class CourseSubmissionAcception {
    private completedChecklist: Array<number>;
    private _rating = 0
    private _messages: string
    private submissionRatingGenerator: SubmissionRatingFactory;
    private readonly _reviewChecklistResults: ReviewChecklistResult[];
    private submissionCriteriaCheck: SubmissionCriteriaCheck;

    constructor(submissionCriteriaCheck: SubmissionCriteriaCheck, submissionRatingGenerator: SubmissionRatingFactory) {
        this.submissionRatingGenerator = submissionRatingGenerator;
        this._reviewChecklistResults = submissionCriteriaCheck.reviewChecklistResult;
        this.submissionCriteriaCheck = submissionCriteriaCheck
    }

    accept() {
        this._rating = this.submissionRatingGenerator.rating
        this._messages = this.getMessage()
    }

    private getMessage() {
        const messageFromEslint = this.getMessageFromEslint()
        const messageFromOptionalTest = this.getMessageFromOptionalTest()
        if (messageFromEslint || messageFromOptionalTest){
            return messageFromEslint + messageFromOptionalTest
        }
        return 'Congrats.'
    }


    private getMessageFromOptionalTest(): string {
        if (this.submissionCriteriaCheck.failurePostmanTest?.length > 0) {
            let container = ''
            this.submissionCriteriaCheck.failurePostmanTest.forEach(failedTest => {
                let list = `<li><b>${failedTest.name}</b><ul>`
                failedTest.tests.forEach(test => {
                    list += `<li>Nama test: ${test.test}<br>Pesan error: ${test.message}</li>`
                })
                container += `${list}</ul></li>`
            })
            return `Masih terdapat beberapa error pada kriteria optional <ul>${container}</ul>`
        }
        return ''
    }

    private getMessageFromEslint(): string {
        const eslintCheckResult = this.submissionRatingGenerator.eslintCheckResult
        if (!eslintCheckResult.isSuccess) {
            let message = exceptionToReviewMessage[eslintCheckResult.code]
            if (eslintCheckResult.code === 'ESLINT_ERROR') {
                const formattedLog = this.ellipsisEslintLogError(eslintCheckResult.reason)
                message += `<pre>${formattedLog}</pre>`
            }
            return message
        }

        return ''
    }

    //this function will create ellipsis between 10 first line and 10 last line if total line more than 10
    private ellipsisEslintLogError(eslintLog: string): string {
        const totalLines = eslintLog.split("\n").length
        if (totalLines > 20 && eslintLog.includes('Oops! Something went wrong')) {
            const firstIndexOfLine = 10
            const lastIndexOfLine = 10

            const firstIndex = eslintLog.split("\n", firstIndexOfLine).join("\n").length
            const lastIndex = eslintLog.split("\n", totalLines - lastIndexOfLine).join("\n").length
            return eslintLog.substring(0, firstIndex) + '\n\n...\n\n' + eslintLog.substring(lastIndex + 1);
        }

        return eslintLog
    }


    get messages(): string {
        return this._messages;
    }
    get rating(): number {
        return this._rating;
    }

    get reviewChecklistResults(): ReviewChecklistResult[] {
        return this._reviewChecklistResults;
    }
}

export default CourseSubmissionAcception