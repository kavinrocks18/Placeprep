const pdfParse = require('pdf-parse');

// Common tech skills database for matching
const SKILL_KEYWORDS = {
    // Programming Languages
    'javascript': ['javascript', 'js', 'es6', 'es2015'],
    'typescript': ['typescript', 'ts'],
    'python': ['python', 'py'],
    'java': ['java', 'jdk', 'jvm'],
    'c++': ['c++', 'cpp'],
    'c#': ['c#', 'csharp', 'c sharp'],
    'go': ['golang', 'go lang'],
    'rust': ['rust'],
    'ruby': ['ruby'],
    'php': ['php'],
    'swift': ['swift'],
    'kotlin': ['kotlin'],
    'r': ['r programming', 'r lang'],
    'scala': ['scala'],

    // Frontend
    'react': ['react', 'reactjs', 'react.js'],
    'angular': ['angular', 'angularjs'],
    'vue': ['vue', 'vuejs', 'vue.js'],
    'next.js': ['next.js', 'nextjs', 'next js'],
    'html': ['html', 'html5'],
    'css': ['css', 'css3', 'scss', 'sass', 'less'],
    'tailwind': ['tailwind', 'tailwindcss'],
    'bootstrap': ['bootstrap'],
    'jquery': ['jquery'],
    'redux': ['redux'],
    'webpack': ['webpack'],

    // Backend
    'node.js': ['node.js', 'nodejs', 'node js', 'express', 'expressjs'],
    'django': ['django'],
    'flask': ['flask'],
    'spring': ['spring', 'spring boot', 'springboot'],
    'laravel': ['laravel'],
    'rails': ['rails', 'ruby on rails'],
    'fastapi': ['fastapi', 'fast api'],
    'graphql': ['graphql'],
    'rest api': ['rest api', 'restful', 'rest'],

    // Databases
    'mongodb': ['mongodb', 'mongo', 'mongoose'],
    'mysql': ['mysql'],
    'postgresql': ['postgresql', 'postgres', 'psql'],
    'redis': ['redis'],
    'elasticsearch': ['elasticsearch', 'elastic search'],
    'firebase': ['firebase', 'firestore'],
    'sql': ['sql', 'structured query language'],
    'oracle': ['oracle db', 'oracle database'],

    // Cloud & DevOps
    'aws': ['aws', 'amazon web services', 'ec2', 's3', 'lambda'],
    'azure': ['azure', 'microsoft azure'],
    'gcp': ['gcp', 'google cloud', 'google cloud platform'],
    'docker': ['docker', 'containerization'],
    'kubernetes': ['kubernetes', 'k8s'],
    'jenkins': ['jenkins'],
    'ci/cd': ['ci/cd', 'ci cd', 'continuous integration', 'continuous deployment'],
    'terraform': ['terraform'],
    'linux': ['linux', 'ubuntu', 'centos'],
    'nginx': ['nginx'],

    // Data Science & AI
    'machine learning': ['machine learning', 'ml'],
    'deep learning': ['deep learning', 'dl'],
    'tensorflow': ['tensorflow'],
    'pytorch': ['pytorch'],
    'pandas': ['pandas'],
    'numpy': ['numpy'],
    'scikit-learn': ['scikit-learn', 'sklearn'],
    'nlp': ['nlp', 'natural language processing'],
    'computer vision': ['computer vision', 'opencv'],
    'data analysis': ['data analysis', 'data analytics'],

    // Tools & Platforms
    'git': ['git', 'github', 'gitlab', 'bitbucket', 'version control'],
    'jira': ['jira'],
    'figma': ['figma'],
    'postman': ['postman'],
    'agile': ['agile', 'scrum', 'kanban', 'sprint'],

    // Soft Skills (for ATS)
    'leadership': ['leadership', 'led', 'managed', 'mentored'],
    'communication': ['communication', 'communicated', 'presented'],
    'problem solving': ['problem solving', 'troubleshooting', 'debugging'],
    'teamwork': ['teamwork', 'team player', 'collaborated', 'collaboration'],
};

