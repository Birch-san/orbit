export class AssertionError extends Error {
    constructor(message: string) {
        super(message)
        this.name = this.constructor.name
    }
}

export function assert(predicate: unknown, message="Assertion error"): asserts predicate {
    if (!predicate) throw new AssertionError(message)
}