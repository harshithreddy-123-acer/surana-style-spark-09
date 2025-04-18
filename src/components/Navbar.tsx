
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Home, Palette, MessageSquare, Image, Calculator, BookImage, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="bg-background border-b border-border py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-serif font-bold text-primary">Surana</span>
              <span className="ml-1 text-2xl font-serif text-accent font-bold">AI</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-accent transition-colors flex items-center gap-1">
              <Home size={18} /> Home
            </Link>
            <Link to="/style-quiz" className="text-foreground hover:text-accent transition-colors flex items-center gap-1">
              <Palette size={18} /> Style Quiz
            </Link>
            <Link to="/chatbot" className="text-foreground hover:text-accent transition-colors flex items-center gap-1">
              <MessageSquare size={18} /> Design Chat
            </Link>
            <Link to="/design-generator" className="text-foreground hover:text-accent transition-colors flex items-center gap-1">
              <Image size={18} /> Designer
            </Link>
            <Link to="/moodboard" className="text-foreground hover:text-accent transition-colors flex items-center gap-1">
              <BookImage size={18} /> Moodboard
            </Link>
            <Link to="/budget-planner" className="text-foreground hover:text-accent transition-colors flex items-center gap-1">
              <Calculator size={18} /> Budget
            </Link>
            <Link to="/gallery" className="text-foreground hover:text-accent transition-colors flex items-center gap-1">
              <User size={18} /> My Gallery
            </Link>
          </div>
          
          <div className="hidden md:flex items-center">
            <Button variant="default">
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </div>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-3 pt-2">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <Home size={18} /> Home
              </div>
            </Link>
            <Link
              to="/style-quiz"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <Palette size={18} /> Style Quiz
              </div>
            </Link>
            <Link
              to="/chatbot"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={18} /> Design Chat
              </div>
            </Link>
            <Link
              to="/design-generator"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <Image size={18} /> Designer
              </div>
            </Link>
            <Link
              to="/moodboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <BookImage size={18} /> Moodboard
              </div>
            </Link>
            <Link
              to="/budget-planner"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <Calculator size={18} /> Budget
              </div>
            </Link>
            <Link
              to="/gallery"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <User size={18} /> My Gallery
              </div>
            </Link>
            <div className="mt-4 pt-4 border-t border-border">
              <Button className="w-full">
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