// Important resume sections
const RESUME_SECTIONS = [
    { name: 'Contact Information', keywords: ['email', 'phone', 'linkedin', 'github', 'portfolio', 'address', '@'] },
    { name: 'Education', keywords: ['education', 'university', 'college', 'bachelor', 'master', 'degree', 'gpa', 'cgpa', 'b.tech', 'm.tech', 'b.e', 'bsc', 'msc', 'mca', 'bca'] },
    { name: 'Experience', keywords: ['experience', 'work history', 'employment', 'internship', 'intern', 'worked at', 'company'] },
    { name: 'Skills', keywords: ['skills', 'technical skills', 'technologies', 'tools', 'proficiency'] },
    { name: 'Projects', keywords: ['projects', 'personal projects', 'academic projects', 'built', 'developed'] },
    { name: 'Certifications', keywords: ['certifications', 'certified', 'certificate', 'credential', 'license'] },
    { name: 'Achievements', keywords: ['achievements', 'awards', 'honors', 'recognition', 'accomplishments'] },
];

// Action verbs that improve ATS scoring
const ACTION_VERBS = [
    'achieved', 'built', 'created', 'delivered', 'designed', 'developed',
    'engineered', 'executed', 'implemented', 'improved', 'increased',
    'launched', 'led', 'managed', 'optimized', 'reduced', 'resolved',
    'spearheaded', 'streamlined', 'transformed',
];

function extractSkillsFromText(text) {
    const lower = text.toLowerCase();
    const found = new Set();
    for (const [skill, variants] of Object.entries(SKILL_KEYWORDS)) {
        for (const variant of variants) {
            if (lower.includes(variant)) {
                found.add(skill);
                break;
            }
        }
    }
    return [...found];
}

function extractJDRequirements(jdText) {
    const lower = jdText.toLowerCase();
    const required = new Set();

    for (const [skill, variants] of Object.entries(SKILL_KEYWORDS)) {
        for (const variant of variants) {
            if (lower.includes(variant)) {
                required.add(skill);
                break;
            }
        }
    }
    return [...required];
}

function analyzeSections(resumeText) {
    const lower = resumeText.toLowerCase();
    return RESUME_SECTIONS.map(section => {
        const present = section.keywords.some(kw => lower.includes(kw));
        return { name: section.name, present };
    });
}

function countActionVerbs(resumeText) {
    const lower = resumeText.toLowerCase();
    return ACTION_VERBS.filter(v => lower.includes(v));
}

function calculateATSScore(resumeSkills, jdSkills, sections, actionVerbs, resumeText) {
    // 1. Skill match score (50% weight)
    const matchedSkills = resumeSkills.filter(s => jdSkills.includes(s));
    const skillScore = jdSkills.length > 0 ? (matchedSkills.length / jdSkills.length) * 100 : 50;

    // 2. Section score (20% weight)
    const presentSections = sections.filter(s => s.present).length;
    const sectionScore = (presentSections / sections.length) * 100;

    // 3. Action verbs score (10% weight)
    const verbScore = Math.min(actionVerbs.length * 10, 100);

    // 4. Length/formatting score (10% weight)
    const wordCount = resumeText.split(/\s+/).length;
    let lengthScore = 0;
    if (wordCount >= 200 && wordCount <= 800) lengthScore = 100;
    else if (wordCount > 800) lengthScore = 70;
    else if (wordCount >= 100) lengthScore = 60;
    else lengthScore = 30;

    // 5. Quantifiable metrics (10% weight)
    const hasNumbers = (resumeText.match(/\d+%|\d+\+|\$\d+/g) || []).length;
    const metricsScore = Math.min(hasNumbers * 20, 100);

    const totalScore = Math.round(
        (skillScore * 0.50) +
        (sectionScore * 0.20) +
        (verbScore * 0.10) +
        (lengthScore * 0.10) +
        (metricsScore * 0.10)
    );

    return Math.min(totalScore, 100);
}

