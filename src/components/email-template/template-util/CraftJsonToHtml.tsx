/* eslint-disable @typescript-eslint/no-unused-vars */
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

// Configuration for component rendering
interface ComponentRendererConfig {
  data: CraftData;
  node: CraftNode;
  renderChildren: (nodeIds?: string[]) => string;
  renderLinkedNodes: (linkedNodes?: Record<string, string>) => string;
}

type ComponentRenderer = (config: ComponentRendererConfig) => string;

// Main converter function
export function craftJsonToHtml(json: string): string {
  try {
    const data: CraftData = JSON.parse(json);
    if (!data.ROOT) throw new Error("No ROOT node found in the JSON");
    return renderNode(data, 'ROOT');
  } catch (error) {
    console.error('Error converting Craft JSON to HTML:', error);
    return `<div class="craft-error">Error rendering content: ${error instanceof Error ? error.message : String(error)}</div>`;
  }
}

// Core renderer function
function renderNode(data: CraftData, nodeId: string): string {
  const node = data[nodeId];
  if (!node || node.hidden) return '';

  const renderChildren = (nodeIds?: string[]) => 
    (nodeIds || []).map(id => renderNode(data, id)).join('\n');

  const renderLinkedNodes = (linkedNodes?: Record<string, string>) => 
    linkedNodes ? Object.values(linkedNodes).map(id => renderNode(data, id)).join('') : '';

  const config: ComponentRendererConfig = {
    data,
    node,
    renderChildren,
    renderLinkedNodes
  };

  // Determine component type
  const componentType = typeof node.type === 'object' 
    ? node.type.resolvedName 
    : node.type;

  // Get the appropriate renderer
  const renderer = componentRenderers[componentType] || defaultRenderer;
  return renderer(config);
}

// Default renderer for unknown components
const defaultRenderer: ComponentRenderer = ({ node, renderChildren, renderLinkedNodes }) => {
  const componentName = typeof node.type === 'object' ? node.type.resolvedName : node.type;
  console.warn(`No renderer for component: ${componentName}`);
  
  const style = formatStyle({
    border: '1px dashed #ff0000',
    padding: '8px',
    margin: '4px 0',
    backgroundColor: '#ffeeee',
    ...node.props.style
  });

  return `
    <div style="${style}">
      <div style="color:red;font-weight:bold;">${componentName}</div>
      ${renderChildren(node.nodes)}
      ${renderLinkedNodes(node.linkedNodes)}
    </div>
  `;
};

