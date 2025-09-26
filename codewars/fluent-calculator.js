class FluentNumeric {
	value;
	next;
	prev;

	constructor(prev, next) {
		this.next = next;
		this.prev = prev;
	}

	#nextOperation(val) {
		this.value = val;
		this.next = new FluentOperand(this);
		if (!this.prev && !this.next) return this.value;

		return this.next;
	}

	get one() {
		return this.#nextOperation(1);
	}

	get two() {
		return this.#nextOperation(2);
	}

	get three() {
		return this.#nextOperation(3);
	}

	get four() {
		return this.#nextOperation(4);
	}

	get five() {
		return this.#nextOperation(5);
	}

	get six() {
		return this.#nextOperation(6);
	}

	get seven() {
		return this.#nextOperation(7);
	}

	get eight() {
		return this.#nextOperation(8);
	}

	get nine() {
		return this.#nextOperation(9);
	}

	get ten() {
		return this.#nextOperation(10);
	}
}

class FluentOperand {
	next;
	prev;
	operand;

	constructor(prev, next) {
		this.next = next;
		this.prev = prev;
	}

	#nextOperation(val) {
		this.operand = val;
		this.next = new FluentNumeric(this);
		return this.next;
	}

	get plus() {
		return this.#nextOperation("+");
	}

	get minus() {
		return this.#nextOperation("-");
	}

	get times() {
		return this.#nextOperation("*");
	}

	get dividedBy() {
		return this.#nextOperation("/");
	}
}

var Magic = new FluentNumeric(null, null);
var FluentCalculator = Magic;

console.log(Magic.two);
