import React, { useState } from 'react';
import { Plus, X, Globe } from 'lucide-react';

type LeadAllowedDomainsProps = {
  placeholder?: string;
  title?: string;
  maxDomains?: number;
}

const LeadAllowedDomains: React.FC<LeadAllowedDomainsProps> = ({
  placeholder = "Enter domain (e.g., example.com)",
  title = "Allowed Domains",
  maxDomains = 10
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [domains,setDomains] = useState<string[]>([]);

  const validateDomain = (domain: string): boolean => {
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return domainRegex.test(domain) && domain.length <= 253;
  };

  const addDomain = () => {
    const trimmedDomain = inputValue.trim();
    
    if (!trimmedDomain) {
      setError('Please enter a domain');
      return;
    }

    if (!validateDomain(trimmedDomain)) {
      setError('Please enter a valid domain format');
      return;
    }

    if (domains.includes(trimmedDomain)) {
      setError('Domain already exists in the list');
      return;
    }

    if (domains.length >= maxDomains) {
      setError(`Maximum ${maxDomains} domains allowed`);
      return;
    }

    setDomains([...domains, trimmedDomain]);
    setInputValue('');
    setError('');
  };

  const removeDomain = (domainToRemove: string) => {
    setDomains!(domains.filter(domain => domain !== domainToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDomain();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="w-full mx-auto mt-2 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-300 to-indigo-300 px-2 py-1 border-b border-gray-100">
        <div className="flex items-center gap-1">
          <div className="p-1 bg-blue-100 rounded-lg">
            <Globe className="w-3 h-3 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xs font-semibold text-gray-900">{title}</h1>
            <p className="text-xs text-gray-600">
              Manage domains that are allowed to access your application
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="p-2 border-b border-gray-100">
        <div className="flex gap-1">
          <div className="flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className={`w-full px-2 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            />
            {error && (
              <p className="text-red-600 text-xs mt-2 animate-fadeIn">{error}</p>
            )}
          </div>
          <button
            onClick={addDomain}
            disabled={!inputValue.trim() || domains.length >= maxDomains}
            className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
          <span>{domains.length} of {maxDomains} domains added</span>
          {domains.length > 0 && (
            <span className="text-green-600 font-light">
              ✓ {domains.length} domain{domains.length !== 1 ? 's' : ''} configured
            </span>
          )}
        </div>
      </div>

      {/* Domain List */}
      <div className="p-2">
        {domains.length === 0 ? (
          <div className="text-center py-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Globe className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-gray-500 font-light mb-2">No domains added yet</p>
            <p className="text-gray-400 text-xs">
              Start by adding your first allowed domain above
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-gray-700 mb-1">
              Configured Domains ({domains.length})
            </h4>
            {domains.map((domain, index) => (
              <div
                key={domain}
                className="group flex items-center justify-between p-0.5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all duration-200 animate-slideIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Globe className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="font-mono text-gray-800 font-light">
                    {domain}
                  </span>
                </div>
                <button
                  onClick={() => removeDomain(domain)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all duration-200"
                  title="Remove domain"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadAllowedDomains;