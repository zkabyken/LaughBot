export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { prompt, style } = req.body;
    if (!prompt) {
        console.error("Error: No prompt provided in the request body.");
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
        console.log("Sending request to Mistral API with prompt:", comedicPrompt);
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
            },
            body: JSON.stringify({
                model: "mistral-tiny",
                messages: [
                    {
                        role: "user",
                        content: comedicPrompt
                    }
                ],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Mistral API responded with an error:", response.status, errorData);
            throw new Error(`Mistral API error: ${errorData}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content || "No response from API";
        console.log("Mistral API responded successfully with:", aiResponse);

        res.status(200).json({ response: aiResponse });
    } catch (error) {
        console.error("Error in /api/chat handler:", error);
        res.status(500).json({ error: error.message || 'Something went wrong' });
    }
}
