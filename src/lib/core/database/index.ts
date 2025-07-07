import { drizzle } from 'drizzle-orm/sqlite-proxy';
import Database from '@tauri-apps/plugin-sql';
import * as schema from './schema'
import '$lib/core/database/migrate';
import { migrate } from './migrate';

export async function createDatabaseClient(dbPath: string) {
	// console.log(migrations)
	const sqlite = await Database.load(`sqlite:${dbPath}`);
	if (!sqlite) {
		throw new Error(`Failed to load database at path: ${dbPath}`);
	}

	await migrate(sqlite);

	const client = drizzle<typeof schema>(async (sql, params, method) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let rows: any = [];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let results: any = [];

		if (/^\s*SELECT\b/i.test(sql)) {
			rows = await sqlite.select(sql, params).catch((err) => {
				console.error('Error executing SQL get query:', err);
			});
		} else {
			rows = await sqlite.execute(sql, params).catch((e) => {
				console.error('SQL Error:', e);
				return [];
			});
			return { rows: [] };
		}

		rows = rows.map((row: unknown) => {
			return Object.values(row as { [key: string]: unknown });
		});

		results = method === 'all' ? rows : rows[0];
		// await sqlite.close();

		return { rows: results };
	}, {
		schema,
		logger: true
	});
	
	return client;
}