import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatInterface() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resolvedBase =
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
    (typeof window !== 'undefined' && window.location.origin.includes('localhost:5173')
      ? 'http://localhost:8000'
      : window.location.origin);
  const apiBase = resolvedBase?.replace(/\/$/, '') || '';
  const chatEndpoint = `${apiBase}/api/v1/chat`;

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Call the backend API
      const response = await fetch(chatEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          chat_history: messages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) {
        const rawText = await response.text();
        let detail = 'Failed to get response from the server';
        try {
          const parsed = JSON.parse(rawText);
          detail = parsed.detail || detail;
        } catch {
          if (rawText) detail = rawText;
        }
        throw new Error(detail);
      }

      const data = await response.json();
      
      // Add AI response
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const message = error instanceof Error ? error.message : 'Failed to get response from the AI. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !isLoading) {
        const form = document.querySelector('form');
        form?.requestSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading]);

  return (
    <Card className="w-full max-w-4xl mx-auto h-[80vh] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold text-purple-800">
          WomenWealthWave.AI
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your personal financial literacy assistant
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
            <Bot className="h-16 w-16 mb-4 text-purple-200" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              Welcome to WomenWealthWave.AI
            </h3>
            <p className="max-w-md">
              Ask me anything about personal finance, investments, or money management.
              I'm here to help you build financial confidence and independence.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
              <Button 
                variant="outline" 
                className="h-auto py-3 justify-start text-left"
                onClick={() => setInput('How can I start investing with a small amount?')}
              >
                <div>
                  <div className="font-medium">Investing</div>
                  <div className="text-xs text-muted-foreground">How to start with limited funds</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-3 justify-start text-left"
                onClick={() => setInput('How can I create a budget that works for me?')}
              >
                <div>
                  <div className="font-medium">Budgeting</div>
                  <div className="text-xs text-muted-foreground">Create a personal budget</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-3 justify-start text-left"
                onClick={() => setInput('What are some ways to save for retirement?')}
              >
                <div>
                  <div className="font-medium">Retirement</div>
                  <div className="text-xs text-muted-foreground">Planning for the future</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-3 justify-start text-left"
                onClick={() => setInput('How can I negotiate a higher salary?')}
              >
                <div>
                  <div className="font-medium">Career</div>
                  <div className="text-xs text-muted-foreground">Salary negotiation tips</div>
                </div>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse text-right' : 'flex-row'}`}>
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                    <Bot className="h-4 w-4 text-purple-600" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.content}
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                    <User className="h-4 w-4 text-purple-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg max-w-[80%] rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="w-full flex gap-2">
          <div className="relative flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about financial literacy..."
              className="min-h-[44px] max-h-32 resize-none pr-10"
              rows={1}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="absolute right-2 bottom-2 text-xs text-muted-foreground">
              {isLoading ? 'AI is thinking...' : 'Press Enter to send'}
            </div>
          </div>
          <Button 
            type="submit" 
            size="icon" 
            className="h-10 w-10"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
