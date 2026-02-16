import java.util.Date;

public class Prestador extends Usuario {
    private int numeroCedula;
    private boolean verificado;
    private String numeroLicencia;
    private Date vencimientoLicencia;
    private boolean tieneCursos;
    private String especialidades;
    private int yearExperiencia;
    private boolean aceptaGrandes;
    private boolean aceptaPequeños;
    private boolean aceptaGatos;
    private boolean aceptaOtros;
    private double comisionEmpresa; // Si trabaja en empresa
    private double precioMinimoServicio;
    private double precioMaximoServicio;
    private String horarioDisponibilidad;
    private String radioAccion; // En km, zona de cobertura
    private boolean disponibleFinesde;
    private boolean disponibleNocturno;
    private int serviciosCompletados;
    private float puntuacionPromedio;

    // Constructor vacío para Firebase
    public Prestador() {
    }

    public Prestador(String id, String nombre, String email, String rol) {
        super(id, nombre, email, rol);
        this.verificado = false;
        this.serviciosCompletados = 0;
        this.puntuacionPromedio = 5.0f;
    }

    // Getters y Setters
    public int getNumeroCedula() { return numeroCedula; }
    public void setNumeroCedula(int numeroCedula) { this.numeroCedula = numeroCedula; }

    public boolean isVerificado() { return verificado; }
    public void setVerificado(boolean verificado) { this.verificado = verificado; }

    public String getNumeroLicencia() { return numeroLicencia; }
    public void setNumeroLicencia(String numeroLicencia) { this.numeroLicencia = numeroLicencia; }

    public Date getVencimientoLicencia() { return vencimientoLicencia; }
    public void setVencimientoLicencia(Date vencimientoLicencia) { this.vencimientoLicencia = vencimientoLicencia; }

    public boolean isTieneCursos() { return tieneCursos; }
    public void setTieneCursos(boolean tieneCursos) { this.tieneCursos = tieneCursos; }

    public String getEspecialidades() { return especialidades; }
    public void setEspecialidades(String especialidades) { this.especialidades = especialidades; }

    public int getYearExperiencia() { return yearExperiencia; }
    public void setYearExperiencia(int yearExperiencia) { this.yearExperiencia = yearExperiencia; }

    public boolean isAceptaGrandes() { return aceptaGrandes; }
    public void setAceptaGrandes(boolean aceptaGrandes) { this.aceptaGrandes = aceptaGrandes; }

    public boolean isAceptaPequeños() { return aceptaPequeños; }
    public void setAceptaPequeños(boolean aceptaPequeños) { this.aceptaPequeños = aceptaPequeños; }

    public boolean isAceptaGatos() { return aceptaGatos; }
    public void setAceptaGatos(boolean aceptaGatos) { this.aceptaGatos = aceptaGatos; }

    public boolean isAceptaOtros() { return aceptaOtros; }
    public void setAceptaOtros(boolean aceptaOtros) { this.aceptaOtros = aceptaOtros; }

    public double getComisionEmpresa() { return comisionEmpresa; }
    public void setComisionEmpresa(double comisionEmpresa) { this.comisionEmpresa = comisionEmpresa; }

    public double getPrecioMinimoServicio() { return precioMinimoServicio; }
    public void setPrecioMinimoServicio(double precioMinimoServicio) { this.precioMinimoServicio = precioMinimoServicio; }

    public double getPrecioMaximoServicio() { return precioMaximoServicio; }
    public void setPrecioMaximoServicio(double precioMaximoServicio) { this.precioMaximoServicio = precioMaximoServicio; }

    public String getHorarioDisponibilidad() { return horarioDisponibilidad; }
    public void setHorarioDisponibilidad(String horarioDisponibilidad) { this.horarioDisponibilidad = horarioDisponibilidad; }

    public String getRadioAccion() { return radioAccion; }
    public void setRadioAccion(String radioAccion) { this.radioAccion = radioAccion; }

    public boolean isDisponibleFinesde() { return disponibleFinesde; }
    public void setDisponibleFinesde(boolean disponibleFinesde) { this.disponibleFinesde = disponibleFinesde; }

    public boolean isDisponibleNocturno() { return disponibleNocturno; }
    public void setDisponibleNocturno(boolean disponibleNocturno) { this.disponibleNocturno = disponibleNocturno; }

    public int getServiciosCompletados() { return serviciosCompletados; }
    public void setServiciosCompletados(int serviciosCompletados) { this.serviciosCompletados = serviciosCompletados; }

    public float getPuntuacionPromedio() { return puntuacionPromedio; }
    public void setPuntuacionPromedio(float puntuacionPromedio) { this.puntuacionPromedio = puntuacionPromedio; }
}
