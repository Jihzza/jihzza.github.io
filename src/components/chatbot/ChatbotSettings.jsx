// src/components/chatbot/ChatbotSettings.jsx
import React, { useState } from 'react';
import { chatbotService } from '../../services/chatbotService';

export default function ChatbotSettings({ onClose }) {
  const [selectedModel, setSelectedModel] = useState(chatbotService.model);
  const [isChanged, setIsChanged] = useState(false);

  const availableModels = chatbotService.getAvailableModels();
  
  const modelDescriptions = {
    'gpt-3.5-turbo': 'Fast and cost-effective - Good for basic conversations',
    'gpt-4o-mini': 'Balanced performance and cost - Recommended for testing',
    'gpt-4o': 'More capable responses - Higher cost',
    'gpt-4-turbo': 'Most capable - Highest cost'
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
    setIsChanged(model !== chatbotService.model);
  };

  const handleSave = () => {
    chatbotService.setModel(selectedModel);
    setIsChanged(false);
    onClose();
  };

  const handleCancel = () => {
    setSelectedModel(chatbotService.model);
    setIsChanged(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#002147] border border-white/20 rounded-xl p-6 max-w-md w-full text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Chatbot Settings</h2>
          <button
            onClick={handleCancel}
            className="text-white/70 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              OpenAI Model
            </label>
            <div className="space-y-2">
              {availableModels.map((model) => (
                <label key={model} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="model"
                    value={model}
                    checked={selectedModel === model}
                    onChange={(e) => handleModelChange(e.target.value)}
                    className="mt-0.5 text-[#BFA200] focus:ring-[#BFA200]"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{model}</div>
                    <div className="text-xs text-white/70">
                      {modelDescriptions[model]}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-3 text-xs text-white/80">
            <div className="font-medium mb-1">Current Configuration:</div>
            <div>Model: {chatbotService.model}</div>
            <div>Status: {chatbotService.openaiApiKey ? 'API key configured' : 'API key missing'}</div>
          </div>

          {!chatbotService.openaiApiKey && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-xs">
              <div className="font-medium text-yellow-400 mb-1">⚠️ OpenAI API Key Required</div>
              <div className="text-yellow-200">
                Add VITE_OPENAI_API_KEY to your .env file to enable the chatbot functionality.
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm text-white/70 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isChanged}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
              isChanged
                ? 'bg-[#BFA200] text-black hover:opacity-90'
                : 'bg-black/20 text-white/50 cursor-not-allowed'
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
