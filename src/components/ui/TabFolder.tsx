'use client';

import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabFolderProps {
  tabs: Tab[];
}

export default function TabFolder({
  tabs,
}: TabFolderProps): React.ReactElement {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id || '');

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-300 bg-white">
      {/* Tab headers */}
      <div className="flex border-b border-gray-300 bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTabId === tab.id
                ? 'border-b-2 border-blue-500 bg-white text-gray-900'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6">{activeTab?.content}</div>
    </div>
  );
}
