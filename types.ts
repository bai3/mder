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

export interface AIState {
  isLoading: boolean;
  error: string | null;
  suggestion: string | null;
}

export enum AIActionType {
  CONTINUE = 'CONTINUE',
  SUMMARIZE = 'SUMMARIZE',
  FIX_GRAMMAR = 'FIX_GRAMMAR',
  EXPLAIN = 'EXPLAIN',
  TRANSLATE = 'TRANSLATE'
}
