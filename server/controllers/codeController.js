const axios = require('axios');

const JUDGE0_URL = 'https://judge0-ce.p.rapidapi.com';

const LANGUAGE_MAP = {
    'c': 50,
    'cpp': 54,
    'java': 62,
    'python': 71,
    'javascript': 63,
};

// @desc    Run code via Judge0 API
// @route   POST /api/code/run
// @access  Private
const runCode = async (req, res) => {
    const { language_id, source_code, stdin } = req.body;

    if (!language_id || !source_code) {
        return res.status(400).json({ message: 'language_id and source_code are required' });
    }

    const apiKey = process.env.RAPIDAPI_KEY;

    if (!apiKey || apiKey === 'your_rapidapi_key_here') {
        // Fallback mock mode when no API key is configured
        return res.status(200).json({
            stdout: 'Hello, World!\n',
            stderr: null,
            compile_output: null,
            status: { id: 3, description: 'Accepted' },
            time: '0.01',
            memory: 1024,
            message: '⚠️ Running in mock mode — add RAPIDAPI_KEY to .env for real execution',
        });
    }

    try {
        // Step 1: Submit code to Judge0
        const submitResponse = await axios.post(
            `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
            {
                language_id: parseInt(language_id),
                source_code,
                stdin: stdin || '',
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': apiKey,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                },
            }
        );

        const { token } = submitResponse.data;

        if (!token) {
            return res.status(500).json({ message: 'Failed to get submission token from Judge0' });
        }

        // Step 2: Poll for results (max 10 attempts, 1.5s interval)
        let result = null;
        for (let i = 0; i < 10; i++) {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const pollResponse = await axios.get(
                `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`,
                {
                    headers: {
                        'X-RapidAPI-Key': apiKey,
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                    },
                }
            );

            // Status IDs: 1 = In Queue, 2 = Processing, 3+ = Done
            if (pollResponse.data.status.id > 2) {
                result = pollResponse.data;
                break;
            }
        }

        if (!result) {
            return res.status(408).json({ message: 'Code execution timed out. Try again.' });
        }

        res.status(200).json({
            stdout: result.stdout,
            stderr: result.stderr,
            compile_output: result.compile_output,
            status: result.status,
            time: result.time,
            memory: result.memory,
        });
    } catch (error) {
        console.error('Judge0 API error:', error.response?.data || error.message);

        if (error.response?.status === 429) {
            return res.status(429).json({ message: 'Rate limit exceeded. Please wait and try again.' });
        }

        res.status(500).json({
            message: 'Code execution failed',
            error: error.response?.data?.message || error.message,
        });
    }
};

module.exports = { runCode };
