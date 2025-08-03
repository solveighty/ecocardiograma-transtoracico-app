import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import cardiologistPP from "@/assets/cardiologist_pp.jpg";
import { User } from "lucide-react";

function DoctorInfoCard({ doctorName }: { doctorName: string }) {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5 text-blue-600" />
          <span>Información del Médico</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={cardiologistPP} alt="Doctor" />
            <AvatarFallback className="text-lg">?</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{doctorName}</h3>
            <p className="text-sm text-gray-600">Especialista en Cardiología</p>
            <p className="text-sm text-gray-500">Lic. Med. 12345</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DoctorInfoCard;
