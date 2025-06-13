export class ButtonState {
    public icon: string;
    public isBackgroundEnabled: boolean;
    private func: Function;

    constructor(icon: string, isBackgroundEnabled: boolean, func: Function) {
        this.icon = icon;
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
        parent.appendChild(element);
    }

    public static call(id: number): void {
        const instance = ButtonManager.instances[id];
        if (!instance)
            return

        instance.currentState.call();

        instance.currentStateIndex = (instance.currentStateIndex + 1) % instance.states.length;
        instance.currentState = instance.states[instance.currentStateIndex];

        if (instance.element.firstChild)
            instance.element.firstChild.textContent = instance.currentState.icon;
        else
            console.warn("Could not find SpanElement for Button. Did you set it up correctly?")

        if (instance.currentState.isBackgroundEnabled) {
            instance.element.style.backgroundColor = "var(--col-accent-1)";
        } else {
            instance.element.style.backgroundColor = "var(--col-bg-2)";
        }
    }
}