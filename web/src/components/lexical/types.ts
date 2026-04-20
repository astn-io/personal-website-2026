export const TEXT_FORMAT = {
  bold: 1 << 0,
  italic: 1 << 1,
  strikethrough: 1 << 2,
  underline: 1 << 3,
  code: 1 << 4,
  subscript: 1 << 5,
  superscript: 1 << 6,
} as const;

export type LexicalBaseNode = {
  type: string;
  version?: number;
  format?: number | string;
  indent?: number;
  direction?: 'ltr' | 'rtl' | null;
};

export type LexicalTextNode = LexicalBaseNode & {
  type: 'text';
  text: string;
  format: number;
  mode?: string;
  style?: string;
};

export type LexicalLinebreakNode = LexicalBaseNode & {
  type: 'linebreak';
};

export type LexicalParagraphNode = LexicalBaseNode & {
  type: 'paragraph';
  children: LexicalNode[];
};

export type LexicalHeadingNode = LexicalBaseNode & {
  type: 'heading';
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: LexicalNode[];
};

export type LexicalQuoteNode = LexicalBaseNode & {
  type: 'quote';
  children: LexicalNode[];
};

export type LexicalListNode = LexicalBaseNode & {
  type: 'list';
  listType: 'bullet' | 'number' | 'check';
  start?: number;
  tag?: 'ul' | 'ol';
  children: LexicalNode[];
};

export type LexicalListItemNode = LexicalBaseNode & {
  type: 'listitem';
  value?: number;
  checked?: boolean;
  children: LexicalNode[];
};

export type LexicalLinkFields = {
  url?: string;
  newTab?: boolean;
  linkType?: 'custom' | 'internal';
  doc?: { value: string | { slug?: string }; relationTo: string };
};

export type LexicalLinkNode = LexicalBaseNode & {
  type: 'link' | 'autolink';
  fields?: LexicalLinkFields;
  url?: string;
  children: LexicalNode[];
};

export type LexicalHorizontalRuleNode = LexicalBaseNode & {
  type: 'horizontalrule';
};

export type LexicalUploadNode = LexicalBaseNode & {
  type: 'upload';
  value: {
    id: string;
    url?: string;
    alt?: string;
    width?: number;
    height?: number;
    filename?: string;
  };
  relationTo?: string;
};

export type LexicalBlockFields = {
  blockType: string;
  id?: string;
  [key: string]: unknown;
};

export type LexicalBlockNode = LexicalBaseNode & {
  type: 'block';
  fields: LexicalBlockFields;
};

export type LexicalNode =
  | LexicalTextNode
  | LexicalLinebreakNode
  | LexicalParagraphNode
  | LexicalHeadingNode
  | LexicalQuoteNode
  | LexicalListNode
  | LexicalListItemNode
  | LexicalLinkNode
  | LexicalHorizontalRuleNode
  | LexicalUploadNode
  | LexicalBlockNode
  | (LexicalBaseNode & { children?: LexicalNode[] });

export type LexicalRoot = {
  root: LexicalBaseNode & { children: LexicalNode[] };
};

export function hasChildren(
  node: LexicalNode,
): node is LexicalNode & { children: LexicalNode[] } {
  return 'children' in node && Array.isArray((node as { children?: unknown }).children);
}
