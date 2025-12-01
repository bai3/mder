import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import EditorToolbar from './components/EditorToolbar';
import MarkdownPreview from './components/MarkdownPreview';
import { FileItem, ViewMode } from './types';

// Initial sample data (AI references removed)
const INITIAL_CONTENT = `# Welcome to WebTyper

A minimalist Markdown editor inspired by Typora.

## Features

- **Distraction-free**: Clean interface focused on writing.
- **Split View**: Edit and preview side-by-side.
- **Dark Mode**: Easy on the eyes.

## Try it out

Start typing on the left and see the rendered Markdown on the right.

| Command | Description |
|---------|-------------|
| Ctrl+S  | Save (Auto-saved locally) |
| Ctrl+/  | Toggle Sidebar |

Happy writing!
`;

const App: React.FC = () => {
  // --- State ---
  const [files, setFiles] = useState<FileItem[]>(() => {
    const saved = localStorage.getItem('webtyper_files');
    return saved ? JSON.parse(saved) : [{
      id: 'default',
      name: 'Welcome.md',
      content: INITIAL_CONTENT,
      createdAt: Date.now()
    }];
  });
  
  const [currentFileId, setCurrentFileId] = useState<string>(() => {
    return localStorage.getItem('webtyper_current_id') || 'default';
  });

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  // Refs
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Computed
  const currentFile = files.find(f => f.id === currentFileId) || files[0];
  const [content, setContent] = useState(currentFile?.content || "");

  // --- Effects ---

  // Sync content state when file changes
  useEffect(() => {
    if (currentFile) {
      setContent(currentFile.content);
    }
  }, [currentFileId, files]); // Only update when file ID switches or files array structure changes significantly

  // Auto-save to LocalStorage
  useEffect(() => {
    const updatedFiles = files.map(f => 
      f.id === currentFileId ? { ...f, content } : f
    );
    // Debounce saving could be implemented here, but for simplicity we rely on effect
    // To prevent infinite loops, we only write if content differs from memory
    // However, since we update `files` state via setFiles in handleContentChange, this effect strictly syncs LS.
    localStorage.setItem('webtyper_files', JSON.stringify(files));
    localStorage.setItem('webtyper_current_id', currentFileId);
  }, [files, currentFileId]); // Logic moved to handleContentChange for performance, this just purely syncs LS if needed or remove.
  // actually, let's keep it simple: Update `files` state on content change, and save to LS.

  // Theme handling
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // --- Handlers ---

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setFiles(prev => prev.map(f => 
      f.id === currentFileId ? { ...f, content: newContent } : f
    ));
  };

  const handleCreateFile = () => {
    const newFile: FileItem = {
      id: uuidv4(),
      name: `Untitled ${files.length + 1}.md`,
      content: '',
      createdAt: Date.now()
    };
    setFiles([...files, newFile]);
    setCurrentFileId(newFile.id);
    if (window.innerWidth < 768) setSidebarOpen(false); // Close sidebar on mobile
  };

  const handleDeleteFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (files.length === 1) return; // Don't delete last file
    
    const newFiles = files.filter(f => f.id !== id);
    setFiles(newFiles);
    if (currentFileId === id) {
      setCurrentFileId(newFiles[0].id);
    }
  };

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Sidebar
        files={files}
        currentFileId={currentFileId}
        isOpen={isSidebarOpen}
        onSelectFile={(id) => {
          setCurrentFileId(id);
          if (window.innerWidth < 768) setSidebarOpen(false);
        }}
        onCreateFile={handleCreateFile}
        onDeleteFile={handleDeleteFile}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        onImportFile={(file) => {
          const reader = new FileReader();
          reader.onload = () => {
            const text = typeof reader.result === 'string' ? reader.result : '';
            const newFile: FileItem = {
              id: uuidv4(),
              name: file.name || `Imported-${files.length + 1}.md`,
              content: text,
              createdAt: Date.now(),
            };
            setFiles((prev) => [...prev, newFile]);
            setCurrentFileId(newFile.id);
            if (window.innerWidth < 768) setSidebarOpen(false);
          };
          reader.readAsText(file);
        }}
        onExportCurrent={() => {
          const current = files.find((f) => f.id === currentFileId);
          const blob = new Blob([current?.content || ''], { type: 'text/markdown;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = current?.name || 'document.md';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }}
      />

      <div className={`flex-1 flex flex-col h-full transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <EditorToolbar
          viewMode={viewMode}
          setViewMode={setViewMode}
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />

        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Editor Area */}
          <div 
            className={`
              h-full overflow-hidden relative
              ${viewMode === ViewMode.SPLIT ? 'w-1/2 border-r border-gray-200 dark:border-gray-800' : ''}
              ${viewMode === ViewMode.EDITOR ? 'w-full' : ''}
              ${viewMode === ViewMode.PREVIEW ? 'hidden' : ''}
            `}
          >
            <textarea
              ref={editorRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full h-full p-8 md:p-12 resize-none outline-none border-none bg-transparent font-mono text-base leading-relaxed text-gray-800 dark:text-gray-200 placeholder-gray-400"
              placeholder="Start typing..."
              spellCheck={false}
            />
            {/* Character Count / Info Footer could go here */}
          </div>

          {/* Preview Area */}
          <div 
            className={`
              h-full bg-gray-50 dark:bg-gray-900/50 overflow-auto
              ${viewMode === ViewMode.SPLIT ? 'w-1/2' : ''}
              ${viewMode === ViewMode.PREVIEW ? 'w-full mx-auto max-w-4xl' : ''}
              ${viewMode === ViewMode.EDITOR ? 'hidden' : ''}
            `}
          >
            <MarkdownPreview content={content} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;