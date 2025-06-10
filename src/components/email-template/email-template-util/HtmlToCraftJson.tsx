/* eslint-disable @typescript-eslint/no-explicit-any */
interface CraftNode {
  type: string | { resolvedName: string };
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
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const rootElement = doc.body.firstElementChild;
    
    if (!rootElement) {
      throw new Error("No root element found in HTML");
    }

    const craftData: CraftData = {
      ROOT: {
        type: { resolvedName: "Document" },
        isCanvas: true,
        props: {},
        nodes: [],
        linkedNodes: {}
      }
    };

    let nodeCounter = 1;

    function processElement(element: Element, parentId: string = "ROOT"): string {
      const nodeId = `node-${nodeCounter++}`;
      
      // Determine component type based on element
      const componentType = determineComponentType(element);
      
      // Extract props from element
      const props = extractPropsFromElement(element);
      
      // Create the node
      craftData[nodeId] = {
        type: { resolvedName: componentType },
        props,
        parent: parentId,
        nodes: [],
        linkedNodes: {}
      };

      // Add to parent's nodes
      if (parentId === "ROOT") {
        craftData.ROOT.nodes!.push(nodeId);
      } else {
        craftData[parentId].nodes!.push(nodeId);
      }

      // Process children
      Array.from(element.children).forEach(child => {
        processElement(child, nodeId);
      });

      return nodeId;
    }

    if (rootElement) {
      processElement(rootElement);
    }

    return JSON.stringify(craftData);
  } catch (error) {
    console.error('Error converting HTML to Craft JSON:', error);
    return JSON.stringify({
      ROOT: {
        type: { resolvedName: "Document" },
        isCanvas: true,
        props: {},
        nodes: [],
        linkedNodes: {}
      }
    });
  }
}

function determineComponentType(element: Element): string {
  const tag = element.tagName.toLowerCase();
  const classList = Array.from(element.classList);

  // Map HTML elements to Craft.js components
  const componentMap: Record<string, string> = {
    'div': 'div',
    'section': 'SectionBlock',
    'hr': 'DividerBlock',
    'img': 'ImageBlock',
    'a': 'ButtonBlock',
    'table': 'TableBlock',
    'td': 'div', // Table cells are treated as divs
    'tr': 'div', // Table rows are treated as divs
    'p': 'LexicalText',
    'h1': 'LexicalText',
    'h2': 'LexicalText',
    'h3': 'LexicalText',
    'h4': 'LexicalText',
    'h5': 'LexicalText',
    'h6': 'LexicalText',
    'ul': 'LexicalText',
    'ol': 'LexicalText',
    'li': 'LexicalText',
    'blockquote': 'LexicalText',
    'span': classList.includes('dynamic-field') ? 'DynamicFieldBlock' : 'LexicalText'
  };

  // Check for specific component classes
  if (classList.includes('subject-block')) return 'SubjectBlock';
  if (classList.includes('column-block')) return 'ColumnBlock';

  return componentMap[tag] || 'div';
}

function extractPropsFromElement(element: Element): Record<string, any> {
  const props: Record<string, any> = {};
  const style = element.getAttribute('style');
  
  // Extract common attributes
  if (element.id) props.id = element.id;
  if (element.className) props.className = element.className;
  
  // Parse style attribute
  if (style) {
    props.style = style.split(';').reduce((acc, rule) => {
      const [key, value] = rule.split(':').map(s => s.trim());
      if (key && value) {
        // Convert CSS property to React style name
        const reactKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        acc[reactKey] = value;
      }
      return acc;
    }, {} as Record<string, string>);
  }
  
  // Component-specific prop extraction
  const tag = element.tagName.toLowerCase();
  
  if (tag === 'img') {
    props.src = element.getAttribute('src') || '';
    props.alt = element.getAttribute('alt') || '';
    props.width = extractSizeValue(props.style?.width);
    props.height = extractSizeValue(props.style?.height);
    props.alignment = determineAlignment(props.style);
  }
  
  if (tag === 'a') {
    props.href = element.getAttribute('href') || '#';
    props.target = element.getAttribute('target') || undefined;
    props.rel = element.getAttribute('rel') || undefined;
    props.text = element.textContent || '';
    
    // Extract button styles from inline styles
    if (props.style) {
      props.bgColor = props.style.backgroundColor;
      props.textColor = props.style.color;
      props.fontSize = props.style.fontSize;
      props.fontWeight = props.style.fontWeight;
      props.fontFamily = props.style.fontFamily;
    }
  }
  
  if (tag === 'input' && element.getAttribute('type') === 'text') {
    props.subject = element.getAttribute('value') || '';
  }
  
  // Handle Lexical text content
  if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote'].includes(tag)) {
    props.text = element.innerHTML;
    props.editorState = createLexicalEditorState(element);
  }
  
  // Handle dynamic fields
  if (element.classList.contains('dynamic-field')) {
    const match = element.textContent?.match(/\{\{\s*(.*?)\s*\}\}/);
    props.name = match ? match[1] : 'field_name';
  }
  
  return props;
}

function extractSizeValue(size?: string): string | number | undefined {
  if (!size) return undefined;
  if (size.endsWith('px')) return parseInt(size);
  return size;
}

function determineAlignment(style?: Record<string, string>): string {
  if (!style) return 'left';
  if (style.margin === '0 auto') return 'center';
  if (style.marginLeft === 'auto') return 'right';
  return 'left';
}

function createLexicalEditorState(element: Element): any {
  // This is a simplified version - you'll need to implement proper Lexical state conversion
  return {
    root: {
      children: [{
        type: 'paragraph',
        children: [{
          type: 'text',
          text: element.textContent || '',
          format: 0
        }]
      }]
    }
  };
}