
import { Style } from "@/types/design";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface StyleSelectorProps {
  styles: Style[];
  selectedStyle: string;
  onChange: (value: string) => void;
}

export function StyleSelector({ styles, selectedStyle, onChange }: StyleSelectorProps) {
  return (
    <RadioGroup 
      value={selectedStyle} 
      onValueChange={onChange} 
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
    >
      {styles.map((style) => (
        <div key={style.id}>
          <RadioGroupItem 
            value={style.id} 
            id={`style-${style.id}`} 
            className="peer sr-only" 
          />
          <Label 
            htmlFor={`style-${style.id}`}
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <div 
              className="h-16 w-full rounded-md bg-cover bg-center mb-2" 
              style={{ backgroundImage: `url(${style.thumbnail})` }}
            ></div>
            <div className="text-center font-medium">{style.name}</div>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
