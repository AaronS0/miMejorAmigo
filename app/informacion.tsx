import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function InformacionScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={20} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.title}>Sobre Nosotros</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Logo/Icon Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <FontAwesome5 name="paw" size={48} color="#4ECDC4" />
          </View>
          <Text style={styles.appName}>Mi Mejor Amigo</Text>
          <Text style={styles.version}>v1.1.0</Text>
        </View>

        {/* Main Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuestra Historia</Text>
          <Text style={styles.sectionText}>
            Mi Mejor Amigo es una empresa familiar con más de 10 años de experiencia, pensada por y para los animales. Nace de la pasión de dueños de mascotas que comprenden la importancia de contar con una red confiable de cuidadores profesionales.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuestra Misión</Text>
          <Text style={styles.sectionText}>
            Buscamos que las personas puedan tener seguridad de dónde, con quién y cómo están sus mascotas a tiempo real, utilizando una plataforma de información segura y una red de afiliados de confianza.

            Cada servicio es monitoreado, cada prestador es verificado, y cada mascota es tratada como si fuera la nuestra.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Qué Ofrecemos?</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <FontAwesome5 name="shield-alt" size={18} color="#4ECDC4" />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Seguridad Verificada</Text>
                <Text style={styles.featureDesc}>Todos nuestros prestadores son verificados y cuentan con referencias.</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <FontAwesome5 name="map-marker-alt" size={18} color="#4ECDC4" />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Ubicación en Tiempo Real</Text>
                <Text style={styles.featureDesc}>Rastrea dónde está tu mascota durante todo el servicio.</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <FontAwesome5 name="phone" size={18} color="#4ECDC4" />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Soporte 24/7</Text>
                <Text style={styles.featureDesc}>Estamos disponibles para ayudarte en cualquier momento.</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <FontAwesome5 name="certificate" size={18} color="#4ECDC4" />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Profesionales Certificados</Text>
                <Text style={styles.featureDesc}>Nuestros prestadores cuentan con experiencia y certificaciones.</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <FontAwesome5 name="comments" size={18} color="#4ECDC4" />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Reseñas Verificadas</Text>
                <Text style={styles.featureDesc}>Consulta opiniones de otros dueños sobre prestadores.</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <FontAwesome5 name="lock" size={18} color="#4ECDC4" />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Datos Protegidos</Text>
                <Text style={styles.featureDesc}>Tu información está encriptada y segura.</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuestros Servicios</Text>
          <View style={styles.servicesList}>
            <View style={styles.serviceItem}>
              <FontAwesome5 name="paw" size={20} color="#FF6B6B" />
              <Text style={styles.serviceText}>Paseo de Mascotas</Text>
            </View>
            <View style={styles.serviceItem}>
              <FontAwesome5 name="home" size={20} color="#4ECDC4" />
              <Text style={styles.serviceText}>Guardería</Text>
            </View>
            <View style={styles.serviceItem}>
              <FontAwesome5 name="shower" size={20} color="#FFE66D" />
              <Text style={styles.serviceText}>Baño y Grooming</Text>
            </View>
            <View style={styles.serviceItem}>
              <FontAwesome5 name="heart" size={20} color="#FF85A2" />
              <Text style={styles.serviceText}>Servicios de Pareja</Text>
            </View>
            <View style={styles.serviceItem}>
              <FontAwesome5 name="graduation-cap" size={20} color="#A8E6CF" />
              <Text style={styles.serviceText}>Entrenamiento</Text>
            </View>
            <View style={styles.serviceItem}>
              <FontAwesome5 name="stethoscope" size={20} color="#B19CD9" />
              <Text style={styles.serviceText}>Apoyo Veterinario</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacta con Nosotros</Text>
          <View style={styles.contactBox}>
            <View style={styles.contactItem}>
              <FontAwesome5 name="envelope" size={16} color="#4ECDC4" />
              <Text style={styles.contactText}>contacto@mimejoramigo.com</Text>
            </View>
            <View style={styles.contactItem}>
              <FontAwesome5 name="phone" size={16} color="#4ECDC4" />
              <Text style={styles.contactText}>+56 9 1234 5678</Text>
            </View>
            <View style={styles.contactItem}>
              <FontAwesome5 name="clock" size={16} color="#4ECDC4" />
              <Text style={styles.contactText}>Disponibles 24/7</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Agradecimiento</Text>
          <Text style={styles.sectionText}>
            Agradecemos a todos nuestros usuarios, prestadores y socios que hacen posible que Mi Mejor Amigo sea el lugar de confianza para cuidar de nuestras mascotas.

            Tu mascota merece lo mejor, y nosotros nos comprometemos a brindarlo.
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
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0F7F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  version: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceItem: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 8,
  },
  serviceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
  contactBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 13,
    color: '#2C3E50',
    fontWeight: '500',
  },
  spacing: {
    height: 40,
  },
});
