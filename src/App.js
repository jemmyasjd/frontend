import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignIn, SignUp,RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import './App.css';
import Navbar from './Componets/Navbar';
import HomePage from './Pages/HomePage';
import Footer from './Componets/Footer';
import ShopPage from "./Pages/ShopPage";
import NewsPage from "./Pages/NewsPage";
import ContactPage from "./Pages/ContactPage";
import AboutPage from "./Pages/AboutPage";
import CartPage from "./Pages/CartPage";
import SignInPage from './Componets/SignInPage';
import SignUpPage from './Componets/SignUpPage';


const ProtectedRoute = ({ element }) => (
  <>
    <SignedIn>{element}</SignedIn>
    <SignedOut><SignUpPage /></SignedOut>
  </>
);

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
          <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
          <Route path="/shop" element={<ProtectedRoute element={<ShopPage />} />} />
          <Route path="/news" element={<ProtectedRoute element={<NewsPage />} />} />
          <Route path="/contact" element={<ProtectedRoute element={<ContactPage />} />} />
          <Route path="/about" element={<ProtectedRoute element={<AboutPage />} />} />
          <Route path="/cart" element={<ProtectedRoute element={<CartPage />} />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
