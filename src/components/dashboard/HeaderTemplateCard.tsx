import { Card, CardContent } from "@/components/ui/card";
import headerTemplate from "@/assets/header_template.png";

export default function HeaderTemplateCard() {
  return (
    <Card className="lg:col-span-2">
      <CardContent>
        <div
          className="flex items-center justify-center"
          style={{
            height: "139px", // 3.69 cm ≈ 139px
            width: "705px", // 18.66 cm ≈ 705px
            maxWidth: "100%",
          }}
        >
          <img
            src={headerTemplate}
            alt="Header Template"
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
              margin: "0 auto"
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