function generateSuggestions(resumeSkills, jdSkills, sections, actionVerbs, resumeText) {
    const suggestions = [];
    const missingSkills = jdSkills.filter(s => !resumeSkills.includes(s));

    if (missingSkills.length > 0) {
        suggestions.push({
            type: 'critical',
            title: 'Add Missing Keywords',
            description: `Your resume is missing ${missingSkills.length} key skill(s) from the job description: ${missingSkills.slice(0, 5).join(', ')}${missingSkills.length > 5 ? '...' : ''}. Add these naturally into your skills or experience sections.`,
        });
    }

    const missingSections = sections.filter(s => !s.present);
    if (missingSections.length > 0) {
        suggestions.push({
            type: 'warning',
            title: 'Missing Resume Sections',
            description: `Consider adding: ${missingSections.map(s => s.name).join(', ')}. ATS systems look for standard resume sections.`,
        });
    }

    if (actionVerbs.length < 5) {
        suggestions.push({
            type: 'improvement',
            title: 'Use More Action Verbs',
            description: 'Start bullet points with strong action verbs like "Developed", "Implemented", "Optimized", "Led", "Achieved" to make your experience more impactful.',
        });
    }

    const wordCount = resumeText.split(/\s+/).length;
    if (wordCount < 200) {
        suggestions.push({
            type: 'warning',
            title: 'Resume Too Short',
            description: 'Your resume appears too brief. Aim for 300-700 words. Add more details about your experiences, projects, and skills.',
        });
    } else if (wordCount > 800) {
        suggestions.push({
            type: 'improvement',
            title: 'Consider Trimming',
            description: 'Your resume is quite long. For most roles, keep it concise (1-2 pages). Focus on the most relevant experiences.',
        });
    }

    const hasNumbers = (resumeText.match(/\d+%|\d+\+|\$\d+/g) || []).length;
    if (hasNumbers < 2) {
        suggestions.push({
            type: 'improvement',
            title: 'Add Quantifiable Metrics',
            description: 'Include numbers and percentages to quantify your impact, e.g., "Improved page load speed by 40%" or "Managed a team of 5 engineers".',
        });
    }

    const matchedCount = jdSkills.filter(s => resumeSkills.includes(s)).length;
    const matchPercent = jdSkills.length > 0 ? Math.round((matchedCount / jdSkills.length) * 100) : 0;
    if (matchPercent >= 70) {
        suggestions.push({
            type: 'positive',
            title: 'Strong Keyword Match',
            description: `Your resume matches ${matchPercent}% of the job description keywords. Great alignment!`,
        });
    }

    return suggestions;
}

// @desc    Analyze resume against job description
// @route   POST /api/resume/analyze
const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a PDF resume' });
        }

        const jobDescription = req.body.jobDescription || '';
        if (!jobDescription.trim()) {
            return res.status(400).json({ message: 'Please provide a job description' });
        }

        // Extract text from PDF
        let resumeText = '';
        try {
            const pdfData = await pdfParse(req.file.buffer);
            resumeText = pdfData.text || '';
        } catch (pdfErr) {
            console.error('PDF parse error:', pdfErr.message);
            return res.status(400).json({ message: 'Could not parse the PDF file. The file may be corrupted or image-based. Error: ' + pdfErr.message });
        }

        if (!resumeText || resumeText.trim().length < 50) {
            return res.status(400).json({ message: 'Could not extract sufficient text from the PDF. Please ensure it is not an image-based PDF.' });
        }

        // Analyze
        const resumeSkills = extractSkillsFromText(resumeText);
        const jdSkills = extractJDRequirements(jobDescription);
        const sections = analyzeSections(resumeText);
        const actionVerbs = countActionVerbs(resumeText);

        const matchedSkills = resumeSkills.filter(s => jdSkills.includes(s));
        const missingSkills = jdSkills.filter(s => !resumeSkills.includes(s));
        const extraSkills = resumeSkills.filter(s => !jdSkills.includes(s));

        const atsScore = calculateATSScore(resumeSkills, jdSkills, sections, actionVerbs, resumeText);
        const suggestions = generateSuggestions(resumeSkills, jdSkills, sections, actionVerbs, resumeText);

        res.json({
            atsScore,
            matchedSkills,
            missingSkills,
            extraSkills,
            suggestions,
            sectionAnalysis: sections,
            stats: {
                totalResumeSkills: resumeSkills.length,
                totalJDSkills: jdSkills.length,
                matchPercent: jdSkills.length > 0 ? Math.round((matchedSkills.length / jdSkills.length) * 100) : 0,
                wordCount: resumeText.split(/\s+/).length,
                actionVerbCount: actionVerbs.length,
                actionVerbs,
            },
        });
    } catch (error) {
        console.error('Resume analysis error:', error.message, error.stack);
        res.status(500).json({ message: 'Failed to analyze resume: ' + error.message });
    }
};

module.exports = { analyzeResume };
