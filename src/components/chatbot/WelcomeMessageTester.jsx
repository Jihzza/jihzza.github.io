// src/components/chatbot/WelcomeMessageTester.jsx
// Development utility for testing welcome message functionality

import React, { useState } from 'react';
import { chatbotService } from '../../services/chatbotService';
import { useAuth } from '../../contexts/AuthContext';

export default function WelcomeMessageTester({ onClose }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [testSessionId, setTestSessionId] = useState(() => `test-${Date.now()}`);

  const generateNewSessionId = () => {
    setTestSessionId(`test-${Date.now()}`);
    setResult(null);
  };

  const testWelcomeMessage = async () => {
    if (!user) {
      setResult({ error: 'User not authenticated' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const welcomeResult = await chatbotService.generateWelcomeMessage(user.id, testSessionId);
      setResult(welcomeResult);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const testExistingWelcome = async () => {
    if (!user) {
      setResult({ error: 'User not authenticated' });
      return;
    }

    setIsLoading(true);

    try {
      // First call should generate a new message
      const firstResult = await chatbotService.generateWelcomeMessage(user.id, testSessionId);
      
      // Second call should return existing message
      const secondResult = await chatbotService.generateWelcomeMessage(user.id, testSessionId);
      
      setResult({
        firstCall: firstResult,
        secondCall: secondResult,
        test: secondResult.alreadyExists ? 'PASSED: Second call returned existing message' : 'FAILED: Second call generated new message'
      });
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#002147] border border-white/20 rounded-xl p-6 max-w-2xl w-full text-white shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Welcome Message Tester</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-3 text-xs">
            <div className="font-medium mb-2">Current Configuration:</div>
            <div>Model: {chatbotService.model}</div>
            <div>User ID: {user?.id || 'Not authenticated'}</div>
            <div>Test Session ID: {testSessionId}</div>
            <div>API Key: {chatbotService.openaiApiKey ? '✅ Configured' : '❌ Missing'}</div>
          </div>

          <div className="space-y-2">
            <button
              onClick={generateNewSessionId}
              className="w-full bg-black/20 text-white px-3 py-2 rounded text-sm hover:bg-black/30 transition"
            >
              🔄 Generate New Session ID
            </button>

            <button
              onClick={testWelcomeMessage}
              disabled={isLoading || !user}
              className="w-full bg-[#BFA200] text-black px-3 py-2 rounded text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '⏳ Testing...' : '🧪 Test Welcome Message'}
            </button>

            <button
              onClick={testExistingWelcome}
              disabled={isLoading || !user}
              className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '⏳ Testing...' : '🔄 Test Session Uniqueness (2 calls)'}
            </button>
          </div>

          {result && (
            <div className="mt-4 p-3 rounded-lg bg-black/30">
              <div className="font-medium mb-2 text-[#BFA200]">Test Result:</div>
              <pre className="text-xs whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>

              {result.message && (
                <div className="mt-2 p-2 bg-green-500/20 rounded text-sm">
                  <strong>Generated Message:</strong> "{result.message}"
                  <div className="text-xs mt-1 opacity-75">
                    Length: {result.message.length} characters {result.message.length <= 50 ? '✅' : '❌ (over 50)'}
                  </div>
                </div>
              )}

              {result.test && (
                <div className={`mt-2 p-2 rounded text-sm ${
                  result.test.includes('PASSED') ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  <strong>Session Test:</strong> {result.test}
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-white/70 mt-4 space-y-1">
            <div><strong>Testing Instructions:</strong></div>
            <div>1. <strong>Test Welcome Message</strong>: Generates a welcome message for the current session</div>
            <div>2. <strong>Test Session Uniqueness</strong>: Makes 2 calls with same session_id to verify only 1 welcome per session</div>
            <div>3. <strong>Generate New Session ID</strong>: Creates a new test session to test fresh welcome messages</div>
            <div className="mt-2 text-yellow-300">
              <strong>Expected:</strong> Welcome messages should be ≤50 characters and only generated once per session_id
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white/70 hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
