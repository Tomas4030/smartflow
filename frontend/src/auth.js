

export const AUTH = {
  TOKEN_KEY: "sf_token",
  USER_KEY: "sf_user",

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

  authHeaders() {
    return { "Authorization": `Bearer ${this.getToken()}` };
  },

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    window.location.href = "login.html";
  },

  requireAuth() {
    const user = this.getUser();
    if (!user || !this.getToken()) {
      window.location.href = "login.html";
      return null;
    }
    return user;
  },

  redirectIfAuthed() {
    const user = this.getUser();
    if (!user || !this.getToken()) return;
    window.location.href = user.role === "superadmin" ? "admin.html" : "dashboard.html";
  },
};

window.AUTH = AUTH;