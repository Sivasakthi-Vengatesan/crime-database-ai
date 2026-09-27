import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ChatFeed } from './components/ChatFeed';
import { ChatInput } from './components/ChatInput';
import { ComplaintSection } from './components/ComplaintSection';
import { ComplaintTracker } from './components/ComplaintTracker';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { CaseLedger } from './components/CaseLedger';
import { SosModal } from './components/SosModal';
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
  const [activeMode, setActiveMode] = useState<string>('chat');
  const [trackerInitialNumber, setTrackerInitialNumber] = useState<string>('');

  const [sessions, setSessions] = useState<ConversationSession[]>(() => [
    {
      id: 'session-1',
      title: 'Vehicle Theft Analysis',
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
  const [isSosOpen, setIsSosOpen] = useState<boolean>(false);

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

      // Refresh database stats count
      fetchDatabaseStats().then(setStats);
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
      title: 'New Investigation Query',
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

  const handleInvestigateInChat = (caseId: string, promptText: string) => {
    setActiveMode('chat');
    handleSendMessage(promptText);
  };

  const handleViewTracker = (trackingNumber: string) => {
    setTrackerInitialNumber(trackingNumber);
    setActiveMode('tracker');
  };

  return (
    <div className="flex h-screen w-screen bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      {/* Cyber Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        activeMode={activeMode}
        onSelectSession={setActiveSessionId}
        onSelectMode={setActiveMode}
        onNewChat={handleNewChat}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenSos={() => setIsSosOpen(true)}
        stats={stats}
      />

      {/* Main Command Center Canvas */}
      <div className="flex-1 flex flex-col h-screen min-w-0 md:pl-72 bg-[#07090e] grid-mesh relative">
        {/* Sticky Top Telemetry Bar */}
        <Header
          title={activeSession.title}
          activeMode={activeMode}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onClearChat={handleClearChat}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenSos={() => setIsSosOpen(true)}
          totalRecords={stats?.totalRecords || 105}
        />

        {/* Dynamic Mode Switcher Views */}
        {activeMode === 'chat' && (
          <>
            <ChatFeed
              messages={activeSession.messages}
              isLoading={isLoading}
              sampleQueries={sampleQueries}
              onSelectSampleQuery={handleSendMessage}
            />
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </>
        )}

        {activeMode === 'complaint' && (
          <ComplaintSection
            onInvestigateInChat={handleInvestigateInChat}
            onViewTracker={handleViewTracker}
          />
        )}

        {activeMode === 'tracker' && (
          <ComplaintTracker
            initialTrackingNumber={trackerInitialNumber}
            onInvestigateInChat={handleInvestigateInChat}
          />
        )}

        {activeMode === 'analytics' && (
          <AnalyticsDashboard onInvestigateInChat={handleInvestigateInChat} />
        )}

        {activeMode === 'ledger' && (
          <CaseLedger onInvestigateInChat={handleInvestigateInChat} />
        )}
      </div>

      {/* Emergency SOS Modal */}
      <SosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />

      {/* Telemetry & Architecture Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        stats={stats}
      />
    </div>
  );
};

export default App;
