
const AUTH = {
    TOKEN_KEY: "sf_token",
    USER_KEY: "sf_user",

    async getMunicipalities() {
        const res = await fetch("/api/municipalities");
        if (!res.ok) throw new Error("Failed to load municipalities");
        const json = await res.json();

        return json.data ?? json;
    },

    async login(email, password) {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const err = new Error("Login failed");
            err.status = res.status;
            throw err;
        }

        const data = await res.json();
        this.setSession(data.token, data.user);
        return data.user;
    },

    setSession(token, user) {
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    },

    getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    },

    getUser() {
        const raw = localStorage.getItem(this.USER_KEY);
        return raw ? JSON.parse(raw) : null;
    },

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        window.location.href = "login.html";
    },

    requireAuth() {
        if (!this.getToken()) window.location.href = "login.html";
    },

    redirectIfAuthed() {
        if (this.getToken()) window.location.href = "dashboard.html";
    },
};

window.AUTH = AUTH;