import { Heart, User, Settings, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import cardiologistPP from "@/assets/cardiologist_pp.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  doctorName: string;
  doctorEmail: string;
  onRefreshAll?: () => void;
  isRefreshing?: boolean;
}

export default function Header({ doctorName, doctorEmail, onRefreshAll, isRefreshing = false }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-red-500" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">EchoCardio</h1>
              <p className="text-sm text-gray-500">Sistema de Ecocardiograma Transtorácico</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {onRefreshAll && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefreshAll}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Actualizando...' : 'Actualizar Datos'}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={cardiologistPP} alt="Doctor" />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{doctorName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{doctorEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
