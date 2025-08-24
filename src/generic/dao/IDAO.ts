
export default interface IDAO<T> {
	save(entity: T): Promise<T>;
	findAll(): Promise<T[] | null>;
	findById(id: number): Promise<T | null>;
	delete(id: number): Promise<void>;
}
