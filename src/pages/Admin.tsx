import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const Admin = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [moneyAmount, setMoneyAmount] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
      return;
    }
    
    const userData = JSON.parse(user);
    if (!userData.is_admin) {
      toast({
        title: 'Доступ запрещен',
        description: 'У вас нет прав администратора',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const [usersRes, listingsRes] = await Promise.all([
        fetch('https://functions.poehali.dev/96f1937f-f399-4c84-82f7-43d6af8dbdd5?action=users', {
          headers: { 'X-Auth-Token': token }
        }),
        fetch('https://functions.poehali.dev/96f1937f-f399-4c84-82f7-43d6af8dbdd5?action=listings', {
          headers: { 'X-Auth-Token': token }
        })
      ]);

      const usersData = await usersRes.json();
      const listingsData = await listingsRes.json();

      if (usersData.users) setUsers(usersData.users);
      if (listingsData.listings) setListings(listingsData.listings);
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить данные',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGiveMoney = async () => {
    if (!selectedUser || !moneyAmount) {
      toast({
        title: 'Ошибка',
        description: 'Выберите пользователя и введите сумму',
        variant: 'destructive',
      });
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://functions.poehali.dev/96f1937f-f399-4c84-82f7-43d6af8dbdd5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || '',
        },
        body: JSON.stringify({
          action: 'give_money',
          user_id: selectedUser,
          amount: parseFloat(moneyAmount)
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast({
          title: 'Успешно!',
          description: data.message,
        });
        setMoneyAmount('');
        setSelectedUser(null);
        fetchData();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось выполнить действие',
        variant: 'destructive',
      });
    }
  };

  const handleBanUser = async (userId: number, ban: boolean) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://functions.poehali.dev/96f1937f-f399-4c84-82f7-43d6af8dbdd5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || '',
        },
        body: JSON.stringify({
          action: ban ? 'ban_user' : 'unban_user',
          user_id: userId
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast({
          title: 'Успешно!',
          description: data.message,
        });
        fetchData();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось выполнить действие',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteListing = async (listingId: number) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://functions.poehali.dev/96f1937f-f399-4c84-82f7-43d6af8dbdd5?listing_id=${listingId}`, {
        method: 'DELETE',
        headers: {
          'X-Auth-Token': token || '',
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast({
          title: 'Успешно!',
          description: data.message,
        });
        fetchData();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить объявление',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 flex justify-center items-center">
          <Icon name="Loader2" size={48} className="animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16 container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-red-500">Панель администратора</h1>
          <p className="text-muted-foreground">Управление платформой GameMarket</p>
        </div>

        <Tabs defaultValue="money" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="money">
              <Icon name="DollarSign" size={18} className="mr-2" />
              Выдача денег
            </TabsTrigger>
            <TabsTrigger value="listings">
              <Icon name="Trash2" size={18} className="mr-2" />
              Управление объявлениями
            </TabsTrigger>
            <TabsTrigger value="users">
              <Icon name="Shield" size={18} className="mr-2" />
              Управление пользователями
            </TabsTrigger>
          </TabsList>

          <TabsContent value="money">
            <Card>
              <CardHeader>
                <CardTitle>Выдача денег пользователям</CardTitle>
                <CardDescription>
                  У SYSTEM бесконечный баланс: $99,999,999.99
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedUser === user.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedUser(user.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-bold ${user.username === 'SYSTEM' ? 'text-red-500' : ''}`}>
                            {user.username}
                            {user.is_admin && <Badge className="ml-2 bg-red-500">Админ</Badge>}
                            {user.is_banned && <Badge className="ml-2" variant="destructive">Забанен</Badge>}
                          </p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold gradient-purple bg-clip-text text-transparent">
                            ${user.balance.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedUser && (
                  <div className="flex gap-4 pt-4 border-t">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Сумма для выдачи"
                      value={moneyAmount}
                      onChange={(e) => setMoneyAmount(e.target.value)}
                    />
                    <Button onClick={handleGiveMoney} className="gradient-purple border-0">
                      <Icon name="Plus" size={18} className="mr-2" />
                      Выдать
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <CardTitle>Управление объявлениями</CardTitle>
                <CardDescription>
                  Удаление неподходящих объявлений
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {listings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Объявлений нет</p>
                  ) : (
                    listings.map((listing) => (
                      <div
                        key={listing.id}
                        className="p-4 rounded-lg border border-border flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold">{listing.game_title}</p>
                          <p className="text-sm text-muted-foreground">
                            {listing.account_level} • ${listing.price}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Продавец: <span className={listing.seller === 'SYSTEM' ? 'text-red-500' : ''}>{listing.seller}</span>
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteListing(listing.id)}
                        >
                          <Icon name="Trash2" size={16} className="mr-2" />
                          Удалить
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Управление пользователями</CardTitle>
                <CardDescription>
                  Блокировка и разблокировка пользователей
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 rounded-lg border border-border flex items-center justify-between"
                    >
                      <div>
                        <p className={`font-bold ${user.username === 'SYSTEM' ? 'text-red-500' : ''}`}>
                          {user.username}
                          {user.is_admin && <Badge className="ml-2 bg-red-500">Админ</Badge>}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-sm text-muted-foreground">Баланс: ${user.balance.toFixed(2)}</p>
                      </div>
                      <div>
                        {user.is_admin ? (
                          <Badge variant="outline">Нельзя забанить</Badge>
                        ) : user.is_banned ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBanUser(user.id, false)}
                          >
                            <Icon name="Check" size={16} className="mr-2" />
                            Разбанить
                          </Button>
                        ) : (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleBanUser(user.id, true)}
                          >
                            <Icon name="Ban" size={16} className="mr-2" />
                            Забанить
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
