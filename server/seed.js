const db = require('./data/db');
const bcrypt = require('bcryptjs');

const seedUsers = async () => {
    console.log('Seeding users...');

    // Check if seed users exist
    const student = db.findOne('users', { email: 'student@auditx.com' });
    const mentor = db.findOne('users', { email: 'mentor@auditx.com' });

    if (!student) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);
        db.create('users', {
            name: 'Student User',
            email: 'student@auditx.com',
            password: hashedPassword,
            role: 'student'
        });
        console.log('Seeded Student User: student@auditx.com / 123456');
    } else {
        console.log('Student user already exists');
    }

    if (!mentor) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);
        db.create('users', {
            name: 'Mentor User',
            email: 'mentor@auditx.com',
            password: hashedPassword,
            role: 'mentor'
        });
        console.log('Seeded Mentor User: mentor@auditx.com / 123456');
    }
};

seedUsers();
