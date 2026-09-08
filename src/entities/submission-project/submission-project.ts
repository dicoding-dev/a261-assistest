import PackageJson from "./package-json";
import ProjectFramework from "./project-framework";

export default interface SubmissionProject {
    packageJsonContent: PackageJson,
    packageJsonPath: string,
    runnerCommand: string,
    framework: ProjectFramework
}
