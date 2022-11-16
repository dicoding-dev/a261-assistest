import * as fs from "fs";
import ProjectErrorException from "../../exception/project-error-exception";
import SubmissionProjectFactory from "./submission-project-factory";

jest.mock('fs');
const mockFS: jest.Mocked<typeof fs> = <jest.Mocked<typeof fs>>fs

describe('create submission project test', () => {
    it('should throw error when project path not contain package.json', function () {
        expect(() => createSubmissionProjectFactory(null)).toThrow(new ProjectErrorException('PATH_NOT_CONTAIN_PACKAGE_JSON'))
    });

    it('should throw error when package.json cannot be parsed', function () {

        mockFS.readFileSync.mockReturnValue('{ missing curly braces')
        expect(() => createSubmissionProjectFactory('./xxxx')).toThrow(new ProjectErrorException('CANNOT_PARSE_PACKAGE_JSON'))
    });

    it('should throw error when package.json not contain scripts runner', function () {
        mockFS.readFileSync.mockReturnValue('{ }')
        expect(() => createSubmissionProjectFactory('./xxxx')).toThrow(new ProjectErrorException('PACKAGE_JSON_NOT_CONTAIN_SCRIPT_PROPERTY'))
    });


    it('should throw error when runner script not found', function () {
        mockFS.readFileSync.mockReturnValue('{ "scripts": { "start-dev": "node src/index.js" }}')
        expect(() => createSubmissionProjectFactory('.')).toThrow(new ProjectErrorException('RUNNER_SCRIPT_NOT_FOUND'))
    });

    it('should create submission project properly', function () {
        mockFS.readFileSync.mockReturnValue('{ "scripts": { "start": "node src/index.js" }}')
        const submissionProjectFactory = createSubmissionProjectFactory('/home/app/1234')
       const submissionProject = submissionProjectFactory.create()
        expect(submissionProject.packageJsonContent).toStrictEqual({ "scripts": { "start": "node src/index.js" }})
        expect(submissionProject.packageJsonPath).toStrictEqual('/home/app/1234')
    });

    const createSubmissionProjectFactory = (
        submissionPath = null,
    ) => {
        return new SubmissionProjectFactory(submissionPath);
    }
})