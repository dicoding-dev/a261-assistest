import PostmanRunner from "./postman-runner";
import SubmissionProject from "../../entities/submission-project/submission-project";
import ProjectPath from "../../entities/project-path/project-path";
import Server from "../server/server";
import * as collection from '../../../test/postman/postman_collection.json'
import * as environment from '../../../test/postman/postman_environment.json'

describe('postman runner test', () => {

    let activeServer

    afterEach(async () => {
        await activeServer.stop()
    })


    it('should return [] when no error found', async function () {
        await runServer('./test/student-project/passed-project')

        const postmanRunner = new PostmanRunner(collection, environment)
        const failResult = await postmanRunner.run()

        expect(failResult).toStrictEqual([])

    });
    it('should return array object when test have error', async function () {
        await runServer('./test/student-project/error-project')

        const postmanRunner = new PostmanRunner(collection, environment)
        const failResult = await postmanRunner.run()

        expect(failResult).toStrictEqual(
            [
                {
                    name: "Get Root",
                    tests: [
                        {
                            message: "expected response to have status code 200 but got 404",
                            test: "status code should be 200",
                        },
                        {
                            message: "Unexpected token 'H' at 1:1\nHello World\n^",
                            test: "response body should be an object",
                        },
                    ],
                },
                {
                    name: "Not Found",
                    tests: [{
                        message: "expected response to have status code 404 but got 200",
                        test: "status code should be 200"
                    }],
                },
            ]
        )
    });

    async function runServer(submissionPath: string) {
        const projectPath = new ProjectPath(submissionPath)
        const submissionProject = new SubmissionProject(projectPath, 'localhost', 5000, 'start')
        const server = new Server()
        await server.run(submissionProject)
        activeServer = server
    }
})