public class Paseo extends Servicio {
    private int duracionMinutos;

    public Paseo(String id, String nombre, double precioBase, int duracion) {
        super(id, nombre, precioBase); // Le pasa los datos al padre
        this.duracionMinutos = duracion;
    }

    @Override
    public double calcularCostoFinal() {
        // Lógica de negocio: si dura más de una hora, cobramos un recargo
        if (duracionMinutos > 60) {
            return precioBase + 5.0; // 5 "galletas" extra
        }
        return precioBase;
    }
}