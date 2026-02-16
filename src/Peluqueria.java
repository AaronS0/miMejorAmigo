public class Peluqueria extends Servicio {
    private String tamanoPerro; // "S", "M", "L"

    public Peluqueria(String id, String nombre, double precioBase, String tamano) {
        super(id, nombre, precioBase);
        this.tamanoPerro = tamano;
    }

    @Override
    public double calcularCostoFinal() {
        if (tamanoPerro.equals("L"))
            return precioBase * 1.5;
        if (tamanoPerro.equals("M"))
            return precioBase * 1.2;
        return precioBase;
    }
}