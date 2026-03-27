const db = require('../data/firebaseDb');
const { v4: uuidv4 } = require('uuid');

const createProject = async (req, res) => {
    const { teamName, leaderName, members, repoLink, title, description, domain, techStack, courseCode, subjectName, semester, academicYear } = req.body;

    if (!teamName || !leaderName || !repoLink || !title || !description || !domain || !techStack || !courseCode || !semester || !academicYear) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Check if student already submitted a project for THIS course
    const allProjects = await db.get('projects');
    const existingProjectInCourse = allProjects.find(
        p => p.studentId === req.user.id && p.courseCode === courseCode
    );
    if (existingProjectInCourse) {
        return res.status(400).json({ message: `You have already submitted a project for ${courseCode}` });
    }

    // Backend Course Name Lookup
    const courses = await db.get('courses');
    const selectedCourse = courses.find(c => c.name === courseCode);
    const finalSubjectName = selectedCourse ? selectedCourse.title : subjectName;

    // Round-Robin Mentor Assignment
    let mentorId = null;
    if (courseCode) {
        // Find all mentors assigned to this course (Case Insensitive)
        const eligibleMentors = (await db.get('users')).filter(u =>
            u.role === 'mentor' &&
            u.courseCode &&
            u.courseCode.toLowerCase() === courseCode.toLowerCase()
        );

        if (eligibleMentors.length > 0) {
            const allProjects = await db.get('projects');

            // Calculate current load for each mentor
            const mentorLoad = eligibleMentors.map(mentor => {
                const count = allProjects.filter(p => p.mentorId === mentor.id).length;
                return { ...mentor, projectCount: count };
            });

            // Sort by load (ascending), then by Name (for deterministic Round Robin)
            mentorLoad.sort((a, b) => {
                if (a.projectCount !== b.projectCount) {
                    return a.projectCount - b.projectCount;
                }
                return a.name.localeCompare(b.name);
            });

            // Pick the one with the least projects
            mentorId = mentorLoad[0].id;
        }
    }

    const project = await db.create('projects', {
        studentId: req.user.id,
        teamName,
        leaderName,
        members: members || [],
        repoLink,
        title,
        description,
        domain,
        techStack,
        mentorId: mentorId, // Round-Robin Assigned
        courseCode,
        subjectName: finalSubjectName, // Backend Truth
        semester,
        academicYear,
        analyzed: false
    });

    res.status(201).json(project);
};

const getProjects = async (req, res) => {
    const { search } = req.query;
    let projects = await db.get('projects');

    if (search) {
        const searchLower = search.toLowerCase();
        projects = projects.filter(p =>
            p.teamName.toLowerCase().includes(searchLower) ||
            p.leaderName.toLowerCase().includes(searchLower) ||
            p.title.toLowerCase().includes(searchLower)
        );
    }

    // Filter based on role (Strict Access Control)
    if (req.user.role === 'admin') {
        // Admin sees all projects (already loaded)
    } else if (req.user.role === 'mentor') {
        // Mentor sees only assigned projects
        projects = projects.filter(p => p.mentorId === req.user.id);
    } else {
        // Students or others should not access this endpoint (use /me for student)
        // Returning empty array to prevent data leakage
        projects = [];
    }

    res.status(200).json(projects);
};

const getMyProject = async (req, res) => {
    // Get all projects for this student
    const allProjects = await db.get('projects');
    const myProjects = allProjects.filter(p => p.studentId === req.user.id);

    if (myProjects.length === 0) {
        return res.status(404).json({ message: 'No projects found' });
    }

    // Attach evaluations to each project
    const allEvaluations = await db.get('evaluations');
    const projectsWithEvaluations = myProjects.map(project => {
        const evaluation = allEvaluations.find(e => e.projectId === project.id);
        return { ...project, evaluation };
    });

    res.status(200).json(projectsWithEvaluations);
};

const getProjectById = async (req, res) => {
    const project = await db.findById('projects', req.params.id);
    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
}

module.exports = {
    createProject,
    getProjects,
    getMyProject,
    getProjectById
};
