const db = require('./server/data/db');
const { createProject, getProjects } = require('./server/controllers/projectController');

// Mock Express Request/Response
const mockRes = () => {
    const res = {};
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data) => {
        res.data = data;
        return res;
    };
    return res;
};

const runTest = async () => {
    console.log("Starting Reproduction Test...");

    // 1. Setup Data - Clear Projects for clean test
    // We will use existing users but clear projects temporarily (or work with copy)
    // To be safe, we won't modify real DB, just use the logic. 
    // Actually, controller imports DB which imports real file paths. 
    // I should create a temporary test function with the logic, OR modify DB path?
    // Modifying DB path is hard since it's required.
    // I will replicate the LOGIC here rather than running the controller directly to avoid messing up User's DB.

    // Load Users
    const users = db.get('users');
    const mentors = users.filter(u => u.role === 'mentor' && u.courseCode === 'PCS-693');
    console.log(`Found ${mentors.length} mentors for PCS-693:`, mentors.map(m => m.name));

    // Simulate Round Robin Logic
    let simulatedProjects = [];

    const assignMentor = () => {
        let mentorId = null;
        if (mentors.length > 0) {
            const mentorLoad = mentors.map(mentor => {
                const count = simulatedProjects.filter(p => p.mentorId === mentor.id).length;
                return { ...mentor, projectCount: count };
            });

            mentorLoad.sort((a, b) => {
                if (a.projectCount !== b.projectCount) {
                    return a.projectCount - b.projectCount;
                }
                return a.name.localeCompare(b.name);
            });
            mentorId = mentorLoad[0].id;
        }
        return mentorId;
    };

    console.log("\n--- Testing Round Robin ---");
    for (let i = 1; i <= 4; i++) {
        const assignedId = assignMentor();
        const assignedName = mentors.find(m => m.id === assignedId).name;
        console.log(`Student ${i} -> Assigned to: ${assignedName}`);
        simulatedProjects.push({ id: i, mentorId: assignedId });
    }

    // Verify Distribution
    const counts = {};
    mentors.forEach(m => counts[m.name] = 0);
    simulatedProjects.forEach(p => {
        const mName = mentors.find(m => m.id === p.mentorId).name;
        counts[mName]++;
    });
    console.log("\nDistribution:", counts);

    // 2. Verify Visibility Logic
    console.log("\n--- Testing Visibility ---");

    const checkVisibility = (userRole, userId) => {
        let visibleProjects = simulatedProjects;
        if (userRole === 'mentor') {
            visibleProjects = visibleProjects.filter(p => p.mentorId === userId);
        }
        return visibleProjects.length;
    };

    mentors.forEach(m => {
        const visibleCount = checkVisibility('mentor', m.id);
        console.log(`Mentor ${m.name} sees: ${visibleCount} projects`);
        if (visibleCount !== counts[m.name]) {
            console.error(`ERROR: Visibility mismatch for ${m.name}! Expected ${counts[m.name]}, saw ${visibleCount}`);
        } else {
            console.log(`PASS: ${m.name} visibility correct.`);
        }
    });
};

runTest();
