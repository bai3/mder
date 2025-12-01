import React from 'react';
import { FileText, Plus, Trash2, X, Menu } from 'lucide-react';
import { FileItem } from '../types';

interface SidebarProps {
  files: FileItem[];
  currentFileId: string;
  isOpen: boolean;
  onSelectFile: (id: string) => void;
  onCreateFile: () => void;
  onDeleteFile: (id: string, e: React.MouseEvent) => void;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  files,
  currentFileId,
  isOpen,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  toggleSidebar,
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <div
        className={`fixed top-0 left-0 h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 z-30 w-64 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200">Files</h2>
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => onSelectFile(file.id)}
              className={`group flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                file.id === currentFileId
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                  {file.name}
                </span>
              </div>
              <button
                onClick={(e) => onDeleteFile(file.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onCreateFile}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors text-sm font-medium shadow-sm"
          >
            <Plus size={16} />
            New File
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;