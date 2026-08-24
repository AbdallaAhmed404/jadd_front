"use client";
import React, { useState, createContext, useContext } from 'react';
import ChatDrawer from './ChatDrawer';

const ChatContext = createContext({ 
  toggleChat: () => {}, 
  openChat: (id: string) => {} 
});

export const useChat = () => useContext(ChatContext);

export default function ChatDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const toggleChat = () => setIsOpen(!isOpen);
  
  const openChat = (id: string) => {
    setActiveChatId(id);
    setIsOpen(true);
  };

  return (
    <ChatContext.Provider value={{ toggleChat, openChat }}>
      {children}
      <ChatDrawer isOpen={isOpen} activeChatId={activeChatId} onClose={() => setIsOpen(false)} />
    </ChatContext.Provider>
  );
}