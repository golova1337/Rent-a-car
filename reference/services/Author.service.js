const AuthorRepository = require("../db/repository/Author.repository");
const { comparePassword, hashingPassword } = require("../utils/bcrypt/password");
const { createJwt } = require("../utils/jwt/createJwt");

class AuthorService {
  constructor(authorRepository) {
    this.authorRepository = authorRepository;
  }

  async singUp(body) {
    try {
      const hash = await hashingPassword(body.password);
      await this.authorRepository.insert({ ...body, hash: hash });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async login(body) {
    await comparePassword(body.password, body.password_hash);
    const token = await createJwt(body.id, body.role);
    return token;
  }
}

module.exports = new AuthorService(AuthorRepository);
