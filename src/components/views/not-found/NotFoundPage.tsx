import { ArrowLeft, Ghost, HomeIcon } from "lucide-react";
import Button from "../../ui/Button";


function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 animate-bounce">
          <Ghost size={120} className="mx-auto text-blue-600 opacity-80" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4 animate-fade-in">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
          Oops! Page not found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for seems to have vanished into thin air. 
          Don't worry, even ghosts get lost sometimes!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={() => window.history.back()}
            
            >
            <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
            Go Back
          </Button>
          <Button 
            onClick={() => window.location.href = '/home'}>
            <HomeIcon className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            Home Page
          </Button>
        </div>
        
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[10%] top-[20%] h-40 w-40 rounded-full bg-purple-100 blur-3xl opacity-30"></div>
          <div className="absolute right-[15%] bottom-[30%] h-40 w-40 rounded-full bg-blue-100 blur-3xl opacity-30"></div>
        </div>
      </div>
    </div>
    
  );
}

export default NotFoundPage;
