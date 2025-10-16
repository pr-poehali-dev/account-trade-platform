import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Link, useNavigate } from 'react-router-dom';
import AuthDialog from '@/components/AuthDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg gradient-purple flex items-center justify-center">
              <Icon name="Gamepad2" size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold">GameMarket</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => setActiveTab('home')}
              className={`text-sm font-medium transition-colors ${
                activeTab === 'home' ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              Главная
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`text-sm font-medium transition-colors ${
                activeTab === 'catalog' ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              Каталог
            </button>
            <button
              onClick={() => setActiveTab('sell')}
              className={`text-sm font-medium transition-colors ${
                activeTab === 'sell' ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              Продать
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`text-sm font-medium transition-colors ${
                activeTab === 'profile' ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              Профиль
            </button>
          </nav>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gradient-purple border-0">
                  <Icon name="User" size={18} className="mr-2" />
                  <span className={user.username === 'SYSTEM' ? 'text-red-400 font-bold' : ''}>
                    {user.username}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer">
                  <Icon name="User" size={16} className="mr-2" />
                  Мой профиль
                </DropdownMenuItem>
                {user.is_admin && (
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-500"
                    onClick={() => navigate('/admin')}
                  >
                    <Icon name="Shield" size={16} className="mr-2" />
                    Админ панель
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <Icon name="LogOut" size={16} className="mr-2" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => setAuthOpen(true)} className="gradient-purple border-0">
              Войти
            </Button>
          )}
        </div>
      </div>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} onSuccess={setUser} />
    </header>
  );
};

export default Header;