/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication and user management
 *
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               telephone:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               name: "Jane Doe"
 *               telephone: "0123456789"
 *               email: "jane@example.com"
 *               password: "s3cureP@ssw0rd"
 *     responses:
 *       200:
 *         description: Registered user with token
 *       400:
 *         description: Validation error or bad request while registering
 *
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user and return token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: "jane@example.com"
 *               password: "s3cureP@ssw0rd"
 *     responses:
 *       200:
 *         description: User credentials validated and token returned
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials or cannot login
 *
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *
 * /api/v1/auth/logout:
 *   get:
 *     summary: Logout user / clear cookie
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out
 *       401:
 *         description: Unauthorized (missing/invalid token)
 */

const express = require('express');
const {register, login, getMe, logout} = require('../controllers/auth');
const router = express.Router();

const {protect} = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);


module.exports = router;