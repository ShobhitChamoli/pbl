const db = require('../data/firebaseDb');

const submitEvaluation = async (req, res) => {
    const { projectId, marks, feedback } = req.body;
    // marks: { codeQuality, logic, architecture, viva, innovation }

    const project = await db.findById('projects', projectId);
    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    const total = Object.values(marks).reduce((a, b) => a + Number(b), 0);

    // Check if already evaluated
    const existingEval = await db.findOne('evaluations', { projectId });
    if (existingEval) {
        // Update
        const updated = await db.update('evaluations', existingEval.id, {
            marks,
            total,
            feedback,
            evaluatorId: req.user.id
        });

        // Sync with project
        await db.update('projects', projectId, { evaluation: updated });

        return res.json(updated);
    }

    const evaluation = await db.create('evaluations', {
        projectId,
        studentId: project.studentId,
        marks,
        total,
        feedback,
        evaluatorId: req.user.id
    });

    // Explicitly update project to show it is evaluated
    await db.update('projects', projectId, { evaluation: evaluation });

    res.status(201).json(evaluation);
};

const getBenchmarks = async (req, res) => {
    const evaluations = await db.get('evaluations');
    if (evaluations.length === 0) {
        return res.json({ average: 0, domainAverage: 0, totalProjects: 0 });
    }

    const totalSum = evaluations.reduce((sum, ev) => sum + ev.total, 0);
    const average = totalSum / evaluations.length;

    res.json({
        average: Math.round(average),
        totalProjects: evaluations.length
    });
};

const createSession = async (req, res) => {
    try {
        const { title, date, time, place, type, studentCount } = req.body;

        // Basic validation
        if (!title || !date || !time || !place) {
            return res.status(400).json({ message: 'Title, Date, Time, and Place are required' });
        }

        // Create the session
        const session = await db.create('vivaSessions', {
            title,
            date,
            time,
            place,
            type: type || 'Viva',
            status: 'Scheduled',
            mentorId: req.user.id,
            createdAt: new Date().toISOString()
        });

        // ---------------------------------------------------------
        // AUTOMATIC NOTIFICATION LOGIC
        // ---------------------------------------------------------
        if (studentCount && studentCount > 0) {
            const projects = (await db.get('projects')) || [];

            // 1. Filter: Projects NOT yet evaluated
            const pendingProjects = projects.filter(p => !p.evaluation);

            // 2. Slice: Take only the requested number
            const targetProjects = pendingProjects.slice(0, Number(studentCount));

            // 3. Notify each student
            for (const project of targetProjects) {
                if (project.studentId) { // Ensure studentId exists
                    // Create Notification
                    await db.create('notifications', {
                        userId: project.studentId,
                        title: `Viva Session Scheduled: ${title}`,
                        message: `A new viva session has been scheduled. Status: Pending. Please attend on ${date} at ${time} in ${place}.`,
                        type: 'warning',
                        read: false,
                        senderId: req.user.id,
                        createdAt: new Date().toISOString()
                    });

                    // Update Project with Scheduled Date
                    await db.update('projects', project.id, {
                        scheduledVivaDate: date,
                        scheduledVivaTime: time,
                        scheduledVivaPlace: place
                    });
                }
            }

            // Optionally, we could attach the list of invited students to the session object
            // but for now we just return the count in the response
            session.invitedCount = targetProjects.length;
        }

        res.status(201).json(session);
    } catch (error) {
        console.error("Create Session Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { submitEvaluation, getBenchmarks, createSession };
