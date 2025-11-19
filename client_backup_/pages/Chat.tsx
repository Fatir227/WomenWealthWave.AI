import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Send, User, Bot } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  error?: boolean;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ageGroup, setAgeGroup] = useState<'15-20' | '21-28' | '29-35'>('21-28');
  const [region, setRegion] = useState<'india' | 'international'>('india');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Add a temporary AI message with loading state
      const tempAiMessage: Message = {
        id: `temp-${Date.now()}`,
        content: 'Thinking...',
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, tempAiMessage]);
      
      // Call the API
      const response = await fetch('http://localhost:8000/api/v1/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: input,
          age_group: ageGroup,
          region: region,
          language: 'en'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from the server');
      }

      const data = await response.json();
      
      // Update the temporary message with the actual response
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== tempAiMessage.id),
        {
          ...tempAiMessage,
          id: Date.now().toString(),
          content: data.answer || 'I apologize, but I couldn\'t generate a response. Please try again.',
        }
      ]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response from the AI. Please try again.',
        variant: 'destructive',
      });
      
      // Update the temporary message with error state
      setMessages(prev => [
        ...prev.filter(msg => !msg.id.startsWith('temp-')),
        {
          id: Date.now().toString(),
          content: 'Sorry, I encountered an error. Please try again.',
          sender: 'ai',
          timestamp: new Date(),
          error: true,
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !isLoading) {
        formRef.current?.requestSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading]);

  return (
    <div className="container mx-auto p-2 sm:p-4 max-w-4xl h-[calc(100vh-4rem)] flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b bg-muted/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <CardTitle className="text-xl sm:text-2xl">Financial Literacy Assistant</CardTitle>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Select value={ageGroup} onValueChange={(v: '15-20' | '21-28' | '29-35') => setAgeGroup(v)}>
                  <SelectTrigger className="w-full sm:w-28">
                    <SelectValue placeholder="Age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15-20">15-20</SelectItem>
                    <SelectItem value="21-28">21-28</SelectItem>
                    <SelectItem value="29-35">29-35</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={region} onValueChange={(v: 'india' | 'international') => setRegion(v)}>
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <Bot className="h-12 w-12 mb-4 text-muted-foreground/30" />
              <h3 className="text-xl font-semibold mb-2">Welcome to Financial Literacy Assistant</h3>
              <p className="max-w-md">Ask me anything about personal finance, investments, or money management.</p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                <Button 
                  variant="outline" 
                  className="h-auto py-2 justify-start text-left"
                  onClick={() => setInput('How can I start investing with a small amount?')}
                >
                  <div>
                    <div className="font-medium">Investing</div>
                    <div className="text-xs text-muted-foreground">How to start with ₹5000?</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-2 justify-start text-left"
                  onClick={() => setInput('What are the best ways to save money each month?')}
                >
                  <div>
                    <div className="font-medium">Saving</div>
                    <div className="text-xs text-muted-foreground">Monthly savings strategies</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-2 justify-start text-left"
                  onClick={() => setInput('Explain compound interest with an example')}
                >
                  <div>
                    <div className="font-medium">Concepts</div>
                    <div className="text-xs text-muted-foreground">Learn financial concepts</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-2 justify-start text-left"
                  onClick={() => setInput('What are the tax benefits of different investments?')}
                >
                  <div>
                    <div className="font-medium">Taxation</div>
                    <div className="text-xs text-muted-foreground">Tax-saving options</div>
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex gap-2 max-w-[90%] sm:max-w-[80%]">
                      {message.sender === 'ai' && (
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                            : 'bg-muted rounded-tl-none' + (message.error ? ' border border-red-200 bg-red-50' : '')
                        }`}
                      >
                        {message.content}
                        {message.sender === 'ai' && !message.error && (
                          <div className="text-xs text-muted-foreground mt-1 opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        )}
                      </div>
                      {message.sender === 'user' && (
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="border-t p-2 sm:p-4 bg-muted/30">
          <form ref={formRef} onSubmit={handleSubmit} className="w-full flex gap-2">
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
                    if (!isLoading) {
                      formRef.current?.requestSubmit();
                    }
                  }
                }}
              />
              <div className="absolute right-2 bottom-2 text-xs text-muted-foreground">
                {isMobile ? '⏎' : '⌘⏎'}
              </div>
            </div>
            <Button 
              type="submit" 
              size={isMobile ? 'icon' : 'default'}
              className="h-10 w-10 sm:w-auto sm:px-4"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isMobile ? (
                <Send className="h-4 w-4" />
              ) : (
                'Send'
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>
      
    </div>
  );
}
