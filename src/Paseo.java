public class Paseo extends Servicio {
    private int duracionMinutos;
    private String zona;

    public Paseo() {
    }

    public Paseo(String id, String nombre, double precioBase, int duracion) {
        super(id, nombre, precioBase);
        this.duracionMinutos = duracion;
    }

    public Paseo(String id, String nombre, double precioBase, int duracion, String zona) {
        super(id, nombre, precioBase);
        this.duracionMinutos = duracion;
        this.zona = zona;
    }

    @Override
    public double calcularCostoFinal() {
        // Lógica: si dura más de una hora, cobramos recargo
        if (duracionMinutos > 60) {
            return precioBase + 5.0;
        }
        return precioBase;
    }

    public int getDuracionMinutos() { return duracionMinutos; }
    public void setDuracionMinutos(int duracionMinutos) { this.duracionMinutos = duracionMinutos; }

    public String getZona() { return zona; }
    public void setZona(String zona) { this.zona = zona; }
}