import React, { useState } from 'react';
import axios from 'axios';
import './voiceInput.css';

const VoiceInput = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleIntroduceSubmit = async () => {
    setIsProcessing(true);
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/introduce');
      setResponse(res.data.response);

      if (!('speechSynthesis' in window)) {
        console.error("Speech synthesis not supported in this browser.");
        return;
      }

      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(res.data.response);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error fetching response:', error);
      setResponse('Error fetching response. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuestionSubmit = async () => {
    if (!input.trim()) return;

    setIsProcessing(true);
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/answer', { question: input });
      setResponse(res.data.answer || res.data.error || "Sorry, I couldn't process your question.");

      if (!('speechSynthesis' in window)) {
        console.error("Speech synthesis not supported in this browser.");
        return;
      }

      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(res.data.answer || res.data.error);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error response:', error.response?.data || error.message);
      setResponse(error.response?.data?.error || 'Error processing your question. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="voice-input-container">
      <h1>Voxilla Voice Assistant</h1>
      <div className="input-button-group">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask me something..."
        />
        <button onClick={handleQuestionSubmit} disabled={isProcessing}>
          {isProcessing ? (
            <span className="loading-icon">⏳</span>
          ) : (
            <span>❓ Ask</span>
          )}
        </button>
        <button onClick={handleIntroduceSubmit} disabled={isProcessing}>
          {isProcessing ? (
            <span className="loading-icon">⏳</span>
          ) : (
            <span>👋 Introduce</span>
          )}
        </button>
      </div>

      {isSpeaking && (
        <div className="wave-container">
          <div className="wave"></div>
        </div>
      )}

      {response && (
        <p>
          <span className="typing-effect">{response}</span>
        </p>
      )}
    </div>
  );
};

export default VoiceInput;
