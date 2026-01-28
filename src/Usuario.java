public class Usuario {
    private String id;
    private String nombre;
    private String rol;
    private Billetera billetera; // Composición: El usuario TIENE una billetera

    public Usuario(String id, String nombre, String rol) {
        this.id = id;
        this.nombre = nombre;
        this.rol = rol;
        this.billetera = new Billetera(); // Se crea vacía al iniciar
    }

    // Getters
    public String getNombre() {
        return nombre;
    }

    public Billetera getBilletera() {
        return billetera;
    }
}