import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Billetera {
    private String id;
    private String idUsuario;
    private double saldoGalletas;
    private List<Transaccion> historialTransacciones;

    public Billetera() {
        this.saldoGalletas = 0.0;
        this.historialTransacciones = new ArrayList<>();
    }

    public Billetera(String id, String idUsuario) {
        this.id = id;
        this.idUsuario = idUsuario;
        this.saldoGalletas = 0.0;
        this.historialTransacciones = new ArrayList<>();
    }

    // Métodos de operación
    public void recargar(double cantidad, String metodoPago) {
        if (cantidad > 0) {
            this.saldoGalletas += cantidad;
            registrarTransaccion(cantidad, "RECARGA", "Sistema", metodoPago);
        }
    }

    public void retirar(double cantidad) {
        if (cantidad > 0 && saldoGalletas >= cantidad) {
            this.saldoGalletas -= cantidad;
            registrarTransaccion(cantidad, "RETIRO", "Usuario", null);
        }
    }

    public boolean pagar(double monto, String descripcion) {
        if (saldoGalletas >= monto) {
            saldoGalletas -= monto;
            registrarTransaccion(monto, "PAGO", descripcion, null);
            return true;
        }
        return false;
    }

    public void agregarGalletas(double cantidad, String razon) {
        if (cantidad > 0) {
            saldoGalletas += cantidad;
            registrarTransaccion(cantidad, "ABONO", razon, null);
        }
    }

    private void registrarTransaccion(double monto, String tipo, String descripcion, String metodo) {
        Transaccion t = new Transaccion(tipo, monto, descripcion, metodo);
        historialTransacciones.add(t);
    }

    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getIdUsuario() { return idUsuario; }
    public void setIdUsuario(String idUsuario) { this.idUsuario = idUsuario; }

    public double getSaldo() { return saldoGalletas; }
    public void setSaldoGalletas(double saldoGalletas) { this.saldoGalletas = saldoGalletas; }

    public List<Transaccion> getHistorialTransacciones() { return historialTransacciones; }
    public void setHistorialTransacciones(List<Transaccion> historialTransacciones) { 
        this.historialTransacciones = historialTransacciones; 
    }

    // Clase interna para registrar transacciones
    public static class Transaccion {
        private String tipo; // RECARGA, PAGO, RETIRO, ABONO
        private double monto;
        private String descripcion;
        private String metodoPago; // TARJETA, TRANSFERENCIA, etc.
        private Date fecha;

        public Transaccion(String tipo, double monto, String descripcion, String metodoPago) {
            this.tipo = tipo;
            this.monto = monto;
            this.descripcion = descripcion;
            this.metodoPago = metodoPago;
            this.fecha = new Date();
        }

        public String getTipo() { return tipo; }
        public double getMonto() { return monto; }
        public String getDescripcion() { return descripcion; }
        public String getMetodoPago() { return metodoPago; }
        public Date getFecha() { return fecha; }
    }
}