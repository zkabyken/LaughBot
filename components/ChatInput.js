import { useState } from 'react';

export default function ChatInput({ onSend }) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSend(input);
        setInput('');
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type something you want to make fun of ..."
                style={{ flex: 1, padding: '0.5rem', fontSize: '1rem' }}
            />
            <button type="submit" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
                Send
            </button>
        </form>
    );
}
