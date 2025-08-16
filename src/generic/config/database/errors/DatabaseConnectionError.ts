export default class DatabaseConnectionError extends Error {
	public constructor(error: Error) {
		super(`Database connection error${error ? ': ' + error.message : ''}`)
	}
}
