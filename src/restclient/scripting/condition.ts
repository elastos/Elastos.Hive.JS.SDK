
export class Condition {
	private name: string;
	private type: string;
	private body: any;

	constructor(name: string, type: string, body: any) {
		this.name = name;
		this.type = type;
		this.body = body;
	}

	setBody(value: any) {
		this.body = value;
	}

    getBody() : any {
		return this.body;
	}
}
