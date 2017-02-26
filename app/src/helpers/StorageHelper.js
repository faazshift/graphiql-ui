module.exports = class StorageHelper {
    constructor(domain = 'default') {
        this.domain = domain;
    }

    _prefix(key = '') {
        return `${this.domain}:${key}`;
    }

    _unprefix(key) {
        return key.substr(`${this.domain}:`.length);
    }

    _getKeys() {
        let keys = [];

        for(let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);

            if(key.startsWith(`${this.domain}:`)) {
                keys.push(key);
            }
        }

        return keys;
    }

    get(key) {
        return localStorage.getItem(this._prefix(key));
    }

    getAll() {
        let all = {};
        let keys = this._getKeys();

        keys.forEach((key) => {
            all[this._unprefix(key)] = localStorage.getItem(key);
        });

        return all;
    }

    set(key, val) {
        localStorage.setItem(this._prefix(key), val);
    }

    delete(key) {
        return localStorage.removeItem(this._prefix(key));
    }

    clear() {
        let keys = this._getKeys();
        keys.forEach((key) => {
            localStorage.removeItem(key);
        });
    }
}