import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TerminosCondiciones() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={20} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.title}>Términos y Condiciones</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. ACEPTACIÓN DE TÉRMINOS</Text>
          <Text style={styles.sectionText}>
            Al utilizar la plataforma Mi Mejor Amigo, aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguna parte de estos términos, por favor no utilices la plataforma.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. DESCRIPCIÓN DEL SERVICIO</Text>
          <Text style={styles.sectionText}>
            Mi Mejor Amigo es una plataforma digital que conecta dueños de mascotas con prestadores de servicios certificados. Contamos con más de 10 años de experiencia como empresa familiar pensada por y para los animales.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. INFORMACIÓN SEGURA</Text>
          <Text style={styles.sectionText}>
            Buscamos que las personas puedan tener seguridad de dónde, con quién y cómo están sus mascotas a tiempo real, utilizando una plataforma de información segura y una red de afiliados de confianza.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. RESPONSABILIDADES DEL USUARIO</Text>
          <Text style={styles.sectionText}>
            • Proporcionar información precisa y actualizada en tu perfil.{'\n'}
            • Mantener la confidencialidad de tu contraseña.{'\n'}
            • Notificar inmediatamente sobre acceso no autorizado.{'\n'}
            • Cumplir con todas las leyes y regulaciones aplicables.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. SERVICIOS Y RESERVAS</Text>
          <Text style={styles.sectionText}>
            Al reservar un servicio, aceptas los términos específicos del prestador. Ambas partes son responsables de cumplir con lo acordado. Cualquier disputa será resuelta de acuerdo a nuestro protocolo de mediación.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. PRIVACIDAD Y DATOS</Text>
          <Text style={styles.sectionText}>
            Tu privacidad es importante. Consulta nuestra Política de Privacidad para conocer cómo recopilamos, usamos y protegemos tus datos personales. Tus datos se mantienen encriptados y seguros.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. LIMITACIÓN DE RESPONSABILIDAD</Text>
          <Text style={styles.sectionText}>
            Mi Mejor Amigo no es responsable por daños indirectos, incidentales o consecuentes derivados del uso de la plataforma. Usamos todas las medidas razonables para garantizar la disponibilidad del servicio.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. MODIFICACIONES DE TÉRMINOS</Text>
          <Text style={styles.sectionText}>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos de cambios significativos. El uso continuado de la plataforma constituye aceptación de los nuevos términos.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. TERMINACIÓN</Text>
          <Text style={styles.sectionText}>
            Podemos terminar tu acceso a la plataforma si incumples estos términos. También puedes solicitar la eliminación de tu cuenta en cualquier momento desde la configuración.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. CONTACTO</Text>
          <Text style={styles.sectionText}>
            Si tienes preguntas sobre estos términos, por favor contacta a nuestro equipo de soporte a través de la sección de Ayuda en la plataforma.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ÚLTIMA ACTUALIZACIÓN</Text>
          <Text style={styles.sectionText}>
            Febrero 2026. Esta es una versión de borrador inicial y puede ser modificada según feedback legal y de usuarios.
          </Text>
        </View>
      </View>

      <View style={styles.spacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  spacing: {
    height: 40,
  },
});
