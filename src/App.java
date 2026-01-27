public class App {
    public static void main(String[] args) {
        // Creamos al usuario (Tú)
        Usuario cliente = new Usuario("U001", "Aaron", "CLIENTE");

        // Recargamos galletas
        cliente.getBilletera().recargar(5000);

        System.out.println("Usuario: " + cliente.getNombre());
        System.out.println("Saldo inicial: " + cliente.getBilletera().getSaldo() + " galletas.");

        // Creamos una lista de servicios solicitados
        Servicio s1 = new Paseo("P01", "Paseo Largo", 20.0, 90);
        Servicio s2 = new Peluqueria("B01", "Corte de Verano", 30.0, "L");

        System.out.println("Servicio: " + s1.getNombre() + " | Costo: " + s1.calcularCostoFinal());
        System.out.println("Servicio: " + s2.getNombre() + " | Costo: " + s2.calcularCostoFinal());
    }
}