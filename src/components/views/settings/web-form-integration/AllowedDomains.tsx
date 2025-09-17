/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Plus, X, Globe } from 'lucide-react';
import CompanySecret from '../../../../@types/settings/CompanySecret';
import { useLoggedInUserContext } from '../../../../context/user/LoggedInUserContext';
import axios from 'axios';
import POST_API from '../../../../constants/PostApi';
import { STATUS_CODE } from '../../../../constants/AppConstants';
import toast from 'react-hot-toast';
import ApiError from '../../../../@types/error/ApiError';
import RefreshToken from '../../../../config/validations/RefreshToken';
import { useUserAccessModules } from '../../../../config/hooks/useAccessModules';
import MESSAGE from '../../../../constants/Messages';
import Button from '../../../ui/Button';

type LeadAllowedDomainsProps = {
  placeholder?: string;
  title?: string;
  maxDomains?: number;
  companySecretList : CompanySecret[];
  integrationFor : "lead" | "product";
}

const AllowedDomains: React.FC<LeadAllowedDomainsProps> = ({
  placeholder = "Enter domain (e.g., example.com)",
  title = "Allowed Domains",
  maxDomains = 20,
  companySecretList,
  integrationFor,
}) => {
  const [inputValue, setInputValue] = useState('');
  const {loginStatus} = useLoggedInUserContext();
  const [error, setError] = useState('');
  const [domains,setDomains] = useState<string[]>(() => {
    if(integrationFor === "lead"){
      const secret = companySecretList.find((secret) => secret.companyFormID === 1);
const allowedDomains = secret ? secret.allowedDomains : [];
return allowedDomains
    }
     if(integrationFor === "product"){
      const secret = companySecretList.find((secret) => secret.companyFormID === 2);
const allowedDomains = secret ? secret.allowedDomains : [];
return allowedDomains
    }

    return []
  
  });

  const {userHasAccessToUpdateSettingGeneral} = useUserAccessModules();


  const getId = () => {
    if(integrationFor === "lead"){
      const secret = companySecretList.find((secret) => secret.companyFormID === 1);
const id = secret ? secret.id : null;
return id;
    }
     if(integrationFor === "product"){
      const secret = companySecretList.find((secret) => secret.companyFormID === 2);
const id = secret ? secret.id : null;
return id;
    }
  }

  const handleDomainchange = async(newDomains : string[]) => {
    const updateCompanySecretPostData = {
      company_id : loginStatus.companyId,
      id : getId() ,
      allowed_domains : newDomains,
      is_refresh_secret_code : false,
      updatedby_id : loginStatus.id
    }

    await axios.post(POST_API.UPDATE_COMPANY_SECRET,updateCompanySecretPostData,{
      withCredentials : true
    }).then((response) => {
      if(response.status === STATUS_CODE.OK){
        if(response.data.status){
          toast.success(response.data.message);
          setDomains(newDomains);
        }else{
          toast.error(response.data.message);
        }
      }
    }).catch(async(error : ApiError | any) => {
      if(error.status === STATUS_CODE.UNATHORISED){
        const refreshTokenStatus = await RefreshToken({callFunctionWithParamsNotEvent : handleDomainchange});
        if(refreshTokenStatus){
          handleDomainchange(newDomains)
        }
      }
    })
  }

  const validateDomain = (domain: string): boolean => {
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return domainRegex.test(domain) && domain.length <= 253;
  };

  const addDomain = () => {
 if(!userHasAccessToUpdateSettingGeneral){
  toast.error(MESSAGE.ERROR.NOT_ATHORISED);
  return;
 }
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
    handleDomainchange([...domains,trimmedDomain])
    setInputValue('');
    setError('');
  };

  const removeDomain = (domainToRemove: string) => {
    handleDomainchange(domains.filter(domain => domain !== domainToRemove));
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
    <div className="w-full mx-auto bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-300 to-indigo-300 px-1 py-0.5 border-b border-gray-100">
        <div className="flex items-center gap-1">
          <div className="p-1 bg-blue-100 rounded-lg">
            <Globe className="w-2 h-2 text-blue-600" />
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
      <div className="p-1 border-b border-gray-100">
        <div className="flex gap-0.5">
          <div className="flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className={`w-full px-1 py-0.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            />
            {error && (
              <p className="text-red-600 text-xs mt-2 animate-fadeIn">{error}</p>
            )}
          </div>
          <div>
            <Button
            onClick={addDomain}
            disabled={ domains.length >= maxDomains}
            // className="px-1 py-0.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <span className='m=0 p-0 flex justify-between'>
              <Plus className="w-3 h-3 mt-1" />
            <span>Add</span>
            </span>
            
          </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-0.5 text-xs text-gray-500">
          <span>{domains.length} of {maxDomains} domains added</span>
          {domains.length > 0 && (
            <span className="text-green-600 text-xs font-light">
              ✓ {domains.length} domain{domains.length !== 1 ? 's' : ''} configured
            </span>
          )}
        </div>
      </div>

      <div className="p-1">
        {domains.length === 0 ? (
          <div className="text-center py-1">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <Globe className="w-3 h-3 text-gray-400" />
            </div>
            <p className="text-gray-500 font-light mb-2">No domains added yet</p>
            <p className="text-gray-400 text-xs">
              Start by adding your first allowed domain above
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            <h4 className="text-xs font-normal text-gray-700 mb-0.5">
              Configured Domains ({domains.length})
            </h4>
            {domains.map((domain, index) => (
              <div
                key={domain}
                className="group flex items-center justify-between p-0.5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all duration-200 animate-slideIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Globe className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="font-mono text-sm text-gray-800 font-light">
                    {domain}
                  </span>
                </div>
                <button
                  onClick={() => removeDomain(domain)}
                  className="opacity-0 group-hover:opacity-100 p-0.5  text-gray-400 hover:text-red-500 hover:bg-white shadow-lg rounded-full transition-all duration-200"
                  title="Remove domain"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllowedDomains;