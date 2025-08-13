
export default interface IDAO<T> {
	save(entity: T): Promise<T>;
	findAll(): Promise<T[] | null>;
	findById(id: string): Promise<T | null>;
	delete(id: string): Promise<void>;
}
