import React from 'react';
import { ChatPage } from 'pages/chat';
import { AuthProvider } from 'shared/lib/AuthContext';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ChatPage />
    </AuthProvider>
  );
};
