// DynamicFieldPalette.tsx
import * as React from 'react';

interface DynamicFieldPaletteProps {
  fields: Record<string, string>;
}

export const DynamicFieldPalette: React.FC<DynamicFieldPaletteProps> = ({ fields }) => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, fieldKey: string, fieldValue: string) => {
    event.dataTransfer.setData('application/json', JSON.stringify({ fieldKey, fieldValue }));
  };

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h4>Dynamic Fields</h4>
      {Object.entries(fields).map(([key, value]) => (
        <div
          key={key}
          draggable
          onDragStart={(e) => handleDragStart(e, key, value)}
          style={{
            padding: '4px 8px',
            margin: '4px 0',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            cursor: 'grab',
          }}
        >
          {key}
        </div>
      ))}
    </div>
  );
};
