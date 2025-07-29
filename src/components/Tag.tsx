import { Badge } from '@/components/ui/badge';
import { Tag as TagIcon } from 'lucide-react';

interface TagProps {
  text: string;
}

export function Tag({ text }: TagProps) {
  return (
    <Badge variant="secondary" className="font-normal capitalize bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
      <TagIcon className="h-3 w-3 mr-1.5" />
      {text}
    </Badge>
  );
}
