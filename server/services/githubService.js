const axios = require('axios');

const getReadme = async (repoUrl) => {
    try {
        // Extract owner and repo from URL
        // Format: https://github.com/owner/repo
        const parts = repoUrl.split('github.com/');
        if (parts.length < 2) return '';

        const [owner, repo] = parts[1].split('/').filter(Boolean);
        if (!owner || !repo) return '';

        // Try main then master
        const branches = ['main', 'master'];

        for (const branch of branches) {
            try {
                const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
                const { data } = await axios.get(url);
                return data; // Return raw markdown
            } catch (err) {
                continue;
            }
        }

        return '';
    } catch (error) {
        console.error('Error fetching README:', error.message);
        return '';
    }
};

module.exports = { getReadme };
