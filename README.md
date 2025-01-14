# **CERCLES**

## **Descripción del Proyecto**

CERCLES (Creació d'Equips i seguiment del Rendiment i CoL·laboració En projectes d'Enginyeria del Software) es una herramienta diseñada para facilitar la evaluación de las contribuciones individuales en proyectos colaborativos de ingeniería de software. Su principal objetivo es centralizar la información obtenida de GitHub y proporcionar a profesores y estudiantes una visión clara y objetiva de la participación de cada miembro del equipo. Esta solución mejora la transparencia, la equidad y la eficiencia en la evaluación de los proyectos grupales.

---

## **Requisitos de Instalación**

Antes de proceder con la instalación de CERCLES, asegúrate de cumplir con los siguientes requisitos:

1. **IDE**: Visual Studio Code (VSC) o cualquier otro IDE para proyectos backend y frontend (como IntelliJ o Eclipse).
2. **Java Development Kit (JDK)**: Descargar e instalar la versión 23 del JDK desde [Oracle](https://www.oracle.com/java/technologies/downloads/).
3. **Apache Maven**: Instalar Maven para gestionar las dependencias y construir el archivo `.war`.
   - En Linux/Ubuntu: `sudo apt install maven`
   - En Windows: Descargar desde [Maven](https://maven.apache.org/download.cgi) e incluirlo en las variables de entorno.
4. **Node.js y npm**: Descargar e instalar la versión 16+ de Node.js desde [Node.js](https://nodejs.org/en/).
5. **Servidor Web Apache Tomcat**: Descargar la versión 10.x desde [Tomcat Downloads](https://tomcat.apache.org/download-10.cgi) y configurarlo para desplegar aplicaciones web.
6. **Base de datos MariaDB**: Descargar e instalar MariaDB desde [MariaDB Official Downloads](https://mariadb.org/download/).

---

## **Pasos de Instalación**

### **1. Generar el Archivo `.war`**

El archivo `.war` ya debería estar disponible. Si necesitas generarlo nuevamente, puedes hacerlo desde el IDE configurado con Maven. Este archivo se guarda automáticamente en la carpeta `target` dentro del directorio del proyecto backend.

### **2. Desplegar el Archivo `.war`**

Copia el archivo `.war` al directorio `webapps` del servidor Apache Tomcat. Tomcat se encargará de descomprimir y desplegar el archivo.

### **3. Configurar la Base de Datos**

1. Crear una nueva base de datos en MariaDB o MySQL.
2. Guarda la URL, el puerto, el usuario y la contraseña de conexión.
3. No es necesario añadir tablas ni datos manualmente; la aplicación los creará automáticamente al ejecutarse por primera vez.

### **4. Configurar la Conexión a la Base de Datos**

Edita el archivo `application.properties`, ubicado en `src/main/resources` del proyecto backend, para incluir los datos de conexión de la base de datos. Un ejemplo de configuración:

```properties
# Datasource
spring.datasource.url=jdbc:mariadb://localhost:3306/nombreBD
spring.datasource.username=username
spring.datasource.password=password
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver

# JPA Properties
spring.jpa.database-platform=org.hibernate.dialect.MariaDBDialect
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
```

### **5. Iniciar el Servidor**

Inicia Apache Tomcat y verifica que la aplicación esté funcionando accediendo a `http://localhost:8080`.

---

## **Licencia**

This project is licensed under the Apache License 2.0 - see the [LICENSE](./LICENSE) file for details.

---
