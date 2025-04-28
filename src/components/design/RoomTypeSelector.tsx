
import { Room } from "@/types/design";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RoomTypeSelectorProps {
  rooms: Room[];
  selectedRoom: string;
  onChange: (value: string) => void;
}

export function RoomTypeSelector({ rooms, selectedRoom, onChange }: RoomTypeSelectorProps) {
  return (
    <RadioGroup 
      value={selectedRoom} 
      onValueChange={onChange} 
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
    >
      {rooms.map((room) => (
        <div key={room.id}>
          <RadioGroupItem 
            value={room.id} 
            id={`room-${room.id}`} 
            className="peer sr-only" 
          />
          <Label 
            htmlFor={`room-${room.id}`}
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <div className="h-16 w-16 rounded-md bg-muted/20 flex items-center justify-center mb-2">
              {room.icon}
            </div>
            <div className="text-center font-medium">{room.name}</div>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
