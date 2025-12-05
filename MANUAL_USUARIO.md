# Servicio Nacional de Aprendizaje (SENA)
## Manual de Usuario - OKBranding

- Versión: 1.0
- Fecha: 2025-03-12
- Autor: Equipo Frontend OKBranding
- Alcance: Uso completo de la aplicación web para clientes y administradores.
- Público objetivo: Usuarios finales (clientes) y administradores del catálogo y cotizaciones.
- Codificación del archivo: UTF-8 (para conservar acentos y caracteres latinos).

## Contenidos
- 1. Introducción
- 2. Objetivo del manual
- 3. Roles y accesos
  - 3.1 Rol Usuario (cliente)
  - 3.2 Rol Administrador
- 4. Guía para Usuario (cliente)
  - 4.1 Navegación pública y acceso
  - 4.2 Explorar categorías y productos
  - 4.3 Ver detalle de producto
  - 4.4 Construir y enviar una cotización
  - 4.5 Consultar, ajustar, aceptar o cancelar cotizaciones
- 5. Guía para Administrador (CRUD detallado)
  - 5.1 Estructura del panel y navegación
  - 5.2 Cotizaciones: revisar y responder
  - 5.3 Productos: crear, listar, filtrar, editar, eliminar
  - 5.4 Categorías: crear, listar, filtrar, editar, eliminar
  - 5.5 Usuarios: crear, listar, filtrar, editar, desactivar
  - 5.6 Colores: crear, listar, editar, eliminar
  - 5.7 Estados de producto: crear, editar, eliminar
  - 5.8 Carrusel Home: agregar, reemplazar, eliminar, guardar
- 6. Buenas prácticas y soporte
- 7. Mapa rápido de rutas

## 1. Introducción
Este manual describe paso a paso cómo usar la aplicación web OKBranding para gestionar un catálogo de productos promocionales y administrar cotizaciones. Incluye instrucciones específicas para clientes que solicitan cotizaciones y administradores que mantienen la información del catálogo, responden solicitudes y configuran la experiencia del sitio.

## 2. Objetivo del manual
Proporcionar instrucciones claras y accionables para que cualquier usuario (cliente o administrador) pueda:
- Navegar el sitio y encontrar productos.
- Crear y gestionar cotizaciones.
- Administrar usuarios, productos, categorías, colores, estados y carrusel.
- Entender las responsabilidades y límites de cada rol.

## 3. Roles y accesos
### 3.1 Rol Usuario (cliente)
- Puede ver el catálogo público, categorías y productos.
- Debe registrarse o iniciar sesión para cotizar y ver su historial de cotizaciones.
- Puede crear, ajustar, aceptar o cancelar sus propias cotizaciones.

### 3.2 Rol Administrador
- Accede al panel `/admin` tras iniciar sesión.
- Puede crear, editar y eliminar: productos, categorías, colores, estados de producto.
- Puede crear, editar y desactivar usuarios.
- Puede responder, cerrar o cancelar cotizaciones y gestionar el carrusel del home.

## 4. Guía para Usuario (cliente)
### 4.1 Navegación pública y acceso
1. Ingresa a la URL principal (ejemplo: `https://<tu-dominio>`).
2. Desde la barra superior puedes ir a: Nosotros, Categorías, Contáctanos o usar los botones "Ingresar" / "Registrarse".
3. Para cotizar debes iniciar sesión o registrarte en `/login` o `/register`.

### 4.2 Explorar categorías y productos
1. En la home, desplázate a la sección de categorías.
2. Haz clic en una categoría para abrir `/categorias/:id/productos`.
3. Verás un listado de productos de esa categoría. Selecciona una tarjeta para abrir el detalle.

### 4.3 Ver detalle de producto
1. En el listado, haz clic en el producto.
2. Se abre un diálogo o página con galería de imágenes, nombre, dimensiones, descripción y colores disponibles.
3. Usa los controles de galería (siguiente/anterior o miniaturas) para ver todas las imágenes.
4. Para cotizar, pulsa "Cotizar este producto" (pedirá login si no estás autenticado).

### 4.4 Construir y enviar una cotización
1. Tras pulsar "Cotizar este producto", se añade al carrito de cotización y se abre `/mis-cotizaciones`.
2. En el panel "Carrito activo":
   - Ajusta la cantidad con +/-. Si pones 0, eliminas el producto.
   - Si el producto tiene colores disponibles, selecciona al menos uno.
   - Puedes agregar un comentario por producto.
3. En "Comentarios generales" escribe instrucciones para el administrador si es necesario.
4. Botones disponibles:
   - "Seguir agregando productos": vuelve al catálogo sin perder el carrito.
   - "Cancelar cotización actual": limpia todos los productos del carrito.
   - "Enviar cotización": valida datos y envía la solicitud al administrador.

### 4.5 Consultar, ajustar, aceptar o cancelar cotizaciones
1. En el panel "Mis cotizaciones" (historial), filtra por estado si deseas (todas, respondidas, canceladas, pendientes).
2. Haz clic en una tarjeta para ver el detalle: productos, colores, comentarios, subtotales, historial.
3. Ajustar (si el administrador lo habilitó):
   - Edita cantidades (0 elimina el producto) y escribe un mensaje opcional.
   - Pulsa "Enviar ajustes al administrador".
4. Aceptar (estado RESPONDIDA):
   - Escribe un mensaje opcional y pulsa "Aceptar cotización".
5. Cancelar: disponible si la cotización no está CERRADA ni CANCELADA; pulsa "Cancelar cotización".

## 5. Guía para Administrador (CRUD detallado)
### 5.1 Estructura del panel y navegación
- Acceso: iniciar sesión como administrador y entrar a `/admin`.
- Sidebar: Usuarios, Productos, Categorías, Cotizaciones, Estado Producto, Colores, Carrusel Home.
- El contenido cambia según la opción seleccionada; las rutas cargan componentes de manera diferida.

