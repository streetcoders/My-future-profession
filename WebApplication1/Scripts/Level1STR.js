class List {
    constructor() {
        this.list = [];
    }

    get length() {
        return this.list.length;
    }

    add(text) {
        this.list.push(text);
    }

    change(text, id) {
        this.list[id] = text;
    }

    remove(id) {
        this.list.splice(id, 1);
    }

    validate() {
        if (this.list.length < 1) throw new Error("No lines! Create at least one!");
    }

    getAll() {
        this.validate();
        return {
            blocks: this.list
        };
    }

    get(id) {
        return this.list[id];
    }
}


window.onerror = function uncheckedError(message, url, line) {
    alert("structure.js: Error occurred: " + message + " : " + url + " : " + line);
    return false;
};
