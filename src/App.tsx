import React, { useState } from 'react';
import { Sparkles, Wand2, BookOpen, Play, Zap } from 'lucide-react';

interface GeneratedContent {
  genre?: string;
  tone?: string;
  outline?: string;
  scene?: string;
  dialogue?: string;
  error?: string;
}

function App() {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const samplePrompts = [
    "A cyberpunk detective story in Neo-Tokyo",
    "A magical academy for gifted children",
    "A time-travel romance in Victorian London",
    "A survival horror in a space station",
    "A fantasy epic about ancient prophecies"
  ];

  const handleSampleClick = (prompt: string) => {
    setUserInput(prompt);
  };

  const handleGenerate = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: userInput
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedContent(data);
    } catch (error) {
      console.error('Error generating screenplay:', error);
      setGeneratedContent({
        error: 'Failed to generate screenplay. Make sure the backend server is running on port 8000.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatGeneratedContent = () => {
    if (!generatedContent) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <BookOpen className="w-16 h-16 text-purple-400 mb-4 opacity-50" />
          <p className="text-gray-400 text-lg">Your creative masterpiece will appear here...</p>
          <p className="text-gray-500 text-sm mt-2">Let your imagination run wild!</p>
        </div>
      );
    }

    if (generatedContent.error) {
      return (
        <div className="flex items-center space-x-3 text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-500/30">
          <Zap className="w-5 h-5" />
          <span>{generatedContent.error}</span>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {generatedContent.genre && generatedContent.tone && (
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-lg border border-purple-500/20">
            <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Story Elements
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Genre</p>
                <p className="text-white font-medium">{generatedContent.genre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Tone</p>
                <p className="text-white font-medium">{generatedContent.tone}</p>
              </div>
            </div>
          </div>
        )}

        {generatedContent.outline && (
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/20">
            <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Plot Outline
            </h3>
            <p className="text-gray-200 leading-relaxed">{generatedContent.outline}</p>
          </div>
        )}

        {generatedContent.scene && (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20">
            <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center">
              <Play className="w-5 h-5 mr-2" />
              Key Scene
            </h3>
            <p className="text-gray-200 leading-relaxed">{generatedContent.scene}</p>
          </div>
        )}

        {generatedContent.dialogue && (
          <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 p-4 rounded-lg border border-orange-500/20">
            <h3 className="text-lg font-semibold text-orange-300 mb-3 flex items-center">
              <Wand2 className="w-5 h-5 mr-2" />
              Dialogue
            </h3>
            <div className="text-gray-200 leading-relaxed whitespace-pre-line font-mono text-sm bg-black/20 p-3 rounded border border-orange-500/30">
              {generatedContent.dialogue}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full mr-4 animate-pulse-glow">
              <Sparkles className="w-8 h-8 text-white animate-float" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">
              Story Lab
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Transform your ideas into captivating narratives</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left Column - Input Section */}
          <div className="glass rounded-2xl p-8 shadow-2xl hover-lift">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Wand2 className="w-6 h-6 mr-3 text-purple-400" />
              Craft Your Story
            </h2>
            
            {/* Sample Prompts */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Quick Start Ideas</h3>
              <div className="grid grid-cols-1 gap-3">
                {samplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleClick(prompt)}
                    className="w-full text-left p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 rounded-xl text-gray-300 hover:text-white transition-all duration-300 text-sm border border-purple-500/20 hover:border-purple-500/40"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-3">
                Your Story Prompt
              </label>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Describe your story idea, characters, or setting..."
                className="w-full h-32 p-4 bg-black/30 text-white rounded-xl border border-purple-500/30 focus:border-purple-400 focus:outline-none resize-none placeholder-gray-500 backdrop-blur-sm"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!userInput.trim() || isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-purple-500/25"
            >
              {isLoading ? (
                <>
                  <div className="spinner w-5 h-5 mr-3"></div>
                  Weaving Your Story...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Story
                </>
              )}
            </button>
          </div>

                      {/* Right Column - Output Section */}
            <div className="glass rounded-2xl p-8 shadow-2xl hover-lift">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-blue-400" />
              Your Creation
            </h2>
            
            <div className="bg-black/30 rounded-xl p-6 h-full min-h-96 overflow-y-auto border border-white/10">
              <div className="text-gray-300">
                {formatGeneratedContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;