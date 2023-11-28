/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User object that needs to be registered
 *         required: true
 *         schema:
 *           $ref: "#/definitions/User"
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request, user with given username already exists or username cannot be the password
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login with username and password
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User credentials for login
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: Username of the user
 *             password:
 *               type: string
 *               description: Password of the user
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the login was successful
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: User ID
 *                     username:
 *                       type: string
 *                       description: Username of the user
 *                     firstName:
 *                       type: string
 *                       description: First name of the user (modify accordingly)
 *                     role:
 *                       type: string
 *                       description: Role of the user
 *                     createdBy:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: User ID who created this user
 *                 token:
 *                   type: string
 *                   description: Authentication token
 *       400:
 *         description: User not found or incorrect username/password
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update a user's information (username, password, firstName, wilayas) by providing the user ID.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the user to update
 *       - in: body
 *         name: body
 *         description: Updated user information
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: New username for the user
 *             password:
 *               type: string
 *               description: New password for the user (optional)
 *             firstName:
 *               type: string
 *               description: New first name for the user
 *             wilayas:
 *               type: array
 *               items:
 *                 type: string
 *               description: Array of Wilaya IDs associated with the user
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: User ID
 *                 updatedUsername:
 *                   type: string
 *                   description: Updated username of the user
 *                 firstName:
 *                   type: string
 *                   description: Updated first name of the user
 *                 role:
 *                   type: string
 *                   description: Role of the user
 *                 createdBy:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: User ID who created this user
 *       400:
 *         description: The user cannot be found or invalid request
 *       403:
 *         description: Permission denied (user does not have the required permissions)
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/User"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       username:
 *         type: string
 *         description: Username of the user
 *       fullName:
 *         type: string
 *         description: Full name of the user
 *       role:
 *         type: string
 *         enum:
 *           - Admin
 *           - Cam
 *           - Supervisor
 *           - Delegate
 *         description: Role of the user
 *       password:
 *         type: string
 *         description: Password for the user
 *       createdBy:
 *         type: string
 *         description: ID of the user who created this user
 *       wilayas:
 *         type: array
 *         items:
 *           type: string
 *           description: Array of Wilaya IDs associated with the user
 */
