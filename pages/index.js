import { useState } from 'react';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';

export default function Home() {
    const [messages, setMessages] = useState([]);
    const [comedyStyle, setComedyStyle] = useState('Joke');

    const handleSend = async (userInput) => {
        // Append user's message to chat history
        const updatedMessages = [...messages, { sender: 'user', text: userInput }];
        setMessages(updatedMessages);

        // Add a placeholder for the AI's response
        const aiMessageIndex = updatedMessages.length;
        setMessages((prev) => [...prev, { sender: 'ai', text: 'Thinking...' }]);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userInput, style: comedyStyle })
            });
            const data = await res.json();
            // Replace placeholder with the actual comedic response
            setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[aiMessageIndex] = { sender: 'ai', text: data.response || 'No response' };
                return newMessages;
            });
        } catch (error) {
            setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[aiMessageIndex] = { sender: 'ai', text: 'Error: ' + error.message };
                return newMessages;
            });
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
            <h1>LaughBot Comedy Chat</h1>
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="comedyStyle">Choose Comedy Style: </label>
                <select
                    id="comedyStyle"
                    value={comedyStyle}
                    onChange={(e) => setComedyStyle(e.target.value)}
                    style={{ marginLeft: '0.5rem', padding: '0.5rem', fontSize: '1rem' }}
                >
                    <option value="Joke">Joke</option>
                    <option value="Pun">Pun</option>
                    <option value="Stand-up">Stand-up</option>
                    <option value="Random">Random</option>
                </select>
            </div>
            <div
                style={{
                    border: '1px solid #ccc',
                    padding: '1rem',
                    minHeight: '300px',
                    marginBottom: '1rem',
                    backgroundColor: '#fff9e6'
                }}
            >
                {messages.map((msg, index) => (
                    <ChatMessage key={index} sender={msg.sender} text={msg.text} />
                ))}
            </div>
            <ChatInput onSend={handleSend} />
            <footer style={{ marginTop: '2rem', color: '#888', fontSize: '0.9rem' }}>
                Made with ❤️ by Zhalyn Kabyken
            </footer>
        </div>
    );
}
