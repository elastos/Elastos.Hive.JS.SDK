
export class Condition {
	private name: string;
	private type: string;
	private body: object;

	constructor(name: string, type: string, body: object) {
		this.name = name;
		this.type = type;
		this.body = body;
	}

	setBody(value: object) {
		this.body = value;
	}

    getBody() : object {
		return this.body;
	}
}
