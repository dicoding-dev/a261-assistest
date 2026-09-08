import ProjectFramework from "../entities/submission-project/project-framework";

export interface BestPracticeReference {
    name: string
    url: string
    description: string
}

const hapiReference: BestPracticeReference = {
    name: 'Hapi Framework',
    url: 'https://hapi.dev/tutorials/?lang=en_US',
    description: 'Kamu bisa eksplor tentang apa saja yang bisa digunakan pada framework Hapi.'
}

const expressReference: BestPracticeReference = {
    name: 'Express Framework',
    url: 'https://expressjs.com/en/guide/routing.html',
    description: 'Kamu bisa eksplor tentang apa saja yang bisa digunakan pada framework Express, mulai dari routing sampai middleware.'
}

const joiReference: BestPracticeReference = {
    name: 'Joi',
    url: 'https://joi.dev/',
    description: 'Jika kamu ingin membuat validasi data dengan mudah kamu juga bisa menggunakan library Joi.'
}

const expressValidatorReference: BestPracticeReference = {
    name: 'express-validator',
    url: 'https://express-validator.github.io/docs/',
    description: 'Jika kamu ingin membuat validasi data dengan mudah kamu juga bisa menggunakan library express-validator.'
}

const databaseReferences: BestPracticeReference[] = [
    {
        name: 'Postgres',
        url: 'https://www.postgresql.org/docs/current/index.html',
        description: 'Agar aplikasi yang kamu buat datanya bisa bertahan ketika server direstart, kamu bisa mempelajari PostgreSQL sebagai penyimpanan data.'
    },
    {
        name: 'node-postgres',
        url: 'https://node-postgres.com/',
        description: 'Untuk menghubungkan aplikasi nodejs dengan postgresql kamu bisa menggunakan library node-postgres.'
    }
]

const bestPracticeReference: Record<ProjectFramework, BestPracticeReference[]> = {
    [ProjectFramework.Hapi]: [hapiReference, joiReference, ...databaseReferences],
    [ProjectFramework.Express]: [expressReference, expressValidatorReference, ...databaseReferences],
    [ProjectFramework.Unknown]: [hapiReference, expressReference, joiReference, ...databaseReferences]
}

export default bestPracticeReference
