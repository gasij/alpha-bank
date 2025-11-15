import React, { useState } from 'react';
import { MainLayout } from 'widgets/layout';
import { HeaderWidget } from 'widgets/header';
import { ChatWidget } from 'widgets/chat';
import { CategorySelector } from 'features/category-selector';
import { HistoryModal } from 'features/history';
import { AuthModal } from 'features/auth/ui/AuthModal';
import { RegisterModal } from 'features/auth/ui/RegisterModal';
import { ProfileModal } from 'features/auth/ui/ProfileModal';
import { useAuth } from 'shared/lib/AuthContext';
import { Message } from '@/entities/message/model/types';

export const ChatPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loadedMessages, setLoadedMessages] = useState<Message[] | undefined>(undefined);
  const [loadedChatId, setLoadedChatId] = useState<string | undefined>(undefined);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleLoadHistory = (messages: Message[], chatId?: string) => {
    setLoadedMessages(messages);
    setLoadedChatId(chatId);
  };

  return (
    <MainLayout>
      <HeaderWidget
        onLoginClick={() => setShowAuthModal(true)}
        onProfileClick={() => setShowProfileModal(true)}
      />
      <div className="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <CategorySelector
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              onHistoryClick={() => setShowHistoryModal(true)}
            />
          </aside>

          <main className="flex-1 min-w-0">
            <ChatWidget 
              selectedCategory={selectedCategory} 
              onCategoryChange={handleCategoryChange}
              initialMessages={loadedMessages}
              initialChatId={loadedChatId}
            />
          </main>
        </div>
      </div>

      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onLoadHistory={handleLoadHistory}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSwitchToRegister={() => {
          setShowAuthModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowAuthModal(true);
        }}
      />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </MainLayout>
  );
};
