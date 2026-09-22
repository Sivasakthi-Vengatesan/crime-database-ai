import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ChatFeed } from './components/ChatFeed';
import { ChatInput } from './components/ChatInput';
import { SettingsModal } from './components/SettingsModal';
import {
  ChatMessage,
  ConversationSession,
  DatabaseStats,
} from './types/chat';
import {
  sendChatMessage,
  fetchSampleQueries,
  fetchDatabaseStats,
  clearSessionApi,
} from './api/chatApi';

export const App: React.FC = () => {
  const [sessions, setSessions] = useState<ConversationSession[]>(() => [
    {
      id: 'session-1',
      title: 'Theft cases in Chennai',
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: [],
    },
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string>('session-1');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sampleQueries, setSampleQueries] = useState<string[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    fetchSampleQueries().then(setSampleQueries);
    fetchDatabaseStats().then(setStats);
  }, []);

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          const isFirstMessage = s.messages.length === 0;
          return {
            ...s,
            title: isFirstMessage ? (text.length > 28 ? `${text.slice(0, 28)}…` : text) : s.title,
            lastUpdated: userMsg.timestamp,
            messages: [...s.messages, userMsg],
          };
        }
        return s;
      })
    );

    setIsLoading(true);

    try {
      const response = await sendChatMessage(text, activeSessionId);

      const agentMsg: ChatMessage = {
        id: `msg-${Date.now()}-agent`,
        sender: 'agent',
        text: response.answer,
        evidence: response.evidence,
        reasoning: response.reasoning,
        terminalLog: response.terminalLog,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [...s.messages, agentMsg] } : s))
      );
    } catch (error: any) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        sender: 'agent',
        text: error.message || 'An error occurred while communicating with the database.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };

      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [...s.messages, errorMsg] } : s))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: ConversationSession = {
      id: newSessionId,
      title: 'New conversation',
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
  };

  const handleClearChat = async () => {
    await clearSessionApi(activeSessionId);
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [] } : s))
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#FAF6F0', // Cream canvas
        color: '#1A1A1A',
        overflow: 'hidden',
      }}
    >
      {/* 264px Left Sidebar on Paper #F4ECE1 */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewChat={handleNewChat}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        stats={stats}
      />

      {/* Main Single Scroll Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          minWidth: 0,
          backgroundColor: '#FAF6F0',
        }}
        className="md:pl-[264px]"
      >
        {/* Sticky Top Bar (Glass) */}
        <Header
          title={activeSession.title}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onClearChat={handleClearChat}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Centered Message Thread */}
        <ChatFeed
          messages={activeSession.messages}
          isLoading={isLoading}
          sampleQueries={sampleQueries}
          onSelectSampleQuery={handleSendMessage}
        />

        {/* Sticky Bottom Composer (Glass) */}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      {/* Telemetry & Info Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        stats={stats}
      />
    </div>
  );
};

export default App;
