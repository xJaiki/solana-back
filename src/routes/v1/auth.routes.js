const express = require('express');
const router = express.Router();
const { getKeycloak } = require('../../config/keycloak');
const authController = require('../../controllers/v1/auth.controller');

router.post('/register', authController.register);

if (process.env.NODE_ENV === 'development') {
  router.post('/debug-login', authController.debugLogin);
}

router.post('/reset-password', authController.resetPassword);

router.get('/profile', getKeycloak().protect(), (req, res) => {
  const userData = req.kauth.grant.access_token.content;
  res.json({
    message: 'Rotta protetta',
    userData
  });
});

module.exports = router;