// Component renderers registry
const componentRenderers: Record<string, ComponentRenderer> = {
  // Basic div container
  'div': ({ node, renderChildren, renderLinkedNodes }) => {
    const style = formatStyle({
      display: node.isCanvas ? 'block' : undefined,
      ...node.props.style
    });

    const attrs = Object.entries(node.props)
      .filter(([key]) => !['style', 'nodes', 'linkedNodes', 'isCanvas'].includes(key))
      .map(([key, val]) => `${key}="${escapeHtml(String(val))}"`)
      .join(' ');

    return `
      <div ${attrs}${style ? ` style="${style}"` : ''}>
        ${renderChildren(node.nodes)}
        ${renderLinkedNodes(node.linkedNodes)}
      </div>
    `;
  },

  'SubjectBlock': ({ node }) => {
  const subject = node?.props?.subject || '';

  const background = node?.props?.background || '#fffbea';
  const padding = node?.props?.padding || '10px';
  const border = node?.props?.border || '1px solid #aaa';
  const borderRadius = node?.props?.borderRadius || '6px';
  const color = node?.props?.color || '#333333';

  const containerStyle = formatStyle({
    backgroundColor: background,
    padding,
    border,
    borderRadius,
    color,
    marginBottom: '10px',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
  });

  const inputStyle = formatStyle({
    width: '100%',
    padding: '6px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: '#0000000',
    color,
    cursor: 'not-allowed',
  });

  const labelStyle = formatStyle({
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color,
  });

  return `
    <div style="${containerStyle}">
      <label style="${labelStyle}">✉️ Subject</label>
      <input
        type="text"
        value="${subject.replace(/"/g, '&quot;')}"
        placeholder="Enter email subject..."
        style="${inputStyle}"
        disabled
        aria-label="Email subject"
      />
    </div>
  `;
},



  // Section Block
  'SectionBlock': ({ node, renderChildren, renderLinkedNodes }) => {
    const style = formatStyle({
      backgroundColor: node.props.background || '#ffffff',
      padding: node.props.padding || '20px',
      textAlign: node.props.align || 'left',
      width: '100%',
      boxSizing: 'border-box',
      margin: '10px 0',
      ...node.props.style
    });

    const content = 
  (node.nodes ? renderChildren(node.nodes) : '') + 
  (node.linkedNodes ? renderLinkedNodes(node.linkedNodes) : '');

    return `<section style="${style}">${content}</section>`;
  },

  // Divider Block (NEWLY ADDED)
  'DividerBlock': ({ node }) => {
    const { width = node.props.width, color = "#ccc", thickness = 1, margin = "10px 0" } = node.props;

    const style = formatStyle({
      width: width ? `${width}px` : '300px',
      borderTop: `${thickness}px solid ${color}`,
      margin: margin,
      ...node.props.style
    });

    return `<hr style="${style}">`;
  },

  'ImageBlock': ({ node }) => {
  const { src, alt = '', width, height, alignment } = node.props;

  // Determine the alignment as an object
  let alignmentStyle: React.CSSProperties = {};

  if (alignment === 'center') {
    alignmentStyle = { margin: '0 auto' };
  } else if (alignment === 'right') {
    alignmentStyle = { marginLeft: 'auto' };
  }

  // Construct the inline styles for the image
  const style: React.CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
    objectFit: 'cover', // Ensures image fills container without stretching
    objectPosition: 'center center', // Default image position (centered)
    ...alignmentStyle, // Apply alignment if available
    ...node.props.style, // Include any additional styles passed
  };

  // Convert the style object into a string for inline styles
  const styleString = Object.entries(style)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');

  // Escape the URL and alt text for safety
  const escapedSrc = escapeHtml(src);
  const escapedAlt = escapeHtml(alt);

  // Return the image element as an HTML string
  return `<img src="${escapedSrc}" alt="${escapedAlt}" style="${styleString}">`;
}
,

  // Button Block
  'ButtonBlock': ({ node }) => {
    const { text, href = '#', target } = node.props;
    const style = formatStyle({
      display: 'inline-block',
      backgroundColor: node.props.bgColor || '#007bff',
      color: node.props.textColor || '#ffffff',
      padding: '8px 16px',
      textAlign: node.props.align || 'center',
      textDecoration: 'none',
      borderRadius: '4px',
      fontSize: node.props.fontSize || '14px',
      fontWeight: node.props.fontWeight || 'normal',
      fontFamily: node.props.fontFamily || 'inherit',
      margin: '4px 0',
      ...node.props.style
    });

    const attrs = [
      target ? `target="${escapeHtml(target)}"` : '',
      node.props.rel ? `rel="${escapeHtml(node.props.rel)}"` : ''
    ].filter(Boolean).join(' ');

    return `<div><a href="${escapeHtml(href)}" style="${style}" ${attrs}>${escapeHtml(text)}</a></div>`;
  },


  // Column Block

  'ColumnBlock': ({ node, data,}) => {
  const {
    gap = '10px',
    direction = 'row',
    style = {}
  } = node.props;

  const containerStyle = formatStyle({
    display: 'flex',
    width: '100%',
    gap,
    flexDirection: direction,
    flexWrap: 'nowrap',
    ...style
  });

  const linkedNodeEntries = Object.entries(node.linkedNodes || {});

  const columns = linkedNodeEntries
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([_, columnId], index, arr) => {
      const colWidth = `calc(${100 / arr.length}% - ${(parseFloat(gap) * (arr.length - 1)) / arr.length}px)`;

      const columnWrapperStyle = formatStyle({
        flex: `0 0 ${colWidth}`,
        minWidth: '0',
        minHeight: '100px',
        backgroundColor: 'transparent',
      });

      return `<div style="${columnWrapperStyle}">${renderNode(data, columnId)}</div>`;
    })
    .join('');

  return `<div style="${containerStyle}">${columns}</div>`;
},

  // Table Block

 'TableBlock': ({ node, data }) => {
  const cellIds = Object.entries(node.linkedNodes || {});
  const rows: Record<string, { col: number; id: string }[]> = {};

  // Group by row
  cellIds.forEach(([key, id]) => {
    const match = key.match(/table-cell-(\d+)-(\d+)/);
    if (match) {
      const row = match[1];
      const col = parseInt(match[2]);
      if (!rows[row]) rows[row] = [];
      rows[row].push({ col, id });
    }
  });

  const tableStyle = formatStyle({
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #ccc",
  });

  let html = `<table style="${tableStyle}"><tbody>`;

  Object.entries(rows)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .forEach(([_, rowCells]) => {
      html += "<tr>";
      rowCells
        .sort((a, b) => a.col - b.col)
        .forEach(({ id }) => {
          const content = renderNode(data, id);
          const cellStyle = formatStyle({
            border: "1px solid #ccc",
            padding: "8px",
            verticalAlign: "top",
          });
          html += `<td style="${cellStyle}">${content}</td>`;
        });
      html += "</tr>";
    });

  html += "</tbody></table>";
  return html;
},


