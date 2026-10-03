import https from 'https';

const tryModel = (modelName, apiKey, postData) => {
    return new Promise((resolve, reject) => {
        const req = https.request(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            },
            (res) => {
                let data = '';
                res.on('data', (chunk) => (data += chunk));
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            const reply = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (reply) {
                                resolve(reply);
                            } else {
                                reject(new Error('Empty response from model'));
                            }
                        } else {
                            reject(new Error(parsed.error?.message || `Status ${res.statusCode}`));
                        }
                    } catch (err) {
                        reject(new Error('JSON parse error'));
                    }
                });
            }
        );

        req.on('error', (err) => reject(err));
        req.write(postData);
        req.end();
    });
};

export const callGeminiAPI = async (prompt, systemInstruction = '') => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured in backend .env');
    }

    const payload = {
        contents: [
            {
                parts: [
                    {
                        text: prompt
                    }
                ]
            }
        ]
    };

    if (systemInstruction) {
        payload.systemInstruction = {
            parts: [{ text: systemInstruction }]
        };
    }

    const postData = JSON.stringify(payload);

    // Try primary model, fallback if busy
    const candidateModels = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.7-flash'];

    for (const model of candidateModels) {
        try {
            const reply = await tryModel(model, apiKey, postData);
            return reply;
        } catch (err) {
            console.warn(`Model ${model} failed, trying next fallback:`, err.message);
        }
    }

    throw new Error('All Gemini models are temporarily busy. Please retry in a moment.');
};
