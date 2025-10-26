export default abstract class DomainEntity {
	_id!: string;
	_isActive: boolean;
	_orderId?: string;

	public constructor() {
		this._isActive = true;
	}

	get id(): string {
		return this._id;
	}

	set id(value: string) {
		this._id = value;
	}

	get isActive(): boolean {
		return this._isActive;
	}

	set isActive(value: boolean) {
		this._isActive = value;
	}

	get orderId(): string | undefined {
		return this._orderId;
	}
	
	set orderId(value: string | undefined) {
		this._orderId = value;
	}
}
