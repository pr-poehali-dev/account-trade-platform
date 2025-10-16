import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface GameCardProps {
  title: string;
  level: string;
  price: number;
  image: string;
  seller?: string;
  isFeatured?: boolean;
}

const GameCard = ({ title, level, price, image, seller, isFeatured }: GameCardProps) => {
  return (
    <Card className="group overflow-hidden bg-card border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/20">
      <div className="relative aspect-video overflow-hidden gradient-card">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {isFeatured && (
          <Badge className="absolute top-3 right-3 gradient-purple border-0">
            Топ продаж
          </Badge>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">Уровень: {level}</p>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-2xl font-bold gradient-purple bg-clip-text text-transparent">
              ${price}
            </div>
            {seller && (
              <p className="text-xs text-muted-foreground">
                Продавец: <span className={seller === 'SYSTEM' ? 'text-red-500 font-bold' : ''}>{seller}</span>
              </p>
            )}
          </div>
          <Button className="gradient-purple border-0 hover:opacity-90">
            Купить
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GameCard;
