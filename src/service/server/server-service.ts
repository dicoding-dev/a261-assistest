import {ChildProcess, spawn} from "child_process";
import * as tcpPortUsed from 'tcp-port-used';
import ServerErrorHandler from "./server-error-handler";
import SubmissionProject from "../../entities/submission-project/submission-project";
import {host, port} from "../../config/backend-pemula-project-requirement";
import {SubmissionRequirement} from "../../config/submission-requirement";
import * as http from "http";
import raiseDomainEvent from "../../common/domain-event";

class ServerService {
    private _errorLog = [];
    private runningServer: ChildProcess;


    async run(submissionProject: SubmissionProject, submissionRequirement: SubmissionRequirement) {
        await this.validateBeforeStart()
        this.runningServer = spawn('npm', ['run', '--silent', submissionProject.runnerCommand], {cwd: submissionProject.packageJsonPath, detached: true})
        this.listenRunningServer(this.runningServer)

        try {
            await this.validateServerActive(500, 10000)
            submissionRequirement.project_have_correct_port.status = true
            raiseDomainEvent('server started')
        } catch (e) {
            const serverErrorHandler = new ServerErrorHandler(this._errorLog, submissionProject)
            await this.stop()
            serverErrorHandler.throwError()
        }
    }

    private listenRunningServer(runningServer: ChildProcess) {
        runningServer.stdout.on('data', async (data) => {
            if (process.env.DEBUG_MODE) {
                console.log('\x1b[32m%s\x1b[0m', `stdout ${data}`)
            }
        });

        runningServer.stderr.on('data', (data) => {
            this._errorLog.push(data.toString())
            if (process.env.DEBUG_MODE) {
                console.log('\x1b[31m%s\x1b[0m', `stderr ${data}`);
            }
        });

    }

    async stop() {
        try {
            process.kill(-this.runningServer.pid)
            this._errorLog = []
            await tcpPortUsed.waitUntilFree(port, 500, 4000)
            raiseDomainEvent('server stopped')
        } catch (e) {
            if (!e.message.includes('ESRCH') && !e.message.includes('ECONNRESET')){
                throw new Error(`Failed to kill port ${port}, error: ${e}`)
            }
        }
    }

    private async validateBeforeStart() {
        const isUsed = await tcpPortUsed.check(port, host)

        if (isUsed) {
            const isUsed = await tcpPortUsed.check(port, host)
            if (isUsed) throw new Error(`Port ${port} is not available`)
        }
    }

    private async validateServerActive(retryTimeMs, timeOutMs) {
        let timeOut = 0
        while (timeOut <= timeOutMs) {
            const isUrlActive = await new Promise((resolve, reject) => {
                http.get(`http://localhost:${port}`, () => {
                    resolve(true)
                }).on('error', async (e) => {
                    if (e.message.includes('ECONNREFUSED') && timeOut >= timeOutMs) {
                        reject('server not started in localhost:9000')
                    }
                    resolve(false)
                })
            })

            if (isUrlActive) {
                break
            }

            await new Promise(resolve => setTimeout(resolve, retryTimeMs));
            timeOut += retryTimeMs
        }
    }
}

export default ServerService
