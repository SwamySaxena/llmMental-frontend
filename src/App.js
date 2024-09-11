import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState('');

  const sendMessage = async () => {
    if (!input) return;

    setMessages([...messages, { text: input, type: 'user' }]);

    try {
      const response = await axios.post('http://localhost:5000/generate', { input }); // Simplified request without token
      setMessages(prevMessages => [...prevMessages, { text: response.data.text, type: 'bot' }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prevMessages => [...prevMessages, { text: 'Sorry, I am having trouble understanding right now.', type: 'bot' }]);
    }

    setInput('');
  };
  const submitFeedback = async () => {
    if (!feedback) return;

    try {
      await axios.post('http://localhost:5000/feedback', { feedback }); // Simplified request without token
      setFeedback('');
      alert('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Mental Health Support Bot</h1>
        <p>We're here to listen and help. Talk to us!</p>
        <small>
          Disclaimer: This is an AI-based tool and not a substitute for professional help. 
          If you're in crisis, please call the <a href="tel:+919152987821">National Suicide Prevention Lifeline</a>.
        </small>
      </header>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.type}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' ? sendMessage() : null}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div className="feedback-form">
        <h3>Provide Feedback</h3>
        <textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder="Was this information helpful?"
        />
        <button onClick={submitFeedback}>Submit Feedback</button>
      </div>
    </div>
  );
};

export default App;
