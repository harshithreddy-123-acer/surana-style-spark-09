
import { ColorScheme } from "@/types/design";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ColorSchemeSelectorProps {
  colorSchemes: ColorScheme[];
  selectedColorScheme: string;
  onChange: (value: string) => void;
}

export function ColorSchemeSelector({ 
  colorSchemes, 
  selectedColorScheme, 
  onChange 
}: ColorSchemeSelectorProps) {
  return (
    <RadioGroup 
      value={selectedColorScheme} 
      onValueChange={onChange} 
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
    >
      {colorSchemes.map((scheme) => (
        <div key={scheme.id}>
          <RadioGroupItem 
            value={scheme.id} 
            id={`color-${scheme.id}`} 
            className="peer sr-only" 
          />
          <Label 
            htmlFor={`color-${scheme.id}`}
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <div className="flex gap-1 mb-2">
              {scheme.colors.map((color, index) => (
                <div 
                  key={index} 
                  className="h-6 w-6 rounded-full" 
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
            <div className="text-center font-medium">{scheme.name}</div>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
