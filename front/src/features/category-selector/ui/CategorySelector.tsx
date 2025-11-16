import React, { useEffect, useState } from 'react';
import { businessAssistantApi } from 'shared/api/businessAssistantApi';
import { Category } from 'shared/api/types';
import { 
  FiBriefcase, 
  FiShield, 
  FiTrendingUp, 
  FiDollarSign, 
  FiFileText, 
  FiClock
} from 'react-icons/fi';
import { Icon } from 'shared/ui/Icon';

type IconComponent = React.ComponentType<{ className?: string }>;

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onHistoryClick: () => void;
}

// Маппинг категорий на иконки
const categoryIcons: Record<string, IconComponent> = {
  general: FiBriefcase as IconComponent,
  legal: FiShield as IconComponent,
  marketing: FiTrendingUp as IconComponent,
  finance: FiDollarSign as IconComponent,
  documents: FiFileText as IconComponent,
};


export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange,
  onHistoryClick,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const response = await businessAssistantApi.getCategories();
      setCategories(response.categories);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const IconComponent = categoryIcons[categoryId] || FiBriefcase;
    return <IconComponent className="w-5 h-5" />;
  };

  if (isLoading) {
    return (
      <nav className="bg-white rounded-xl p-2 shadow-sm border border-border animate-slide-up">
        <div className="flex items-center justify-center py-8">
          <div className="flex gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white rounded-xl p-2 shadow-sm border border-border animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <ul className="flex flex-col gap-1">
        {categories.map((category, index) => (
          <li key={category.id}>
            <button
              onClick={() => onCategoryChange(category.id)}
              className={`
                w-full text-left px-4 py-3 rounded-lg
                text-sm sm:text-base font-medium transition-all duration-300
                relative group
                animate-scale-in glow-outline
                ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white border-l-4 border-primary shadow-md font-semibold'
                    : 'text-foreground hover:bg-primary/5 hover:text-primary border-l-4 border-transparent hover:border-primary/30'
                }
              `}
              style={{ animationDelay: `${0.4 + index * 0.05}s` }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className={selectedCategory === category.id ? 'text-white' : 'text-primary'}>
                  {getCategoryIcon(category.id)}
                </span>
                <span className="flex-1">{category.name}</span>
                {selectedCategory === category.id && (
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                )}
              </span>
            </button>
          </li>
        ))}
        <li className="mt-2 pt-2 border-t border-border">
          <button
            onClick={onHistoryClick}
            className="w-full text-left px-4 py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 text-foreground hover:bg-primary/5 hover:text-primary border-l-4 border-transparent hover:border-primary/30 animate-scale-in glow-outline"
            style={{ animationDelay: `${0.4 + categories.length * 0.05}s` }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Icon icon={FiClock} className="w-5 h-5 text-primary" />
              <span className="flex-1">История запросов</span>
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
};
