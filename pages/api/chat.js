export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { prompt, style } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'No prompt provided' });
    }

    let comedicPrompt = prompt;
    switch (style) {
        case 'Joke':
            comedicPrompt = `Tell me a hilarious joke about "${prompt}".`;
            break;
        case 'Pun':
            comedicPrompt = `Give me a clever pun involving "${prompt}".`;
            break;
        case 'Stand-up':
            comedicPrompt = `Perform a short stand-up comedy routine on "${prompt}".`;
            break;
        default:
            comedicPrompt = `Respond with something funny about "${prompt}".`;
    }

    try {
        const response = await fetch('https://api.mistral.ai/v1/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
            },
            body: JSON.stringify({
                prompt: comedicPrompt,
                max_tokens: 150
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Mistral API error: ${errorData}`);
        }

        const data = await response.json();
        const aiResponse = data.generated_text || "No response from API";

        res.status(200).json({ response: aiResponse });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Something went wrong' });
    }
}
