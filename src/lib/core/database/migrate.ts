import type Database from '@tauri-apps/plugin-sql';
const migrations = import.meta.glob('./migrations/*.sql', { as: 'raw', eager: true });

export type ProxyMigrator = (migrationQueries: string[]) => Promise<void>;

export async function migrate(sqlite: Database) {
	const migrationTableCreate = /*sql*/ `
		CREATE TABLE IF NOT EXISTS "__migrations" (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key text NOT NULL UNIQUE,
			created_at numeric
		)
	`;

	await sqlite.execute(migrationTableCreate, []);

	for (const migration of Object.entries(migrations)) {
		const key = migration[0].replace('./migrations/', '').replace('.sql', '');
		const sql = migration[1] as string;

		const dbMigrations = (await sqlite.select(
			'SELECT id, key, created_at FROM "__migrations" ORDER BY created_at DESC'
		)) as unknown as { id: number; key: string; created_at: number }[];

		const hasBeenRun = (key: string) =>
			dbMigrations.find((dbMigration) => {
				return dbMigration?.key === key;
			});

		if (hasBeenRun(key) === undefined) {
			sqlite.execute(sql, []);
			sqlite.execute(
				'INSERT INTO "__migrations" (key, created_at) VALUES ($1, $2)',
				[key, Date.now()]
			);
		}
	}

	console.info('Migrations complete');
	// await sqlite.close();
	return Promise.resolve();
}
