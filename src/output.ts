import correction from './ressources/output/corrections';
import liaisons from './ressources/output/liaisons';
import violations from './ressources/output/violations';
import tricks from './ressources/output/tricks';

export class Output {
    private items: Array<string> = [];
    private hasViolation: boolean = false;
    private hasTrick: boolean = false;

    public compute(): string {
        const lines: Array<string> = [];

        if (this.hasViolation) {
            lines.push(this.getViolation());
        }

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            let text = this.getCorrection(item);

            if (lines.length > 0) {
                text = [this.getLiaison(), text].join(' ');
            }

            text = this.capitalize(text);

            lines.push(text);
        }

        if (this.hasTrick) {
            let t = this.getTrick();
            t = lines.length > 0 ? 'Et ' + t : this.capitalize(t);
            lines.push(t);
        }

        if (lines.length == 0) return '';
        return lines.join('\n');
    }

    public add(text: string): void {
        if (this.items.indexOf(text) == -1) this.items.push(text);
    }

    private getLiaison(): string {
        return this.randomOf(liaisons);
    }

    private getViolation(): string {
        return this.randomOf(violations);
    }

    private getTrick(): string {
        return this.randomOf(tricks);
    }

    private capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    private getCorrection(text: string): string {
        const c = this.randomOf(correction);
        return c.replace('$1', text.replace('theo', 'teo'));
    }

    private randomOf(arr: Array<string>): string {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    public violate(status = true) {
        this.hasViolation = status;
    }

    public trick(status = true) {
        this.hasTrick = status;
    }
}
