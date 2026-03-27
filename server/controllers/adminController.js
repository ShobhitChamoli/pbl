const db = require('../data/firebaseDb');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Helper function to format date as DD/MM/YYYY
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const getAdminStats = async (req, res) => {
    try {
        const users = await db.get('users');
        const projects = await db.get('projects');
        const evaluations = await db.get('evaluations');
        const courses = await db.get('courses');

        const students = users.filter(u => u.role === 'student').length;
        const mentors = users.filter(u => u.role === 'mentor').length;
        const completedEvaluations = evaluations.length;
        const pendingEvaluations = projects.length - completedEvaluations;

        res.status(200).json({
            totalStudents: students,
            totalMentors: mentors,
            totalProjects: projects.length,
            evaluatedProjects: completedEvaluations,
            pendingProjects: pendingEvaluations,
            courses: courses.length
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAllProjects = async (req, res) => {
    try {
        const projects = await db.get('projects');
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const assignMentor = async (req, res) => {
    try {
        const { projectId, mentorId } = req.body;
        const project = await db.findById('projects', projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        await db.update('projects', projectId, { mentorId });
        res.status(200).json({ message: 'Mentor assigned' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password, role, courseCode } = req.body;

        if (await db.findOne('users', { email })) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await db.create('users', {
            name, email, password: hashedPassword, role, courseCode
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getCourses = async (req, res) => {
    try {
        const courses = await db.get('courses');
        const users = await db.get('users');

        // Add student count to each course
        const coursesWithCounts = courses.map(course => {
            const studentCount = users.filter(
                u => u.role === 'student' && u.courseCode === course.name
            ).length;

            return {
                ...course,
                studentCount
            };
        });

        res.status(200).json(coursesWithCounts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createCourse = async (req, res) => {
    try {
        const { name, title, semester } = req.body;
        const newCourse = await db.create('courses', {
            name,
            title,
            semester,
            batch: new Date().getFullYear().toString()
        });
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getVivaSessions = async (req, res) => {
    try {
        const sessions = await db.get('vivaSessions');
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createVivaSession = async (req, res) => {
    try {
        const session = await db.create('vivaSessions', req.body);
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const resetSystem = async (req, res) => {
    try {
        // Get all users and filter admins
        const users = await db.get('users');
        const adminIds = users.filter(u => u.role === 'admin').map(u => u.id);

        // Delete all non-admin users
        const allUsers = await db.get('users');
        for (const user of allUsers) {
            if (user.role !== 'admin') {
                await db.delete('users', user.id);
            }
        }

        // Clear all other collections using Firestore batch operations
        await db.deleteAll('projects');
        await db.deleteAll('evaluations');
        await db.deleteAll('notifications');
        await db.deleteAll('vivaSessions');
        await db.deleteAll('feedbacks');
        await db.deleteAll('settings');
        // Note: courses collection is preserved

        res.status(200).json({ message: 'System reset successfully. All data cleared except admin accounts and courses.' });
    } catch (error) {
        console.error('Reset error:', error);
        res.status(500).json({ message: 'Server Error during reset' });
    }
};

const createEvaluationPeriod = async (req, res) => {
    try {
        const { title, startDate, endDate } = req.body;

        let settingsList = await db.get('settings');
        if (settingsList.length > 0) {
            await db.update('settings', settingsList[0].id, { evaluationPeriod: { title, startDate, endDate } });
        } else {
            await db.create('settings', { evaluationPeriod: { title, startDate, endDate } });
        }

        // Notify Mentors
        const mentors = (await db.get('users')).filter(u => u.role === 'mentor');
        for (const m of mentors) {
            await db.create('notifications', {
                userId: m.id,
                title: `Evaluation Period Started: ${title}`,
                message: `Please conduct PBL evaluations from ${formatDate(startDate)} to ${formatDate(endDate)}.`,
                type: 'info',
                read: false,
                senderId: req.user.id
            });
        }

        res.status(200).json({ message: 'Evaluation period created and mentors notified' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getEvaluationPeriod = async (req, res) => {
    try {
        const settingsList = await db.get('settings');
        const period = settingsList[0]?.evaluationPeriod || null;
        res.status(200).json(period);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const sendReminder = async (req, res) => {
    try {
        const settingsList = await db.get('settings');
        const period = settingsList[0]?.evaluationPeriod;

        if (!period) return res.status(400).json({ message: 'No active evaluation period found' });

        const mentors = (await db.get('users')).filter(u => u.role === 'mentor');
        for (const m of mentors) {
            await db.create('notifications', {
                userId: m.id,
                title: "Reminder: Evaluation Deadline",
                message: `Reminder to complete all evaluations by ${formatDate(period.endDate)}.`,
                type: 'warning',
                read: false,
                senderId: req.user.id
            });
        }

        res.status(200).json({ message: 'Reminders sent to mentors' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const extendDeadline = async (req, res) => {
    try {
        const { newDate } = req.body;
        const settingsList = await db.get('settings');
        if (settingsList.length === 0) return res.status(400).json({ message: 'No settings found' });

        const currentPeriod = settingsList[0].evaluationPeriod || {};
        const updatedPeriod = { ...currentPeriod, endDate: newDate };

        await db.update('settings', settingsList[0].id, { evaluationPeriod: updatedPeriod });

        // Notify Everyone
        const users = await db.get('users');
        for (const u of users) {
            if (u.role === 'mentor' || u.role === 'student') {
                await db.create('notifications', {
                    userId: u.id,
                    title: "Deadline Extended",
                    message: `The date of PBL submission (evaluation) is extended to ${formatDate(newDate)}.`,
                    type: 'success',
                    read: false,
                    senderId: req.user.id
                });
            }
        }

        res.status(200).json({ message: 'Deadline extended and notifications sent' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAdminStats,
    getAllProjects,
    assignMentor,
    createUser,
    getCourses,
    createCourse,
    getVivaSessions,
    createVivaSession,
    resetSystem,
    createEvaluationPeriod,
    getEvaluationPeriod,
    sendReminder,
    extendDeadline
};
