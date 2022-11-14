import CourseSubmissionRejection from "./course-submission-rejection";
import ResultTestFailure from "../../../service/postman-runner/failure-test";
import RejectException from "../../../exception/reject-exception";
import RejectionType from "../rejection-type";
import InvariantException from "../../../exception/invariant-exception";

const minifyHtmlRegex = /<!--(.*?)-->|\s\B/gm
const reviewChecklistResults = []

describe('reject test', () => {
    it('should get message properly when rejection type is test error', function () {
        const failurePostmanTest: Array<ResultTestFailure> = [
            {
                name: '[Mandatory] Add Book With Complete Data',
                tests: [{
                    test: 'Add book with correct id',
                    message: 'Failed to add book, 404',
                }, {
                    test: 'Status code should 201',
                    message: 'Failed to add book, 404',
                }]
            }, {
                name: '[Mandatory] Get All Books',
                tests: [{
                    test: 'Status code should 200',
                    message: 'Failed to add book, 404',
                }]
            }
        ]
        const courseSubmissionRejection = new CourseSubmissionRejection(new RejectException(RejectionType.TestError,  failurePostmanTest), reviewChecklistResults)
        courseSubmissionRejection.reject()

        expect(courseSubmissionRejection.messages).toStrictEqual(`
                  Masih terdapat error yang terjadi saat posting testing dijalankan, error yang muncul ada postman adalah sebagai berikut
                    <ul>
                        <li><b>[Mandatory] Add Book With Complete Data</b>
                            <ul>
                                <li>Nama test: Add book with correct id<br>Pesan error: Failed to add book, 404</li>
                                <li>Nama test: Status code should 201<br>Pesan error: Failed to add book, 404</li>
                            </ul>
                        </li>
                        <li><b>[Mandatory] Get All Books</b>
                            <ul>
                                <li>Nama test: Status code should 200<br>Pesan error: Failed to add book, 404</li>
                            </ul>
                        </li>
                    </ul>Pastikan semua test yang bersifat mandatory bisa berjalan semua, silakan diperbaiki yaa.`
            .replace(minifyHtmlRegex, '').trim())
    });

    it('should get message properly when rejection type is project error', function () {
        const courseSubmissionRejection = new CourseSubmissionRejection( new RejectException(RejectionType.ProjectError, [], new InvariantException('Submission path is not found')), reviewChecklistResults)
        courseSubmissionRejection.reject()
        expect(courseSubmissionRejection.messages).toStrictEqual('Project yang kamu buat masih belum memenuhi kriteria submission, hal ini terjadi karena Submission path is not found')
    });

    it('should get message properly when rejection type is server error', function () {
        const courseSubmissionRejection = new CourseSubmissionRejection(new RejectException(RejectionType.ServerError,  [], new InvariantException('Port not 5000')), reviewChecklistResults)
        courseSubmissionRejection.reject()
        expect(courseSubmissionRejection.messages).toStrictEqual('Project yang kamu buat masih belum bisa dijalankan dengan baik, hal ini terjadi karena Port not 5000')
    });
})