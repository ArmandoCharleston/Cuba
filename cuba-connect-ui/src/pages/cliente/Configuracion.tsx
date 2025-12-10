import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, Lock, CreditCard, Trash2 } from "lucide-react";

const Configuracion = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">Personaliza tu experiencia</p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notificaciones
          </CardTitle>
          <CardDescription>
            Gestiona cómo y cuándo recibes notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notif">Notificaciones por Email</Label>
              <p className="text-sm text-muted-foreground">
                Recibe confirmaciones y recordatorios por email
              </p>
            </div>
            <Switch id="email-notif" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="promo-notif">Ofertas y Promociones</Label>
              <p className="text-sm text-muted-foreground">
                Recibe ofertas especiales de negocios
              </p>
            </div>
            <Switch id="promo-notif" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminder-notif">Recordatorios de Reserva</Label>
              <p className="text-sm text-muted-foreground">
                Recibe recordatorios 24h antes de tu reserva
              </p>
            </div>
            <Switch id="reminder-notif" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="mr-2 h-5 w-5" />
            Privacidad y Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="profile-visible">Perfil Público</Label>
              <p className="text-sm text-muted-foreground">
                Permite que otros usuarios vean tu perfil
              </p>
            </div>
            <Switch id="profile-visible" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-reviews">Mostrar mis Reseñas</Label>
              <p className="text-sm text-muted-foreground">
                Haz públicas las reseñas que escribes
              </p>
            </div>
            <Switch id="show-reviews" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Payment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Métodos de Pago
          </CardTitle>
          <CardDescription>Gestiona tus métodos de pago</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">
              No tienes métodos de pago guardados
            </p>
          </div>
          <Button variant="outline">Agregar Método de Pago</Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <Trash2 className="mr-2 h-5 w-5" />
            Zona de Peligro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 font-semibold">Eliminar Cuenta</h4>
            <p className="mb-4 text-sm text-muted-foreground">
              Una vez eliminada tu cuenta, no podrás recuperarla. Esta acción es permanente.
            </p>
            <Button variant="destructive">Eliminar mi Cuenta</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuracion;
