public class Billetera {
    private double saldoGalletas;

    public Billetera() {
        this.saldoGalletas = 0.0;
    }

    public void recargar(double cantidad) {
        this.saldoGalletas += cantidad;
    }

    public double getSaldo() {
        return saldoGalletas;
    }

    public boolean pagar(double monto) {
        if (saldoGalletas >= monto) {
            saldoGalletas -= monto;
            return true;
        }
        return false;
    }
}