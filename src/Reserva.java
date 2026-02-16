import java.util.Date;
import java.util.List;

public class Reserva {
    private String id;
    private String idUsuario; // Quien contrató
    private String idPrestador; // Quien brinda el servicio
    private String idMascota;
    private String tipoServicio; // "paseo", "guarderia", "banio", etc.
    private Date fechaServicio;
    private int horaInicio; // Hora en formato 24h
    private int minutoInicio;
    private int duracionMinutos;
    private String estado; // "pendiente", "confirmada", "en_progreso", "completada", "cancelada"
    private double costoTotal;
    private double costoAdelantos; // Extras pagados durante el servicio
    private String ubicacionInicio;
    private String ubicacionFin;
    private String notas; // Instrucciones especiales del cliente
    private List<String> fotosServicio; // URLs a Firebase Storage
    private List<String> videosServicio; // URLs a Firebase Storage
    private float calificacionServicio;
    private String comentarioServicio;
    private Date fechaCreacion;
    private Date fechaConfirmacion;
    private Date fechaFinalizacion;

    // Constructor vacío para Firebase
    public Reserva() {
    }

    public Reserva(String id, String idUsuario, String idPrestador, String idMascota, 
                   String tipoServicio, Date fechaServicio) {
        this.id = id;
        this.idUsuario = idUsuario;
        this.idPrestador = idPrestador;
        this.idMascota = idMascota;
        this.tipoServicio = tipoServicio;
        this.fechaServicio = fechaServicio;
        this.estado = "pendiente";
        this.costoAdelantos = 0;
        this.fechaCreacion = new Date();
    }

    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getIdUsuario() { return idUsuario; }
    public void setIdUsuario(String idUsuario) { this.idUsuario = idUsuario; }

    public String getIdPrestador() { return idPrestador; }
    public void setIdPrestador(String idPrestador) { this.idPrestador = idPrestador; }

    public String getIdMascota() { return idMascota; }
    public void setIdMascota(String idMascota) { this.idMascota = idMascota; }

    public String getTipoServicio() { return tipoServicio; }
    public void setTipoServicio(String tipoServicio) { this.tipoServicio = tipoServicio; }

    public Date getFechaServicio() { return fechaServicio; }
    public void setFechaServicio(Date fechaServicio) { this.fechaServicio = fechaServicio; }

    public int getHoraInicio() { return horaInicio; }
    public void setHoraInicio(int horaInicio) { this.horaInicio = horaInicio; }

    public int getMinutoInicio() { return minutoInicio; }
    public void setMinutoInicio(int minutoInicio) { this.minutoInicio = minutoInicio; }

    public int getDuracionMinutos() { return duracionMinutos; }
    public void setDuracionMinutos(int duracionMinutos) { this.duracionMinutos = duracionMinutos; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public double getCostoTotal() { return costoTotal; }
    public void setCostoTotal(double costoTotal) { this.costoTotal = costoTotal; }

    public double getCostoAdelantos() { return costoAdelantos; }
    public void setCostoAdelantos(double costoAdelantos) { this.costoAdelantos = costoAdelantos; }

    public String getUbicacionInicio() { return ubicacionInicio; }
    public void setUbicacionInicio(String ubicacionInicio) { this.ubicacionInicio = ubicacionInicio; }

    public String getUbicacionFin() { return ubicacionFin; }
    public void setUbicacionFin(String ubicacionFin) { this.ubicacionFin = ubicacionFin; }

    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }

    public List<String> getFotosServicio() { return fotosServicio; }
    public void setFotosServicio(List<String> fotosServicio) { this.fotosServicio = fotosServicio; }

    public List<String> getVideosServicio() { return videosServicio; }
    public void setVideosServicio(List<String> videosServicio) { this.videosServicio = videosServicio; }

    public float getCalificacionServicio() { return calificacionServicio; }
    public void setCalificacionServicio(float calificacionServicio) { this.calificacionServicio = calificacionServicio; }

    public String getComentarioServicio() { return comentarioServicio; }
    public void setComentarioServicio(String comentarioServicio) { this.comentarioServicio = comentarioServicio; }

    public Date getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(Date fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public Date getFechaConfirmacion() { return fechaConfirmacion; }
    public void setFechaConfirmacion(Date fechaConfirmacion) { this.fechaConfirmacion = fechaConfirmacion; }

    public Date getFechaFinalizacion() { return fechaFinalizacion; }
    public void setFechaFinalizacion(Date fechaFinalizacion) { this.fechaFinalizacion = fechaFinalizacion; }
}
