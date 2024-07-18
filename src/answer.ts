export class Answer {
    public from: string;
    public time: Date;
    public input: string;
    public message: string;
    private type: AnswerType;

    constructor(input: string, from: string) {
        this.input = input;
        this.time = new Date();
        this.from = from;
        this.type = AnswerType.None;
    }

    public getType(): AnswerType {
        return this.type;
    }

    public setType(type: AnswerType) {
        if (type > this.type) this.type = type;
    }
}

export enum AnswerType {
    None,
    Provocation,
    Correction,
    Violation,
    Trick,
}
