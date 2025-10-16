import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import GameCard from '@/components/GameCard';
import CreateListingDialog from '@/components/CreateListingDialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchAccounts = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/f6b9f400-dd1f-49ff-952b-fce55fc84772');
      const data = await response.json();
      
      if (response.ok && data.accounts) {
        setAccounts(data.accounts);
      }
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить список аккаунтов',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreateListing = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите в аккаунт, чтобы выставить товар',
        variant: 'destructive',
      });
      return;
    }
    setCreateDialogOpen(true);
  };

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
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8"
                  onClick={handleCreateListing}
                >
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
              <h2 className="text-3xl font-bold mb-2">Доступные аккаунты</h2>
              <p className="text-muted-foreground">Лучшие предложения от проверенных продавцов</p>
            </div>
            <Button 
              className="gradient-purple border-0"
              onClick={handleCreateListing}
            >
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить объявление
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Icon name="Loader2" size={48} className="animate-spin text-primary" />
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Пока нет доступных аккаунтов</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {accounts.map((account, index) => (
                <div key={account.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <GameCard {...account} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-card border-t border-border py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 GameMarket. Все права защищены.</p>
        </div>
      </footer>

      <CreateListingDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        onSuccess={fetchAccounts}
      />
    </div>
  );
};

export default Index;
