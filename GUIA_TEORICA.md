# Guia teorica breve

## 1. Que es una API REST?

Es un servicio que permite que aplicaciones intercambien datos mediante HTTP. Usa metodos como GET, POST, PUT y DELETE para consultar, crear, modificar y eliminar recursos.

## 2. Para que sirve Express?

Express permite crear el servidor, definir rutas, recibir solicitudes y devolver respuestas desde Node.js.

## 3. Que funcion cumplen MongoDB y Mongoose?

MongoDB almacena documentos en colecciones. Mongoose permite definir modelos y esquemas, validar datos y realizar consultas desde Node.js.

## 4. Para que sirven Multer y Cloudinary?

Multer recibe la imagen enviada mediante `multipart/form-data`. Cloudinary almacena la imagen en la nube y devuelve su URL y su identificador publico.

## 5. Como funciona la verificacion por correo?

El servidor genera un codigo aleatorio, guarda cifrada una copia temporal en MongoDB y lo envia con Nodemailer. Al registrar al usuario, compara el codigo recibido con el guardado. Si coincide y no ha vencido, completa el registro.

## Conceptos adicionales

- **Middleware:** funcion que procesa una solicitud antes del controlador.
- **CRUD:** crear, leer, actualizar y eliminar datos.
- **bcrypt:** protege contrasenas y codigos mediante hash.
- **Variables de entorno:** guardan configuraciones y secretos fuera del codigo.
- **200:** solicitud correcta.
- **201:** recurso creado.
- **400:** datos incorrectos.
- **404:** recurso no encontrado.
- **409:** conflicto, por ejemplo un correo duplicado.
- **500:** error interno del servidor.
