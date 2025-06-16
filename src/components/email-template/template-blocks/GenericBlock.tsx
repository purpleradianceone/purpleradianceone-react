// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GenericBlock = ({ rawTag, rawHTML, warning }: any) => {
  return (
    <div style={{ border: '1px dashed red', padding: '10px', background: '#fff5f5' }}>
      ⚠️ <strong>Unknown Element:</strong> {rawTag}
      <pre style={{ fontSize: '0.8em', whiteSpace: 'pre-wrap' }}>{rawHTML}</pre>
      {warning && <em>{warning}</em>}
    </div>
  );
};
