/* eslint-disable @typescript-eslint/no-explicit-any */
interface CraftNode {
  type: { resolvedName: string };
  props: Record<string, any>;
  nodes?: string[];
  linkedNodes?: Record<string, string>;
  isCanvas?: boolean;
  parent?: string;
  hidden?: boolean;
}

interface CraftData {
  [key: string]: CraftNode;
}

export function htmlToCraftJson(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const rootElement = doc.body.firstElementChild;

  const craftData: CraftData = {
    ROOT: {
      type: { resolvedName: 'Document' },
      isCanvas: true,
      props: {},
      nodes: [],
      linkedNodes: {},
    },
  };

  let nodeCounter = 1;

  function createNodeId(): string {
    return `node-${nodeCounter++}`;
  }

  function processElement(element: Element, parentId = 'ROOT'): string {
    const nodeId = createNodeId();
    const componentType = determineComponentType(element);
    const props = extractPropsFromElement(element, componentType);

    const node: CraftNode = {
      type: { resolvedName: componentType },
      props,
      parent: parentId,
      nodes: [],
      linkedNodes: {},
    };

    if (isCanvasComponent(componentType)) {
      node.isCanvas = true;
    }

    craftData[nodeId] = node;

    if (!craftData[parentId].nodes) {
      craftData[parentId].nodes = [];
    }
    craftData[parentId].nodes!.push(nodeId);

    for (const child of element.children) {
      processElement(child, nodeId);
    }

    return nodeId;
  }

  if (rootElement) {
    processElement(rootElement);
  }

  return JSON.stringify(craftData);
}

function determineComponentType(element: Element): string {
  const tag = element.tagName.toLowerCase();
  const classes = Array.from(element.classList);

  const tagMap: Record<string, string> = {
    div: 'div',
    section: 'SectionBlock',
    img: 'ImageBlock',
    hr: 'DividerBlock',
    a: 'ButtonBlock',
    table: 'TableBlock',
    tr: 'div',
    td: 'div',
    th: 'div',
    p: 'LexicalText',
    h1: 'LexicalText',
    h2: 'LexicalText',
    h3: 'LexicalText',
    h4: 'LexicalText',
    h5: 'LexicalText',
    h6: 'LexicalText',
    ul: 'LexicalText',
    ol: 'LexicalText',
    li: 'LexicalText',
    blockquote: 'LexicalText',
    span: classes.includes('dynamic-field') ? 'DynamicFieldBlock' : 'LexicalText',
  };

  return tagMap[tag] || 'GenericBlock'; // 👈 fallback to GenericBlock
}

function extractPropsFromElement(
  element: Element,
  componentType: string
): Record<string, any> {
  const props: Record<string, any> = {};
  const styleAttr = element.getAttribute('style');

  if (element.id) props.id = element.id;
  if (element.className) props.className = element.className;

  if (styleAttr) {
    props.style = styleAttr.split(';').reduce((acc, rule) => {
      const [key, value] = rule.split(':').map((s) => s.trim());
      if (key && value) {
        const reactKey = key.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
        acc[reactKey] = value;
      }
      return acc;
    }, {} as Record<string, string>);
  }

  if (componentType === 'ImageBlock') {
    props.src = element.getAttribute('src') ?? '';
    props.alt = element.getAttribute('alt') ?? '';
    props.width = extractSizeValue(props.style?.width);
    props.height = extractSizeValue(props.style?.height);
    props.alignment = determineAlignment(props.style);
  }

  if (componentType === 'ButtonBlock') {
    props.href = element.getAttribute('href') ?? '#';
    props.target = element.getAttribute('target') ?? undefined;
    props.rel = element.getAttribute('rel') ?? undefined;
    props.text = element.textContent ?? '';
    props.bgColor = props.style?.backgroundColor ?? '';
    props.textColor = props.style?.color ?? '';
    props.fontSize = props.style?.fontSize ?? '';
    props.fontWeight = props.style?.fontWeight ?? '';
    props.fontFamily = props.style?.fontFamily ?? '';
  }

  if (componentType === 'LexicalText') {
    props.text = element.innerHTML;
    props.editorState = createLexicalEditorState(element);
  }

  if (componentType === 'DynamicFieldBlock') {
    const match = element.textContent?.match(/\{\{\s*(.*?)\s*\}\}/);
    props.name = match ? match[1] : 'unknown_field';
  }

  if (componentType === 'GenericBlock') {
    props.rawTag = element.tagName.toLowerCase();
    props.rawHTML = element.outerHTML;
    props.warning = 'Unrecognized HTML tag';
  }

  return props;
}

function extractSizeValue(value?: string): string | number | undefined {
  if (!value) return undefined;
  return value.endsWith('px') ? parseInt(value) : value;
}

function determineAlignment(style?: Record<string, string>): string {
  if (!style) return 'left';
  if (style.margin === '0 auto') return 'center';
  if (style.marginLeft === 'auto') return 'right';
  return 'left';
}

function createLexicalEditorState(element: Element): any {
const text = (element as HTMLElement).innerText || '';
  return {
    root: {
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text,
              format: 0,
              detail: 0,
              mode: 'normal',
              style: '',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  };
}

function isCanvasComponent(componentType: string): boolean {
  return ['SectionBlock', 'ColumnBlock', 'TableBlock'].includes(componentType);
}
