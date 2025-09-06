import { Heart, User, Settings, RefreshCw, Activity, Stethoscope } from "lucide-react";
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
    <header className="bg-white shadow-lg border-b border-gray-100">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Activity className="h-2 w-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                EchoCardio Pro
              </h1>
              <p className="text-sm text-gray-500 font-medium">Sistema de Ecocardiograma Transtorácico</p>
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
              className="flex items-center gap-2 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 shadow-sm transition-all duration-200"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Actualizando...' : 'Actualizar Datos'}
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-50 transition-colors">
                <Avatar className="h-9 w-9 border-2 border-gray-200">
                  <AvatarImage src={cardiologistPP} alt="Doctor" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <Stethoscope className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm font-semibold leading-none text-gray-900">{doctorName}</p>
                  </div>
                  <p className="text-xs leading-none text-gray-500">{doctorEmail}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Stethoscope className="h-3 w-3 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">Cardiólogo</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50">
                <User className="h-4 w-4 text-gray-600" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50">
                <Settings className="h-4 w-4 text-gray-600" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer hover:bg-red-50 text-red-600">
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
