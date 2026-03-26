// Test Round-Robin Assignment
const users = [
    { id: "da0e66a7-4477-4681-8968-bcdfd8918ee4", name: "dfd", role: "mentor", courseCode: "pdf" },
    { id: "bb3d360a-d337-4dad-84b3-17fd6dbcfb0b", name: "sfsd", role: "mentor", courseCode: "pdf" }
];

const projects = [
    { id: "1", mentorId: "da0e66a7-4477-4681-8968-bcdfd8918ee4", courseCode: "pdf" }
];

console.log("=== Testing Round-Robin Assignment ===\n");
console.log("Current State:");
console.log("Mentors:", users.map(u => u.name));
console.log("Existing Projects:", projects.length);

// Simulate creating 3 more projects
for (let i = 2; i <= 4; i++) {
    const courseCode = "pdf";

    // Find eligible mentors
    const eligibleMentors = users.filter(u =>
        u.role === 'mentor' &&
        u.courseCode &&
        u.courseCode.toLowerCase() === courseCode.toLowerCase()
    );

    // Calculate load
    const mentorLoad = eligibleMentors.map(mentor => {
        const count = projects.filter(p => p.mentorId === mentor.id).length;
        return { ...mentor, projectCount: count };
    });

    // Sort by load, then by name
    mentorLoad.sort((a, b) => {
        if (a.projectCount !== b.projectCount) {
            return a.projectCount - b.projectCount;
        }
        return a.name.localeCompare(b.name);
    });

    const assignedMentor = mentorLoad[0];

    // Create project
    const newProject = {
        id: `${i}`,
        mentorId: assignedMentor.id,
        courseCode: courseCode
    };

    projects.push(newProject);

    console.log(`\nProject ${i} -> Assigned to: ${assignedMentor.name} (Load before: ${assignedMentor.projectCount})`);
}

console.log("\n=== Final Distribution ===");
users.forEach(mentor => {
    const count = projects.filter(p => p.mentorId === mentor.id).length;
    console.log(`${mentor.name}: ${count} projects`);
});
