import React, { useState } from 'react';
import axios from 'axios';
import './voiceInput.css';

const VoiceInput = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // New state to manage speaking

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      const res = await axios.post('http://localhost:5000/api/response', { input });
      setResponse(res.data.response);

      // Create a new SpeechSynthesisUtterance and speak the response
      const utterance = new SpeechSynthesisUtterance(res.data.response);
      
      // Set the speaking state to true when the speech starts
      utterance.onstart = () => setIsSpeaking(true);

      // Set the speaking state to false when the speech ends
      utterance.onend = () => setIsSpeaking(false);

      // Speak the text
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error fetching response:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="voice-input-container">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Ask me something..."
      />
      <button onClick={handleSubmit}>Ask</button>
      
      {/* Show the wave animation only when speaking */}
      {isSpeaking && (
        <div className="wave-container">
          <div className="wave"></div>
        </div>
      )}

      {response && <p>{response}</p>}
    </div>
  );
};

export default VoiceInput;
