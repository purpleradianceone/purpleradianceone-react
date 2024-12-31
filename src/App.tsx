/**
 * @import {BrowserRouter, Routes, Route,Link} for routing components from react-router-dom
 * @import AuthLayout for AuthLayout component from components/views/auth/AuthLayout
 * @import SignInForm for SignInForm component from components/forms/SignInForm
 */
import { RouterProvider} from 'react-router-dom';
import { router } from './config/routes/Route';

/**
 * 
 * @returns JSX.Element of all html elements to be rendered as child element of root element in index.html
 */
function App() {
  return (
  <RouterProvider router={router} />
  );
}

/**
 * @exports App App as default export
 */
export default App;