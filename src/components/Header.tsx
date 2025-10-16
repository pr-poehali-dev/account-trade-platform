import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

const Header = () => {
  const [activeTab, setActiveTab] = useState('home');

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

          <Button className="gradient-purple border-0">
            Войти
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