### 5.2 Cotizaciones: revisar y responder
- Listado: muestra todas las cotizaciones; filtros rápidos: Pendientes, Respondidas, Canceladas, Todas.
- Seleccionar: haz clic en una tarjeta para abrir el detalle (productos, comentarios, historial y precios propuestos).
- Responder una cotización:
  1) Ingresa precio unitario para cada producto (obligatorio, mayor a 0).
  2) Escribe un comentario al cliente (opcional).
  3) Pulsa "Enviar respuesta al cliente". El estado pasa a RESPONDIDA.
- Estados admitidos: SOLICITADA, AJUSTADA_CLIENTE, RESPONDIDA, CERRADA, CANCELADA.

### 5.3 Productos: crear, listar, filtrar, editar, eliminar
- Listar/filtrar: busca por texto, filtra por categoría y estado (activos/inactivos). El estado inactivo corresponde a idEstadoProducto = 2.
- Crear producto:
  1) Botón "Crear producto".
  2) Completa campos: Nombre, Descripción, Dimensiones, Categoría, Estado de producto.
  3) Colores: marca los checkboxes de los colores disponibles.
  4) Imágenes: agrega una o más URLs; puedes eliminar filas antes de guardar.
  5) Pulsa "Guardar" para registrar.
- Editar producto:
  1) En la tarjeta, haz clic en "Editar".
  2) Modifica campos necesarios.
  3) Actualiza imágenes o colores si aplica.
  4) Guarda para aplicar cambios.
- Eliminar producto:
  1) Botón "Eliminar" en la tarjeta.
  2) Confirma la acción en el diálogo del navegador.

### 5.4 Categorías: crear, listar, filtrar, editar, eliminar
- Listar/filtrar: cuadro de búsqueda por nombre o descripción; botón "Limpiar filtros".
- Crear categoría:
  1) Botón "Nueva categoría".
  2) En el diálogo, ingresa Nombre, Descripción e Imagen (URL).
  3) Guarda para crear.
- Editar categoría:
  1) Botón "Editar" en la tarjeta.
  2) Actualiza los campos y guarda.
- Eliminar categoría:
  1) Botón "Eliminar" en la tarjeta.
  2) Confirma. Si la categoría está asociada a productos, la eliminación se bloquea con advertencia.

### 5.5 Usuarios: crear, listar, filtrar, editar, desactivar
- Listar/filtrar: busca por nombre, correo o usuario; filtra por estado (activos/inactivos) y rol; botón "Limpiar filtros".
- Crear usuario:
  1) Botón "Nuevo usuario".
  2) Completa datos en el formulario (nombre, correo, usuario, rol, etc.).
  3) Guarda para crear.
- Editar usuario:
  1) Botón de lápiz en la fila.
  2) Actualiza los campos necesarios.
  3) Guarda para aplicar cambios.
- Desactivar usuario:
  1) Botón de papelera en la fila.
  2) Confirma el mensaje de advertencia; el usuario queda inactivo.

### 5.6 Colores: crear, listar, editar, eliminar
- Listar: tarjetas con vista previa, nombre y código hex.
- Crear color:
  1) Botón "Nuevo color".
  2) En el diálogo, ingresa Nombre y Código de color (hexadecimal).
  3) Guarda.
- Editar color:
  1) Botón "Editar" en la tarjeta.
  2) Ajusta nombre o código y guarda.
- Eliminar color:
  1) Botón "Eliminar" en la tarjeta.
  2) Confirma para borrar.

### 5.7 Estados de producto: crear, editar, eliminar
- Listar: tarjetas con el nombre del estado.
- Crear estado:
  1) En el formulario, escribe el nombre del estado (ej. Disponible, Agotado).
  2) Pulsa "Guardar estado".
- Editar estado:
  1) Botón de lápiz en la tarjeta.
  2) Modifica el nombre y guarda.
- Eliminar estado:
  1) Botón de papelera en la tarjeta.
  2) Confirma para eliminar.

### 5.8 Carrusel Home: agregar, reemplazar, eliminar, guardar
- Listar: cada slide muestra su vista previa y controles.
- Agregar slide: botón "Agregar slide"; se añade una tarjeta vacía.
- Reemplazar imagen:
  1) Usa "Subir nueva imagen" para cargar desde el dispositivo **o** escribe una URL en el campo de ruta.
  2) La previsualización se actualiza en la tarjeta.
- Eliminar slide: botón de papelera; debe quedar al menos un slide.
- Guardar cambios: botón "Guardar cambios" para persistir todas las imágenes en el servicio de configuración.

## 6. Buenas prácticas y soporte
- Clientes: inicia sesión antes de cotizar; selecciona colores si el producto los tiene; revisa estados y usa Ajustar/Aceptar/Cancelar según corresponda.
- Administradores: ingresa precios en todas las líneas al responder; mantiene actualizado catálogo (categorías, colores, estados) antes de crear productos; comprueba que las URLs de imágenes funcionen; valida la home tras editar el carrusel.
- En caso de error: verifica conexión, credenciales y estado del backend; reintenta la acción.

## 7. Mapa rápido de rutas
- Público: `/` (home), `/categorias/:id/productos`, `/producto/:id`, `/login`, `/register`.
- Cliente autenticado: `/mis-cotizaciones`.
- Administrador: `/admin` y subrutas `/admin/usuarios`, `/admin/productos`, `/admin/productos/crear`, `/admin/productos/editar/:id`, `/admin/categorias`, `/admin/colores`, `/admin/estadoProductos`, `/admin/pedidos`, `/admin/carrusel`.
