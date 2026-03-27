const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateViva = async (req, res) => {
    try {
        const { projectTitle, techStack, projectDescription } = req.body;

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        You are an expert technical interviewer. Generate 5 technical viva questions for a student project with the following details:
        Title: ${projectTitle}
        Tech Stack: ${techStack}
        Description: ${projectDescription}

        Focus on:
        1. Architecture decisions
        2. Technology-specific concepts related to the stack
        3. Scalability and security
        4. Implementation challenges 
        
        Format the output as a JSON array of strings, e.g. ["Question 1", "Question 2"...]. Do not include markdown formatting.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const questions = JSON.parse(cleanText);
            res.json({ questions });
        } catch (e) {
            // Fallback if parsing fails
            res.json({ questions: text.split('\n').filter(q => q.trim().length > 0) });
        }

    } catch (error) {
        console.error("AI Generation Error:", error);
        // Fallback questions in case of API error
        res.json({
            questions: [
                "Explain the project architecture and data flow.",
                "What were the major challenges faced during development?",
                "How did you handle authentication and security?",
                "Why did you choose this specific tech stack?",
                "How would you scale this application for 1000 users?"
            ]
        });
    }
};

module.exports = {
    generateViva
};
