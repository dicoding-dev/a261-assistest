import getSubmissionRequirement from "../../config/submission-requirement";
import ReportGenerator from "./report-generator";
import ReviewResult, {ReviewResultStatus} from "../../entities/review-result/course-submission-review/review-result";
import * as fs from "fs";

function itShouldMeetAGRSReportSpec(report: any): void {
    expect(report.submission_id).toBeDefined()
    expect(typeof report.submission_id).toEqual('number')
    expect(report.message).toBeDefined()
    expect(typeof report.message).toEqual('string')
    expect(report.rating).toBeDefined()
    expect(typeof report.rating).toEqual('number')
    expect(report.is_passed).toBeDefined()
    expect(typeof report.is_passed).toEqual('boolean')
    expect(report.is_draft).toBeDefined()
    expect(report.checklist_keys).toBeDefined()
    expect(Array.isArray(report.checklist_keys)).toEqual(true)
}

describe('checklist id resolver test', () => {

    it('should generate report properly', function () {
        const projectTestPath = './test/student-project/project-with-correct-autoreview-config';
        const reportGenerator = new ReportGenerator(projectTestPath)

        const submissionRequirement = getSubmissionRequirement()
        submissionRequirement.api_can_delete_book.status = true
        submissionRequirement.api_can_update_book.status = true
        submissionRequirement.api_can_get_detail_book.status = true
        submissionRequirement.api_can_get_all_book.status = true
        submissionRequirement.api_can_insert_book.status = true
        submissionRequirement.project_have_correct_runner_script.status = true
        submissionRequirement.project_have_correct_port.status = true


        const reviewResult: ReviewResult = {
            rating: 5,
            status: ReviewResultStatus.Approve,
            checklist: submissionRequirement,
            message: 'Selamat',
        }

        reportGenerator.generate(reviewResult, projectTestPath)

        const result = JSON.parse(fs.readFileSync(`${projectTestPath}/report.json`).toString())[0]

        itShouldMeetAGRSReportSpec(result)

        expect(result.checklist_keys).toEqual([
            "project_have_correct_port",
            "project_have_correct_runner_script",
            "api_can_insert_book",
            "api_can_get_all_book",
            "api_can_get_detail_book",
            "api_can_update_book",
            "api_can_delete_book"
        ])
        expect(result.message).toStrictEqual('<p>Hallo <strong>snder12</strong>, terima kasih telah sabar menunggu. Kami membutuhkan waktu untuk bisa memberikan <em>feedback</em> sekomprehensif mungkin kepada setiap peserta kelas. Dalam kesempatan ini ada &nbsp;4 (empat) hal yang ingin kami sampaikan.&nbsp;</p><p><strong>Pertama</strong>, kami ingin mengucapkan selamat! Karena kamu telah menyelesaikan tugas submission dari kelas Belajar Membuat Aplikasi Back-End untuk Pemula. Jangan lihat bintang yang kamu raih, tapi lihat kemajuan yang sudah kamu capai. Ingat semua <em>expert&nbsp;</em>dahulu pemula.&nbsp;</p><p><strong>K</strong><strong>edua</strong>, kamu boleh bangga karena telah menyelesaikan submission sesuai dengan kriteria yang telah kami tentukan. Mumpung masih hangat semangatnya langsung lanjut kelas selanjutnya yaitu <a href="https://www.dicoding.com/academies/266">Architecting on AWS (Membangun Arsitektur AWS di Cloud)</a> atau <a href="https://www.dicoding.com/academies/271">Belajar Fundamental Aplikasi Back-End</a>.&nbsp;</p><p><strong>Ketiga</strong>, beberapa lulusan tidak tahu mereka memiliki akses kelas selamanya. Sebagai informasi kelas Dicoding selalu <em>update&nbsp;</em>sehingga memiliki perbedaan minimal 30% dari sejak kelas dirilis. Silakan mampir kembali untuk melihat materi saat kamu membutuhkan <em>update</em>.&nbsp;</p><p><strong>K</strong><strong>eempat</strong>, karena sudah praktik langsung maka kamu sudah menguasai ilmu kelas dasar ini antara 75-90%. Salah satu cara agar meningkatkan penguasaan ilmu agar bisa lebih maksimal (&gt;90%) adalah dengan memperbanyak latihan atau mengajarkan ilmu kepada orang lain.</p><p>Salah satu misi Dicoding adalah menyebarkan ilmu yang bermanfaat. Kami berusaha membangun kurikulum standar global dengan harapan agar developer Indonesia bisa menjadi jawara di negeri sendiri. Namun misi ini tidak akan tercapai tanpa kolaborasi dari kita semua.</p><hr><p>Supaya aplikasimu menjadi lebih baik lagi, berikut <em>beberapa</em> <em>catatan</em> terkait submission kamu:</p><ul>Selamat</ul><hr><p dir="ltr">Silakan berkunjung ke <a href="https://www.dicoding.com/academies/261/discussions" rel="noopener noreferrer" target="_blank">forum diskusi</a> untuk mengasah kembali penguasaan ilmu kamu dan membuat ilmu kamu bisa semakin bermanfaat dengan membantu developer yang lain.&nbsp;</p><p dir="ltr">Terima kasih telah membantu misi kami. Kesuksesan developer Indonesia adalah energi bagi kami. Jika memiliki pertanyaan terkait hasil submission, silakan mengikuti prosedur&nbsp;<a href="https://help.dicoding.com/academy-dicoding/prosedur-banding-hasil-review-submission-kelas" rel="noopener noreferrer" target="_blank">berikut</a>.</p><hr><p style="text-align: right;"><em>Salam</em></p><p style="text-align: right;"><span style="color: rgb(226, 80, 65);">Dicoding Reviewer</span></p>')
    });

    describe('when student got reject', () => {
        // why null? because I expect grading mode is set in autograder runner level
        it('should set `is_draft` to null when rejected count below 3', () => {
            const projectTestPath = './test/student-project/rejection-bellow-3';
            const reportGenerator = new ReportGenerator(projectTestPath)

            const submissionRequirement = getSubmissionRequirement()

            submissionRequirement.api_can_delete_book.status = false
            submissionRequirement.api_can_update_book.status = false
            submissionRequirement.api_can_get_detail_book.status = false
            submissionRequirement.api_can_get_all_book.status = true
            submissionRequirement.api_can_insert_book.status = true
            submissionRequirement.project_have_correct_runner_script.status = true
            submissionRequirement.project_have_correct_port.status = true


            const reviewResult: ReviewResult = {
                rating: 0,
                status: ReviewResultStatus.Reject,
                checklist: submissionRequirement,
                message: 'Maaf',
            }

            reportGenerator.generate(reviewResult, projectTestPath);

            const result = JSON.parse(fs.readFileSync(`${projectTestPath}/report.json`).toString())[0]
            itShouldMeetAGRSReportSpec(result);
            expect(result.is_draft).toBeNull()
        });

        it('should set `is_draft` to true when rejected count is 3 or above', () => {
            const projectTestPath = './test/student-project/rejection-is-3';
            const reportGenerator = new ReportGenerator(projectTestPath)

            const submissionRequirement = getSubmissionRequirement()

            submissionRequirement.api_can_delete_book.status = false
            submissionRequirement.api_can_update_book.status = false
            submissionRequirement.api_can_get_detail_book.status = false
            submissionRequirement.api_can_get_all_book.status = true
            submissionRequirement.api_can_insert_book.status = true
            submissionRequirement.project_have_correct_runner_script.status = true
            submissionRequirement.project_have_correct_port.status = true


            const reviewResult: ReviewResult = {
                rating: 5,
                status: ReviewResultStatus.Reject,
                checklist: submissionRequirement,
                message: 'Maaf',
            }

            reportGenerator.generate(reviewResult, projectTestPath);

            const result = JSON.parse(fs.readFileSync(`${projectTestPath}/report.json`).toString())[0]
            itShouldMeetAGRSReportSpec(result);
            expect(result.is_draft).toEqual(true);
        });

        it('should set `is_draft` to true and set special message when rejected count is 5 or above', () => {
            const projectTestPath = './test/student-project/rejection-is-5';
            const reportGenerator = new ReportGenerator(projectTestPath)

            const submissionRequirement = getSubmissionRequirement()

            submissionRequirement.api_can_delete_book.status = false
            submissionRequirement.api_can_update_book.status = false
            submissionRequirement.api_can_get_detail_book.status = false
            submissionRequirement.api_can_get_all_book.status = true
            submissionRequirement.api_can_insert_book.status = true
            submissionRequirement.project_have_correct_runner_script.status = true
            submissionRequirement.project_have_correct_port.status = true


            const reviewResult: ReviewResult = {
                rating: 5,
                status: ReviewResultStatus.Reject,
                checklist: submissionRequirement,
                message: 'Maaf',
            }


            reportGenerator.generate(reviewResult, projectTestPath);

            const result = JSON.parse(fs.readFileSync(`${projectTestPath}/report.json`).toString())[0]
            itShouldMeetAGRSReportSpec(result);
            expect(result.is_draft).toEqual(true);
            expect(result.message).toEqual('<p></p>');
            expect(result.note).toEqual('Dear reviewer, karena siswa sudah di-reject 5 kali atau lebih. Minta tolong review secara lebih intens ya! ^_^')
        })
    });

    describe('when student got approve', () => {
        it('should set `is_draft` to null when rejected count below 3', () => {
            const projectTestPath = './test/student-project/rejection-bellow-3';
            const reportGenerator = new ReportGenerator(projectTestPath)

            const submissionRequirement = getSubmissionRequirement()

            submissionRequirement.api_can_delete_book.status = true
            submissionRequirement.api_can_update_book.status = true
            submissionRequirement.api_can_get_detail_book.status = true
            submissionRequirement.api_can_get_all_book.status = true
            submissionRequirement.api_can_insert_book.status = true
            submissionRequirement.project_have_correct_runner_script.status = true
            submissionRequirement.project_have_correct_port.status = true


            const reviewResult: ReviewResult = {
                rating: 5,
                status: ReviewResultStatus.Approve,
                checklist: submissionRequirement,
                message: 'Maaf',
            }

            reportGenerator.generate(reviewResult, projectTestPath);

            const result = JSON.parse(fs.readFileSync(`${projectTestPath}/report.json`).toString())[0]
            itShouldMeetAGRSReportSpec(result);
            expect(result.is_draft).toBeNull()
        });

        it('should set `is_draft` to null when rejected count is 3 or above', () => {
            const projectTestPath = './test/student-project/rejection-is-3';
            const reportGenerator = new ReportGenerator(projectTestPath)

            const submissionRequirement = getSubmissionRequirement()

            submissionRequirement.api_can_delete_book.status = true
            submissionRequirement.api_can_update_book.status = true
            submissionRequirement.api_can_get_detail_book.status = true
            submissionRequirement.api_can_get_all_book.status = true
            submissionRequirement.api_can_insert_book.status = true
            submissionRequirement.project_have_correct_runner_script.status = true
            submissionRequirement.project_have_correct_port.status = true


            const reviewResult: ReviewResult = {
                rating: 5,
                status: ReviewResultStatus.Approve,
                checklist: submissionRequirement,
                message: 'Maaf',
            }

            reportGenerator.generate(reviewResult, projectTestPath);

            const result = JSON.parse(fs.readFileSync(`${projectTestPath}/report.json`).toString())[0]
            itShouldMeetAGRSReportSpec(result);
            expect(result.is_draft).toBeNull()
        });

        it('should set `is_draft` to null when rejected count is 5 or above', () => {
            const projectTestPath = './test/student-project/rejection-is-5';
            const reportGenerator = new ReportGenerator(projectTestPath)

            const submissionRequirement = getSubmissionRequirement()

            submissionRequirement.api_can_delete_book.status = true
            submissionRequirement.api_can_update_book.status = true
            submissionRequirement.api_can_get_detail_book.status = true
            submissionRequirement.api_can_get_all_book.status = true
            submissionRequirement.api_can_insert_book.status = true
            submissionRequirement.project_have_correct_runner_script.status = true
            submissionRequirement.project_have_correct_port.status = true


            const reviewResult: ReviewResult = {
                rating: 5,
                status: ReviewResultStatus.Approve,
                checklist: submissionRequirement,
                message: 'Maaf',
            }

            reportGenerator.generate(reviewResult, projectTestPath);

            const result = JSON.parse(fs.readFileSync(`${projectTestPath}/report.json`).toString())[0]
            itShouldMeetAGRSReportSpec(result);
            expect(result.is_draft).toBeNull()
        });
    });
})

