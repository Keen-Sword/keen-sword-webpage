export class ButtonState {
    public icon: string;
    public title: string;
    public isBackgroundEnabled: boolean;
    private func: Function;

    constructor(icon: string, title: string, isBackgroundEnabled: boolean, func: Function) {
        this.icon = icon;
        this.title = title;
        this.isBackgroundEnabled = isBackgroundEnabled;
        this.func = func;
    }

    public call(): void {
        console.debug(`Calling function '${this.func.name}'.`);
        this.func();
    }
}

export class ButtonManager {
    public static instances: ButtonManager[] = [];

    public element: HTMLButtonElement;
    public currentStateIndex: number;
    public currentState: ButtonState;
    public states: ButtonState[];

    constructor(parent: HTMLElement, element: HTMLButtonElement, states: ButtonState[]) {
        this.element = element;
        this.currentState = states[0];
        this.currentStateIndex = 0;
        this.states = states;

        const buttonSpan = document.createElement("span");
        buttonSpan.classList = "material-symbols-outlined";
        buttonSpan.style = "font-size: 1.2em; color: #fff";
        buttonSpan.innerHTML = this.currentState.icon;
        element.appendChild(buttonSpan);

        const id = ButtonManager.instances.push(this)

        element.onclick = (ev) => { ButtonManager.call(id-1) };
        element.title = states[0].title;
        parent.appendChild(element);
    }

    private _call(): void {
        this.currentState.call();
        this.setState(this.currentStateIndex + 1)
    }

    public setState(state: number|null) {
        if (state === null)
            return;

        state = state % this.states.length;
        this.currentStateIndex = state;
        this.currentState = this.states[state];
        this.element.title = this.currentState.title;

        if (this.element.firstChild)
            this.element.firstChild.textContent = this.currentState.icon;
        else
            console.warn("Could not find SpanElement for Button. Did you set it up correctly?")

        if (this.currentState.isBackgroundEnabled) {
            this.element.style.backgroundColor = "var(--col-accent-1)";
        } else {
            this.element.style.backgroundColor = "var(--col-bg-2)";
        }
    }

    public static call(instanceId: number): void {
        const instance = ButtonManager.instances[instanceId];
        if (!instance)
            return;
        instance._call();
    }
}