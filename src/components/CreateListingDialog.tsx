import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface CreateListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateListingDialog = ({ open, onOpenChange, onSuccess }: CreateListingDialogProps) => {
  const [gameTitle, setGameTitle] = useState('');
  const [accountLevel, setAccountLevel] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо войти в аккаунт',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/29ce1fad-0315-49f7-bec2-513fff11eecc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token,
        },
        body: JSON.stringify({
          game_title: gameTitle,
          account_level: accountLevel,
          price: parseFloat(price),
          description,
          image_url: imageUrl || 'https://cdn.poehali.dev/projects/6eff0498-56be-4162-a179-5e3f87acde2a/files/89cbaf60-7031-40e3-9f22-29f514579dce.jpg',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно!',
          description: 'Объявление создано и ожидает модерации',
        });

        onSuccess();
        onOpenChange(false);
        setGameTitle('');
        setAccountLevel('');
        setPrice('');
        setDescription('');
        setImageUrl('');
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось создать объявление',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка подключения',
        description: 'Не удалось связаться с сервером',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Выставить аккаунт на продажу
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="gameTitle">Название игры *</Label>
            <Input
              id="gameTitle"
              type="text"
              value={gameTitle}
              onChange={(e) => setGameTitle(e.target.value)}
              required
              placeholder="Например: CS:GO, Valorant"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountLevel">Уровень аккаунта *</Label>
            <Input
              id="accountLevel"
              type="text"
              value={accountLevel}
              onChange={(e) => setAccountLevel(e.target.value)}
              required
              placeholder="Например: Global Elite, Diamond"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Цена (USD) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="100.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите особенности аккаунта, скины, достижения..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Ссылка на изображение</Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg (необязательно)"
            />
            <p className="text-xs text-muted-foreground">
              Если не указано, будет использовано изображение по умолчанию
            </p>
          </div>

          <Button
            type="submit"
            className="w-full gradient-purple border-0"
            disabled={loading}
          >
            {loading ? (
              <>
                <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                Создание...
              </>
            ) : (
              <>
                <Icon name="Plus" className="mr-2 h-4 w-4" />
                Создать объявление
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListingDialog;
