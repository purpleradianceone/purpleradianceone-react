
const StockRulesCard = ({ availableStock } : {
    availableStock : number | boolean 
}) => {
  // Define the rules content for easy mapping/rendering
  const rules = [
    {
      icon: '✅',
      title: 'Full Stock Available',
      description: 'if the selected quantity is available and will be assigned automatically, if user does not select it OR  if user selectes then that particular stock will be assigned ',
      color: 'text-green-600 bg-green-50',
    },
    {
      icon: '🚫',
      title: 'Partial Stock / No Stock ',
      description: 'If there is no available stock as per the given quantity then the operation will fail. First create the stock for the product and then assign it the account/client.',
      color: 'text-red-600 bg-red-50',
    },
  ];

  return (
    <div className=" max-w-full
      bg-white   space-y-4">
      
      {/* Header */}

      {/* Rules List */}
      <div className="space-y-2">
      <p className="table-header-custom">📌 How Stock Selection  Work:</p>
        {rules.map((rule, index) => (
          <div key={index} className="">
            
            <ul className="input-label-custom list-disc pl-6 space-y-1">
              <li  className="table-header-custom">{rule.title}</li>
              <li className="caption-custom">{rule.description}</li>
            </ul>
          </div>
        ))}
      </div>

      {/* Available Stock Display (Conditional) */}
      {availableStock  && (
        <div className="">
          <p className="caption-custom  text-blue-700 font-bold  p-1  flex items-center">
             Current Available Stock: {availableStock}
          </p>
        </div>
      )}
    </div>
  );
};

export default StockRulesCard;