import React, { useState, useEffect } from 'react';
import { IconRail } from './components/IconRail';
import { ChatColumn } from './components/ChatColumn';
import { LivePreviewPanel } from './components/LivePreviewPanel';
import { Evidence } from './types/chat';
import { fetchDatabaseStats } from './api/chatApi';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [chatInitialQuery, setChatInitialQuery] = useState<string>('');
  const [totalRecords, setTotalRecords] = useState<number>(105);

  useEffect(() => {
    fetchDatabaseStats().then((res) => {
      if (res?.totalRecords) setTotalRecords(res.totalRecords);
    });
  }, []);

  const handleNewBuild = () => {
    setActiveTab('chat');
  };

  const handleSelectEvidence = (ev: Evidence) => {
    setSelectedEvidence(ev);
    setSelectedCaseId(ev.caseId);
  };

  const handleInvestigateInChat = (query: string) => {
    setActiveTab('chat');
    setChatInitialQuery(query);
  };

  return (
    <div className="flex h-screen w-screen bg-[#fcfdfc] text-[#131815] overflow-hidden select-none font-sans">
      {/* Zone 1: Slim 64px Left Icon Rail */}
      <IconRail
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onNewBuild={handleNewBuild}
        totalRecords={totalRecords}
      />

      {/* Zone 2: Fixed 452px Chat Column */}
      <ChatColumn
        onSelectEvidence={handleSelectEvidence}
        onSelectCaseId={setSelectedCaseId}
        initialQuery={chatInitialQuery}
      />

      {/* Zone 3: Flex Live-Preview Panel (Evidence Dossier / Database Ledger / SQL Pipeline) */}
      <LivePreviewPanel
        selectedEvidence={selectedEvidence}
        selectedCaseId={selectedCaseId}
        onInvestigateInChat={handleInvestigateInChat}
        activeModeTab={activeTab}
      />
    </div>
  );
};

export default App;
