import java.util.List;
import java.util.Date;

public class Mascota {
    // Datos básicos
    private String id;
    private String nombre;
    private String raza;
    private String tipo; // "perro", "gato", "pajaro", etc.
    private String tamaño; // "pequeño", "mediano", "grande"
    private float peso; // en kg
    private Date fechaNacimiento;
    
    // Dueño
    private String idDueno;
    
    // Apariencia
    private String color;
    private String fotoPerfil; // URL en Firebase Storage
    
    // Historial médico
    private List<String> historialClinico; // Registros en texto o URLs a documentos
    private List<String> vacunas; // Vacunas aplicadas
    private Date ultimaVacunacion;
    private boolean estaVacunado;
    private List<String> alergias;
    private List<String> medicamentos;
    
    // Comportamiento
    private List<String> comportamientos; // "amigable", "tímido", "agresivo", "jugueton", etc.
    private List<String> miedos; // "fuegos artificiales", "agua", "gatos", etc.
    private String nivelEnergía; // "bajo", "medio", "alto"
    private boolean esAdiestrado;
    
    // Alimentación
    private String tipoAlimentacion; // "croquetas", "comida casera", "mixta"
    private float cantidadDiaria; // en gramos o porciones
    private String marcaAlimento;
    private List<String> alimentosProhibidos;
    private String horarioAlimentacion; // "mañana", "tarde", "noche", etc.
    
    // Información de contacto en servicios
    private List<String> serviciosContratados; // IDs de servicios
    
    // Datos registrados
    private boolean activo;
    private Date fechaRegistro;

    // Constructor vacío para Firebase
    public Mascota() {
    }

    public Mascota(String id, String nombre, String raza, String tipo, String idDueno) {
        this.id = id;
        this.nombre = nombre;
        this.raza = raza;
        this.tipo = tipo;
        this.idDueno = idDueno;
        this.fechaRegistro = new Date();
        this.activo = true;
        this.estaVacunado = false;
        this.esAdiestrado = false;
    }

    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getRaza() { return raza; }
    public void setRaza(String raza) { this.raza = raza; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getTamaño() { return tamaño; }
    public void setTamaño(String tamaño) { this.tamaño = tamaño; }

    public float getPeso() { return peso; }
    public void setPeso(float peso) { this.peso = peso; }

    public Date getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(Date fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

    public String getIdDueno() { return idDueno; }
    public void setIdDueno(String idDueno) { this.idDueno = idDueno; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getFotoPerfil() { return fotoPerfil; }
    public void setFotoPerfil(String fotoPerfil) { this.fotoPerfil = fotoPerfil; }

    public List<String> getHistorialClinico() { return historialClinico; }
    public void setHistorialClinico(List<String> historialClinico) { this.historialClinico = historialClinico; }

    public List<String> getVacunas() { return vacunas; }
    public void setVacunas(List<String> vacunas) { this.vacunas = vacunas; }

    public Date getUltimaVacunacion() { return ultimaVacunacion; }
    public void setUltimaVacunacion(Date ultimaVacunacion) { this.ultimaVacunacion = ultimaVacunacion; }

    public boolean isEstaVacunado() { return estaVacunado; }
    public void setEstaVacunado(boolean estaVacunado) { this.estaVacunado = estaVacunado; }

    public List<String> getAlergias() { return alergias; }
    public void setAlergias(List<String> alergias) { this.alergias = alergias; }

    public List<String> getMedicamentos() { return medicamentos; }
    public void setMedicamentos(List<String> medicamentos) { this.medicamentos = medicamentos; }

    public List<String> getComportamientos() { return comportamientos; }
    public void setComportamientos(List<String> comportamientos) { this.comportamientos = comportamientos; }

    public List<String> getMiedos() { return miedos; }
    public void setMiedos(List<String> miedos) { this.miedos = miedos; }

    public String getNivelEnergía() { return nivelEnergía; }
    public void setNivelEnergía(String nivelEnergía) { this.nivelEnergía = nivelEnergía; }

    public boolean isEsAdiestrado() { return esAdiestrado; }
    public void setEsAdiestrado(boolean esAdiestrado) { this.esAdiestrado = esAdiestrado; }

    public String getTipoAlimentacion() { return tipoAlimentacion; }
    public void setTipoAlimentacion(String tipoAlimentacion) { this.tipoAlimentacion = tipoAlimentacion; }

    public float getCantidadDiaria() { return cantidadDiaria; }
    public void setCantidadDiaria(float cantidadDiaria) { this.cantidadDiaria = cantidadDiaria; }

    public String getMarcaAlimento() { return marcaAlimento; }
    public void setMarcaAlimento(String marcaAlimento) { this.marcaAlimento = marcaAlimento; }

    public List<String> getAlimentosProhibidos() { return alimentosProhibidos; }
    public void setAlimentosProhibidos(List<String> alimentosProhibidos) { this.alimentosProhibidos = alimentosProhibidos; }

    public String getHorarioAlimentacion() { return horarioAlimentacion; }
    public void setHorarioAlimentacion(String horarioAlimentacion) { this.horarioAlimentacion = horarioAlimentacion; }

    public List<String> getServiciosContratados() { return serviciosContratados; }
    public void setServiciosContratados(List<String> serviciosContratados) { this.serviciosContratados = serviciosContratados; }

    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }

    public Date getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(Date fechaRegistro) { this.fechaRegistro = fechaRegistro; }
}