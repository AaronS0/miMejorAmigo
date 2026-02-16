import java.util.List;
import java.util.Date;

public class Usuario {
    // Campos básicos
    private String id;
    private String nombre;
    private String email;
    private String telefonoContacto;
    private String direccion;
    private String ciudad;
    private String provincia;
    private String codigoPostal;
    private String fotoPerfil; // URL en Firebase Storage
    
    // Rol y tipo
    private String rol; // "usuario" o "prestador"
    private String tipoPrestador; // "independiente" o "empresa" (solo si rol es "prestador")
    
    // Datos de empresa (si aplica)
    private String nombreEmpresa;
    private String rut;
    private String direccionEmpresa;
    
    // Documentos y certificaciones (prestador)
    private List<String> urlDocumentos; // URLs a archivos en Firebase Storage
    private List<String> certificaciones; // URLs a certificaciones
    
    // Datos de la cuenta
    private Billetera billetera;
    private float calificacionPromedio;
    private int totalServiciosRealizados;
    private Date fechaRegistro;
    private boolean cuentaActiva;
    
    // Constructor vacío para Firebase
    public Usuario() {
    }

    public Usuario(String id, String nombre, String email, String rol) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.billetera = new Billetera();
        this.fechaRegistro = new Date();
        this.cuentaActiva = true;
        this.calificacionPromedio = 5.0f;
        this.totalServiciosRealizados = 0;
    }

    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefonoContacto() { return telefonoContacto; }
    public void setTelefonoContacto(String telefonoContacto) { this.telefonoContacto = telefonoContacto; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }

    public String getProvincia() { return provincia; }
    public void setProvincia(String provincia) { this.provincia = provincia; }

    public String getCodigoPostal() { return codigoPostal; }
    public void setCodigoPostal(String codigoPostal) { this.codigoPostal = codigoPostal; }

    public String getFotoPerfil() { return fotoPerfil; }
    public void setFotoPerfil(String fotoPerfil) { this.fotoPerfil = fotoPerfil; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public String getTipoPrestador() { return tipoPrestador; }
    public void setTipoPrestador(String tipoPrestador) { this.tipoPrestador = tipoPrestador; }

    public String getNombreEmpresa() { return nombreEmpresa; }
    public void setNombreEmpresa(String nombreEmpresa) { this.nombreEmpresa = nombreEmpresa; }

    public String getRut() { return rut; }
    public void setRut(String rut) { this.rut = rut; }

    public String getDireccionEmpresa() { return direccionEmpresa; }
    public void setDireccionEmpresa(String direccionEmpresa) { this.direccionEmpresa = direccionEmpresa; }

    public List<String> getUrlDocumentos() { return urlDocumentos; }
    public void setUrlDocumentos(List<String> urlDocumentos) { this.urlDocumentos = urlDocumentos; }

    public List<String> getCertificaciones() { return certificaciones; }
    public void setCertificaciones(List<String> certificaciones) { this.certificaciones = certificaciones; }

    public Billetera getBilletera() { return billetera; }
    public void setBilletera(Billetera billetera) { this.billetera = billetera; }

    public float getCalificacionPromedio() { return calificacionPromedio; }
    public void setCalificacionPromedio(float calificacionPromedio) { this.calificacionPromedio = calificacionPromedio; }

    public int getTotalServiciosRealizados() { return totalServiciosRealizados; }
    public void setTotalServiciosRealizados(int totalServiciosRealizados) { this.totalServiciosRealizados = totalServiciosRealizados; }

    public Date getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(Date fechaRegistro) { this.fechaRegistro = fechaRegistro; }

    public boolean isCuentaActiva() { return cuentaActiva; }
    public void setCuentaActiva(boolean cuentaActiva) { this.cuentaActiva = cuentaActiva; }
}