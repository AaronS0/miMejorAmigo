import java.util.Date;

public abstract class Servicio {
    protected String id;
    protected String nombre;
    protected double precioBase;
    protected String descripcion;
    protected int duracionEstimadaMinutos;

    public Servicio() {
    }

    public Servicio(String id, String nombre, double precioBase) {
        this.id = id;
        this.nombre = nombre;
        this.precioBase = precioBase;
    }

    public Servicio(String id, String nombre, double precioBase, String descripcion, int duracion) {
        this.id = id;
        this.nombre = nombre;
        this.precioBase = precioBase;
        this.descripcion = descripcion;
        this.duracionEstimadaMinutos = duracion;
    }

    public abstract double calcularCostoFinal();

    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public double getPrecioBase() { return precioBase; }
    public void setPrecioBase(double precioBase) { this.precioBase = precioBase; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public int getDuracionEstimadaMinutos() { return duracionEstimadaMinutos; }
    public void setDuracionEstimadaMinutos(int duracionEstimadaMinutos) { 
        this.duracionEstimadaMinutos = duracionEstimadaMinutos; 
    }
}