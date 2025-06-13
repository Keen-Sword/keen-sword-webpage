export class ButtonState {

}

export class Button {
    public element: HTMLElement;
    public func: Function;
    public states: ButtonState;

    constructor(element: HTMLElement, func: Function) {
        this.element = element;
        this.func = func;
        this.states = [];
    }
}