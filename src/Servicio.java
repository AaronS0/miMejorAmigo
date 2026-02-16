public abstract class Servicio {
    protected String id;
    protected String nombre;
    protected double precioBase;

    public Servicio(String id, String nombre, double precioBase) {
        this.id = id;
        this.nombre = nombre;
        this.precioBase = precioBase;
    }

    // El método que cada clase hija implementará a su modo
    public abstract double calcularCostoFinal();

    public String getNombre() { return nombre; }
}