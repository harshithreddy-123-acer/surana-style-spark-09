import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Home, Palette, MessageSquare, Image, Calculator, BookImage, LogIn, LogOut, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "text-accent font-medium" : "text-foreground hover:text-accent";
  };
  
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
            <Link to="/" className={`${isActive('/')} transition-colors flex items-center gap-1`}>
              <Home size={18} /> Home
            </Link>
            <Link to="/style-quiz" className={`${isActive('/style-quiz')} transition-colors flex items-center gap-1`}>
              <Palette size={18} /> Style Quiz
            </Link>
            <Link to="/chatbot" className={`${isActive('/chatbot')} transition-colors flex items-center gap-1`}>
              <MessageSquare size={18} /> Design Chat
            </Link>
            <Link to="/design-generator" className={`${isActive('/design-generator')} transition-colors flex items-center gap-1`}>
              <Image size={18} /> Designer
            </Link>
            <Link to="/moodboard" className={`${isActive('/moodboard')} transition-colors flex items-center gap-1`}>
              <BookImage size={18} /> Moodboard
            </Link>
            <Link to="/budget-planner" className={`${isActive('/budget-planner')} transition-colors flex items-center gap-1`}>
              <Calculator size={18} /> Budget
            </Link>
            <Link to="/gallery" className={`${isActive('/gallery')} transition-colors flex items-center gap-1`}>
              <User size={18} /> My Gallery
            </Link>
          </div>
          
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        {user?.name ? user.name[0].toUpperCase() : user?.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.name && (
                        <p className="font-medium">{user.name}</p>
                      )}
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/gallery">My Designs</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link to="/login">
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/register">
                    <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                  </Link>
                </Button>
              </div>
            )}
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
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/')} transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <Home size={18} /> Home
              </div>
            </Link>
            <Link
              to="/style-quiz"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/style-quiz')} transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <Palette size={18} /> Style Quiz
              </div>
            </Link>
            <Link
              to="/chatbot"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/chatbot')} transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={18} /> Design Chat
              </div>
            </Link>
            <Link
              to="/design-generator"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/design-generator')} transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <Image size={18} /> Designer
              </div>
            </Link>
            <Link
              to="/moodboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/moodboard')} transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <BookImage size={18} /> Moodboard
              </div>
            </Link>
            <Link
              to="/budget-planner"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/budget-planner')} transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <Calculator size={18} /> Budget
              </div>
            </Link>
            <Link
              to="/gallery"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/gallery')} transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <User size={18} /> My Gallery
              </div>
            </Link>
            <div className="mt-4 pt-4 border-t border-border">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 mb-2">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback className="bg-accent text-accent-foreground">
                          {user?.name ? user.name[0].toUpperCase() : user?.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        {user?.name && <p className="font-medium">{user.name}</p>}
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full flex items-center justify-center" 
                    variant="outline" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log Out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button asChild className="w-full">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <LogIn className="mr-2 h-4 w-4" /> Sign In
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
