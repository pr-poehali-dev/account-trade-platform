import Header from '@/components/Header';
import GameCard from '@/components/GameCard';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Index = () => {
  const featuredAccounts = [
    {
      id: 1,
      title: 'Valorant',
      level: 'Diamond III',
      price: 450,
      image: 'https://cdn.poehali.dev/projects/6eff0498-56be-4162-a179-5e3f87acde2a/files/89cbaf60-7031-40e3-9f22-29f514579dce.jpg',
      seller: 'ProGamer123',
      isFeatured: true
    },
    {
      id: 2,
      title: 'CS:GO',
      level: 'Global Elite',
      price: 800,
      image: 'https://cdn.poehali.dev/projects/6eff0498-56be-4162-a179-5e3f87acde2a/files/89cbaf60-7031-40e3-9f22-29f514579dce.jpg',
      seller: 'SYSTEM',
      isFeatured: true
    },
    {
      id: 3,
      title: 'League of Legends',
      level: 'Challenger',
      price: 1200,
      image: 'https://cdn.poehali.dev/projects/6eff0498-56be-4162-a179-5e3f87acde2a/files/89cbaf60-7031-40e3-9f22-29f514579dce.jpg',
      seller: 'EliteSeller',
      isFeatured: true
    },
    {
      id: 4,
      title: 'Dota 2',
      level: 'Immortal',
      price: 950,
      image: 'https://cdn.poehali.dev/projects/6eff0498-56be-4162-a179-5e3f87acde2a/files/89cbaf60-7031-40e3-9f22-29f514579dce.jpg',
      seller: 'TopPlayer',
      isFeatured: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4 mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Маркетплейс игровых аккаунтов
              </h1>
              <p className="text-xl text-muted-foreground">
                Покупайте и продавайте аккаунты безопасно. Тысячи предложений от проверенных продавцов.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="gradient-purple border-0 text-lg px-8">
                  Начать покупки
                  <Icon name="ArrowRight" size={20} className="ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Продать аккаунт
                </Button>
              </div>
            </div>
            
            <div className="relative animate-scale-in">
              <div className="absolute inset-0 gradient-purple blur-3xl opacity-30"></div>
              <img 
                src="https://cdn.poehali.dev/projects/6eff0498-56be-4162-a179-5e3f87acde2a/files/89cbaf60-7031-40e3-9f22-29f514579dce.jpg"
                alt="Gaming"
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border hover:border-primary transition-colors">
              <div className="w-16 h-16 rounded-full gradient-purple flex items-center justify-center mb-4">
                <Icon name="Shield" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Безопасность</h3>
              <p className="text-muted-foreground">Защита покупателей и продавцов</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border hover:border-primary transition-colors">
              <div className="w-16 h-16 rounded-full gradient-purple flex items-center justify-center mb-4">
                <Icon name="Zap" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Мгновенно</h3>
              <p className="text-muted-foreground">Быстрые транзакции 24/7</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border hover:border-primary transition-colors">
              <div className="w-16 h-16 rounded-full gradient-purple flex items-center justify-center mb-4">
                <Icon name="Users" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Сообщество</h3>
              <p className="text-muted-foreground">Тысячи активных пользователей</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Популярные предложения</h2>
              <p className="text-muted-foreground">Лучшие аккаунты от проверенных продавцов</p>
            </div>
            <Button variant="outline">
              Смотреть все
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAccounts.map((account) => (
              <div key={account.id} className="animate-fade-in" style={{ animationDelay: `${account.id * 0.1}s` }}>
                <GameCard {...account} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-card border-t border-border py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 GameMarket. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
