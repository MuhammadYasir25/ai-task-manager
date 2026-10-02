import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude client
const getAnthropicClient = () => {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey || apiKey === 'placeholder_for_now') {
        return null;
    }
    return new Anthropic({ apiKey });
};

/**
 * Intelligent Offline Solution Generator
 * Analyzes the user's task keywords and produces deep, structured, professional outputs
 */
const generateContextualOfflineSolution = (title, description = '') => {
    const text = `${title} ${description}`.toLowerCase();

    // If task is about CV / Resume
    if (text.includes('cv') || text.includes('resume')) {
        return `### 📄 Complete Guide & Essential Headings for a Winning CV

#### 1. Header & Contact Information
- **Full Name**: Large, bold font at the top.
- **Location**: City, Country (e.g., Islamabad, Pakistan).
- **Contact**: Professional Email, Phone Number, LinkedIn Profile, and GitHub Link.

#### 2. Professional Summary (3–4 Lines)
- Mention your exact title (e.g., *Full-Stack MERN Developer*).
- Highlight key technical strengths (React, Node.js, Express, MongoDB, REST APIs, AI integration).
- Mention years of hands-on experience or relevant certifications.

#### 3. Technical Skills (Categorized)
- **Frontend**: React.js, Tailwind CSS, JavaScript (ES6+), HTML5, CSS3, Responsive Design.
- **Backend**: Node.js, Express.js, REST APIs, JWT, Middleware, Role-Based Access Control.
- **Databases**: MongoDB, Mongoose, Database Schema Design.
- **Tools & Platforms**: Git, GitHub, VS Code, Postman, Docker, Linux.

#### 4. Projects (The Most Important Section for Developers!)
For each project, include:
- **Project Title & Tech Stack**: *AI Task Manager | React, Node.js, MongoDB, Claude API*
- **Bullet 1 (Action & Problem)**: Built an intelligent task management system using Claude API to automate user workflows.
- **Bullet 2 (Technical Details)**: Implemented secure JWT authentication and optimized MongoDB schemas.
- **Bullet 3 (Results & Features)**: Created dynamic priority visualizers and subtask progress tracking with 100% responsive UI.

#### 5. Education & Certifications
- Degree title, University name, and graduation year.
- Recognized certificates (e.g., Pearson VUE, ADAN Institute of Technology).

💡 **Pro Tips**:
- Keep it to 1 clean page.
- Always use action verbs (*Engineered, Developed, Deployed, Integrated*).
- Quantify achievements where possible.`;
    }

    // If task is about Authentication / JWT
    if (text.includes('auth') || text.includes('jwt') || text.includes('login')) {
        return `### 🔐 Production Architecture for JWT Authentication

#### 1. Registration Flow
- Hash passwords on the backend with **Bcrypt** using 10 salt rounds.
- Check for existing emails before inserting into MongoDB.

#### 2. Login Flow & Token Generation
- Compare plain text password with hashed password using \`bcrypt.compare()\`.
- Generate JWT signed with a secret key: \`jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })\`.

#### 3. Route Protection Middleware
- Extract Bearer token from \`req.headers.authorization\`.
- Verify token using \`jwt.verify()\` and attach authenticated user to \`req.user\`.
- Reject unauthorized requests with HTTP \`401 Unauthorized\`.`;
    }

    // General Detailed Blueprint for any other task
    return `### 📋 Comprehensive Execution Plan for: ${title}

#### 1. Strategic Objective
${description ? `Context: ${description}\n` : ''}Execute all core deliverables efficiently using industry-standard engineering practices.

#### 2. Key Action Steps:
- **Phase 1 (Preparation)**: Gather requirements, configure environment, and establish measurable acceptance criteria.
- **Phase 2 (Implementation)**: Build the primary features modularly with proper separation of concerns.
- **Phase 3 (Testing & Verification)**: Perform end-to-end testing, error handling, and performance checks.
- **Phase 4 (Final Delivery)**: Document the solution and prepare for deployment or submission.

#### 3. Verification & Outcome
- All primary objectives verified against quality standards.
- Ready for immediate production usage or portfolio presentation.`;
};

/**
 * Task Breakdown & Auto-Analysis
 */
export const analyzeTaskWithClaude = async (title, description = '') => {
    const client = getAnthropicClient();

    if (!client) {
        const text = `${title} ${description}`.toLowerCase();

        // Tailored subtasks for CV
        if (text.includes('cv') || text.includes('resume')) {
            return {
                subtasks: [
                    { title: 'Draft professional summary highlighting MERN & AI skills', completed: false },
                    { title: 'Categorize technical skills (Frontend, Backend, Databases, Tools)', completed: false },
                    { title: 'Write 3 impact-focused bullet points for each portfolio project', completed: false },
                    { title: 'Add Pearson VUE certifications and degree details', completed: false },
                    { title: 'Proofread for formatting consistency and ATS keywords', completed: false },
                ],
                priority: 'High',
                priorityReason: 'A strong, well-structured CV is critical for landing developer interviews.',
                suggestedDaysToComplete: 1,
                productivityTips: [
                    'Use bullet points starting with strong action verbs (Developed, Implemented, Integrated).',
                    'Ensure your GitHub links and LinkedIn URLs are clickable.',
                ],
            };
        }

        // Default intelligent breakdown
        return {
            subtasks: [
                { title: `Define requirements and scope for: ${title}`, completed: false },
                { title: `Implement core architectural components`, completed: false },
                { title: `Conduct functional verification and edge-case testing`, completed: false },
                { title: `Final review and deployment`, completed: false },
            ],
            priority: 'High',
            priorityReason: 'High priority determined by project impact and dependencies.',
            suggestedDaysToComplete: 3,
            productivityTips: [
                'Break the largest subtask into 20-minute focused sprints.',
                'Document decisions as you build to make code reviews easy.',
            ],
        };
    }

    // Real Claude API Call if key is provided
    const prompt = `You are an expert AI productivity assistant.
Analyze this user task:
Title: "${title}"
Description: "${description}"

Respond ONLY with a valid JSON object:
{
  "subtasks": [{"title": "Step 1", "completed": false}],
  "priority": "Low" | "Medium" | "High" | "Urgent",
  "priorityReason": "Reason",
  "suggestedDaysToComplete": 3,
  "productivityTips": ["Tip 1", "Tip 2"]
}`;

    try {
        const response = await client.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1000,
            messages: [{ role: 'user', content: prompt }],
        });
        return JSON.parse(response.content[0].text.trim());
    } catch (error) {
        console.error('Claude API Error:', error.message);
        return {
            subtasks: [{ title: `Complete ${title}`, completed: false }],
            priority: 'Medium',
            priorityReason: 'Default fallback',
            suggestedDaysToComplete: 2,
            productivityTips: ['Focus on one task at a time.'],
        };
    }
};

/**
 * Execute / Solve Task
 */
export const executeTaskWithClaude = async (title, description = '') => {
    const client = getAnthropicClient();

    if (!client) {
        return generateContextualOfflineSolution(title, description);
    }

    const prompt = `You are an expert AI problem solver.
Task Title: "${title}"
Description: "${description}"

Provide the complete, high quality solution or execution for this task in clean Markdown formatting.`;

    try {
        const response = await client.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1500,
            messages: [{ role: 'user', content: prompt }],
        });
        return response.content[0].text.trim();
    } catch (error) {
        console.error('Claude API execution error:', error.message);
        return generateContextualOfflineSolution(title, description);
    }
};
