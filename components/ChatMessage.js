export default function ChatMessage({ sender, text }) {
    const isUser = sender === 'user';
    return (
        <div style={{ margin: '0.5rem 0', textAlign: isUser ? 'right' : 'left' }}>
            <span
                style={{
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: isUser ? '#DCF8C6' : '#E5E5EA',
                    color: '#000',
                    maxWidth: '80%'
                }}
            >
                {text}
            </span>
        </div>
    );
}
