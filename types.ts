export interface FileItem {
  id: string;
  name: string;
  content: string;
  createdAt: number;
}

export enum ViewMode {
  EDITOR = 'EDITOR',
  PREVIEW = 'PREVIEW',
  SPLIT = 'SPLIT'
}

// AI-related types removed for now
