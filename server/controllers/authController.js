const db = require('../data/firebaseDb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await db.findOne('users', { email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await db.create('users', {
        name,
        email,
        password: hashedPassword,
        role
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await db.findOne('users', { email });

    if (user && user.password && typeof user.password === 'string' && (await bcrypt.compare(String(password), user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id)
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

const getMe = async (req, res) => {
    const user = await db.findById('users', req.user.id);
    res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    });
};

const getMentors = async (req, res) => {
    const users = await db.get('users');
    const mentors = users.filter(u => u.role === 'mentor').map(u => ({ id: u.id, name: u.name }));
    res.status(200).json(mentors);
};

const seedUsers = async () => {
    // Check if seed users exist
    const admin = await db.findOne('users', { email: 'admin@auditx.com' });

    if (!admin) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);
        await db.create('users', {
            name: 'Admin User',
            email: 'admin@auditx.com',
            password: hashedPassword,
            role: 'admin'
        });
        console.log('Seeded Admin User: admin@auditx.com / 123456');
    }
};

// Run seed
seedUsers();

module.exports = {
    registerUser,
    loginUser,
    getMe,
    getMentors,

    getPublicCourses: async (req, res) => {
        const courses = await db.get('courses');
        // Return only necessary info: name, batch, semester
        const publicData = courses.map(c => ({
            id: c.id,
            name: c.name, // e.g. PCS-693
            batch: c.batch,
            semester: c.semester
        }));
        res.json(publicData);
    }
};
