import { ArrowLeft, ShieldAlert } from "lucide-react";


function AccessDeniedPage (){
    return (
        <div>
          <div className="flex justify-center mb-6">
            <div className="bg-red-50 p-3 rounded-full">
              <ShieldAlert className="w-12 h-12 text-red-500" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-8">
            Sorry, but you don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
          </p>
          
          <div className="space-y-4">
            <button 
              onClick={() => window.history.back()} 
              className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-150 ease-in-out"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
            
            <a 
              href="/home" 
              className="inline-block w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150 ease-in-out"
            >
              Return to Homepage
            </a>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Error Code: 403 Forbidden
            </p>
          </div>
        </div>
    );
}

export default AccessDeniedPage;