'LexicalText': ({ node }) => {
  try {
    // Parse editorState if it's a string or use the existing object
    const editorState = typeof node.props.editorState === 'string'
      ? JSON.parse(node.props.editorState)
      : node.props.editorState;
    
    // Extract HTML content from Lexical editorState
    const htmlContent = extractHtmlFromLexical(editorState);

    // Generate styles for the container
    const style = formatStyle({
      margin: '8px 0',
      whiteSpace: 'pre-wrap',
      ...node.props.style
    });

    // Return HTML with inline styles
    return `<div style="${style}">${htmlContent}</div>`;
  } catch (e) {
    console.error('Error parsing Lexical content', e);
    
    // Fallback to plain text if error occurs
    return `<div>${escapeHtml(node.props.text || '')}</div>`;
  }
},
  

  'DynamicFieldBlock': ({ node }) => {
  // eslint-disable-next-line no-unsafe-optional-chaining
  const { name, fontSize, color, backgroundColor, borderStyle } = node?.props;

  const style = [
    `font-size: ${fontSize || '14px'}`,
    `color: ${color || '#000000'}`,
    `background-color: ${backgroundColor || '#fafafa'}`,
    `border: ${borderStyle || '1px dashed #888'}`,
    'display: inline-block',
    'padding: 4px 8px',
    'border-radius: 4px',
  ].join(';');

  return `<span style="${style}">{{ ${name || 'first_name'} }}</span>`;
}

};

// Enhanced function to extract HTML from Lexical editor state
function extractHtmlFromLexical(editorState: any): string {
  if (!editorState?.root?.children) return '';

  const processNode = (node: any): string => {
    // Handle text nodes
    if (node.type === 'text') {
      let style = '';
      if (node.style) {
        style = ` style="${node.style}"`;
      }

      // Apply formatting tags
      let content = escapeHtml(node.text);
      if (node.format & 1) content = `<strong>${content}</strong>`; // Bold
      if (node.format & 2) content = `<em>${content}</em>`; // Italic
      if (node.format & 4) content = `<u>${content}</u>`; // Underline
      if (node.format & 8) content = `<code>${content}</code>`; // Code
      if (node.format & 16) content = `<s>${content}</s>`; // Strikethrough

      return style ? `<span${style}>${content}</span>` : content;
    }

    // Handle paragraph nodes
    if (node.type === 'paragraph') {
  const children = node.children.map(processNode).join('');
  let style = node.textStyle || '';

  if (node.format && typeof node.format === 'string') {
    style = appendStyle(style, `text-align: ${node.format};`);
  }

  const styleAttr = style ? ` style="${style}"` : '';
  return `<p${styleAttr}>${children}</p>`;
}

    // Handle heading nodes
    if (node.type === 'heading') {
      const tag = `h${node.tag || '1'}`;
      const children = node.children.map(processNode).join('');
      let style = node.textStyle ? node.textStyle : '';
      
      // Add alignment to style if present
      if (node.format) {
        if (node.format & 1 << 0) style = appendStyle(style, 'text-align: left;');
        if (node.format & 1 << 1) style = appendStyle(style, 'text-align: center;');
        if (node.format & 1 << 2) style = appendStyle(style, 'text-align: right;');
        if (node.format & 1 << 3) style = appendStyle(style, 'text-align: justify;');
      }
      
      const styleAttr = style ? ` style="${style}"` : '';
      return `<${tag}${styleAttr}>${children}</${tag}>`;
    }

    // Handle list nodes
    if (node.type === 'list') {
      const tag = node.listType === 'bullet' ? 'ul' : 'ol';
      const children = node.children.map(processNode).join('');
      return `<${tag}>${children}</${tag}>`;
    }

    if (node.type === 'listitem') {
      const children = node.children.map(processNode).join('');
      return `<li>${children}</li>`;
    }

    // Handle quote nodes
    if (node.type === 'quote') {
      const children = node.children.map(processNode).join('');
      let style = node.textStyle ? node.textStyle : '';
      
      // Add alignment to style if present
      if (node.format) {
        if (node.format & 1 << 0) style = appendStyle(style, 'text-align: left;');
        if (node.format & 1 << 1) style = appendStyle(style, 'text-align: center;');
        if (node.format & 1 << 2) style = appendStyle(style, 'text-align: right;');
        if (node.format & 1 << 3) style = appendStyle(style, 'text-align: justify;');
      }
      
      const styleAttr = style ? ` style="${style}"` : '';
      return `<blockquote${styleAttr}>${children}</blockquote>`;
    }

    // Handle generic element nodes
    if (node.children) {
      return node.children.map(processNode).join('');
    }

    return '';
  };

  // Helper function to append styles properly
  function appendStyle(existing: string, newStyle: string): string {
    if (!existing) return newStyle;
    if (existing.endsWith(';')) return existing + ' ' + newStyle;
    return existing + '; ' + newStyle;
  }

  // Process all children of the root
  return editorState.root.children.map(processNode).join('');
}

// Helper to convert style object to CSS string
function formatStyle(styleObj: Record<string, string | number | undefined>): string {
  return Object.entries(styleObj)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      const cssProperty = key
        .replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
        .replace(/^(webkit|moz|ms|o)-/, '-$1-');
      return `${cssProperty}:${typeof value === 'number' ? `${value}px` : value}`;
    })
    .join(';');
}

// Basic HTML escaping
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    ;
}
