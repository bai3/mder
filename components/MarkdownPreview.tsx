import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// NOTE: In a real environment, you would run `npm install react-markdown remark-gfm`
// If these are missing in the runner, the preview might fail. 
// Ideally, we handle this gracefully, but for "World Class React Code", we assume standard libs.

interface MarkdownPreviewProps {
  content: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none w-full h-full p-8 md:p-12 overflow-y-auto outline-none">
       {/* 
         Using ReactMarkdown to render safely. 
         remarkGfm adds support for tables, strikethrough, tasklists etc.
       */}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content || "*Start typing to see the preview...*"}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;