const authService = require('../../services/v1/auth.service');

async function register(req, res, next) {
    // #swagger.tags = ['Auth']
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      clientId,
      roleInClient
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Parametri mancanti' });
    }

    const result = await authService.registerUser({
      firstName,
      lastName,
      email,
      password,
      clientId,
      roleInClient
    });
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function debugLogin(req, res, next) {
    // #swagger.tags = ['Auth']
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email mancante' });
    }
    const result = await authService.debugLogin(email);
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
    // #swagger.tags = ['Auth']
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email mancante' });
    }
    const result = await authService.resetPasswordFlow(email);
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  debugLogin,
  resetPassword
};
