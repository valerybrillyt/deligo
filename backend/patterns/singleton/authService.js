class AuthService {
  constructor() {
    if (AuthService.instance) return AuthService.instance;
    this.sessions = new Map();
    AuthService.instance = this;
  }

  login(userId, email) {
    const token = `deligo_${userId}_${Date.now()}`;
    this.sessions.set(token, { userId, email });
    return token;
  }

  validateToken(token) {
    return this.sessions.get(token) || null;
  }
}

module.exports = new AuthService();
