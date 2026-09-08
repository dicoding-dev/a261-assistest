import {execSync} from "child_process";
import {readdirSync} from "fs";
import {basename, sep} from "path";
import EslintCheckResult from "./eslint-check-result";
import SubmissionProject from "../../entities/submission-project/submission-project";

const eslintConfigFilePattern = /^(\.eslintrc(\.(c|m)?js|\.json|\.ya?ml)?|eslint\.config\.(c|m)?[jt]s)$/

class EslintChecker {
    check(submissionProject: SubmissionProject): EslintCheckResult {
        const packageJSONContent = submissionProject.packageJsonContent
        if (!packageJSONContent.dependencies?.eslint && !packageJSONContent.devDependencies?.eslint) {
            return {isSuccess: false, code: 'ESLINT_NOT_INSTALLED'}
        }

        if (!this.isEslintConfigAvailable(submissionProject)) {
            return {isSuccess: false, code: 'ESLINT_CONFIG_NOT_FOUND'}
        }

        try {
            const result = execSync('npx eslint ./ --rule \'linebreak-style:off\' --ignore-pattern \'eslint.config.*\'', {
                cwd: submissionProject.packageJsonPath,
                stdio: "pipe"
            })
            return {isSuccess: true, code: 'NO_ERROR_FROM_ESLINT', reason: result.toString()}
        } catch
            (e) {
            if (e.stderr.toString()) {
                return {isSuccess: false, code: 'ESLINT_ERROR', reason: e.stderr.toString()}
            }

            if (e.stdout.toString()) {
                return {isSuccess: false, code: 'ESLINT_ERROR', reason: e.stdout.toString()}
            }

            throw new Error('Error when check eslint' + e.message)
        }
    }

    /**
     * eslint stops reporting a missing config as an error as soon as any cli option is given,
     * so the config has to be looked for on the project itself instead of asking eslint about it.
     */
    private isEslintConfigAvailable(submissionProject: SubmissionProject): boolean {
        if (submissionProject.packageJsonContent.eslintConfig) {
            return true
        }

        return readdirSync(submissionProject.packageJsonPath, {recursive: true})
            .map(entry => entry.toString())
            .filter(entry => !entry.split(sep).includes('node_modules'))
            .some(entry => eslintConfigFilePattern.test(basename(entry)))
    }
}

export default EslintChecker
