import React from 'react';
import { 
  Menu, Eye, Columns, FileText, Moon, Sun, Wand2, 
  Bot, ALargeSmall, type LucideIcon 
} from 'lucide-react';
import { ViewMode, AIActionType } from '../types';

interface EditorToolbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleSidebar: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  onAIAction: (action: AIActionType) => void;
  isAILoading: boolean;
  hasSelection: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  viewMode,
  setViewMode,
  toggleSidebar,
  isDark,
  toggleTheme,
  onAIAction,
  isAILoading,
  hasSelection
}) => {

  const ViewIcon = () => {
    switch (viewMode) {
      case ViewMode.EDITOR: return <FileText size={18} />;
      case ViewMode.SPLIT: return <Columns size={18} />;
      case ViewMode.PREVIEW: return <Eye size={18} />;
    }
  };

  return (
    <div className="h-12 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-4 select-none sticky top-0 z-10 transition-colors duration-200">
      <div className="flex items-center gap-2">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-600 dark:text-gray-300 transition-colors"
          title="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        {/* AI Tools Dropdown/Group */}
        <div className="flex items-center mr-2 md:mr-4 border-r border-gray-200 dark:border-gray-700 pr-2 md:pr-4 gap-1">
          <button
            onClick={() => onAIAction(AIActionType.CONTINUE)}
            disabled={isAILoading}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              isAILoading 
                ? 'bg-blue-100 text-blue-400 cursor-wait' 
                : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 shadow-sm'
            }`}
          >
            <Wand2 size={16} className={isAILoading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">AI Write</span>
          </button>

          {hasSelection && (
             <div className="hidden md:flex gap-1">
                <AIButton 
                  icon={ALargeSmall} 
                  label="Fix Grammar" 
                  onClick={() => onAIAction(AIActionType.FIX_GRAMMAR)} 
                  loading={isAILoading}
                />
                <AIButton 
                  icon={Bot} 
                  label="Summarize" 
                  onClick={() => onAIAction(AIActionType.SUMMARIZE)} 
                  loading={isAILoading}
                />
             </div>
          )}
        </div>

        {/* View Toggles */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
          <ViewToggle 
            active={viewMode === ViewMode.EDITOR} 
            onClick={() => setViewMode(ViewMode.EDITOR)} 
            icon={FileText} 
            title="Editor Only"
          />
          <ViewToggle 
            active={viewMode === ViewMode.SPLIT} 
            onClick={() => setViewMode(ViewMode.SPLIT)} 
            icon={Columns} 
            title="Split View"
          />
          <ViewToggle 
            active={viewMode === ViewMode.PREVIEW} 
            onClick={() => setViewMode(ViewMode.PREVIEW)} 
            icon={Eye} 
            title="Preview Only"
          />
        </div>

        <button
          onClick={toggleTheme}
          className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-600 dark:text-gray-300 transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  );
};

const ViewToggle = ({ active, onClick, icon: Icon, title }: { active: boolean, onClick: () => void, icon: LucideIcon, title: string }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-1.5 rounded-md transition-colors ${
      active 
        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
    }`}
  >
    <Icon size={16} />
  </button>
);

const AIButton = ({ icon: Icon, label, onClick, loading }: { icon: LucideIcon, label: string, onClick: () => void, loading: boolean }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-violet-600 dark:text-violet-400 transition-colors flex items-center gap-1 disabled:opacity-50"
    title={label}
  >
    <Icon size={16} />
  </button>
);

export default EditorToolbar;