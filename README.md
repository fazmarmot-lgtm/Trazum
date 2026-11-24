# Trazum

[English](README_EN.md) · [Presentación para hackatones](PITCH.md) · [Evidencia y demo](DEMO.md)

**Un proyecto estudiantil argentino que investiga cómo acompañar los movimientos de la escritura a mano.** Si sostener o mover un lápiz cuesta, el esfuerzo empieza antes de la primera letra. Empecé Trazum después de conocer esa dificultad durante una visita a mi antiguo colegio, el Instituto Social Militar Dr. Dámaso Centeno. [Historia del proyecto](docs/HISTORIA.md)

Soy Lautaro Verón. Empecé Trazum como estudiante, a los 15 años. Mi objetivo a largo plazo es explorar un guante robótico que pueda acompañar movimientos de dedos y muñeca con sensores y actuadores. En esta etapa trabajo con simulaciones y prototipos de mesa.

![Índice de mesa en extensión](media/indice-extension.png)

*Índice de mesa en extensión, imagen aportada por el autor.* [Galería del índice](media/README.md)

## Qué preparé para que lo puedas probar

Hice un simulador con dos articulaciones y un lápiz virtual. En **Dibujar mi trazo** podés dibujar y comparar la entrada perturbada con la salida filtrada. También dejé un lazo de ejemplo. Uso el mismo nivel de perturbación en las dos corridas, y el gráfico muestra los errores RMS y máximo.

El filtro usa las muestras de posición actuales y anteriores. Uso el trazo como referencia para generar la entrada y evaluar el resultado. [Base teórica](docs/BASE_TEORICA.md) · [Arquitectura](docs/ARQUITECTURA.md)

### Ejecutarlo en tu equipo

Requiere Git y Node.js **22.12 o superior** con npm. La instalación descarga las dependencias. La demo se ejecuta de forma local, sin cuentas ni servicios pagos.

```sh
git clone https://github.com/fazmarmot-lgtm/Trazum.git
cd Trazum
npm ci
npm run dev
```

Abrí la dirección que imprime Vite, normalmente `http://localhost:5173`. Para correr las comprobaciones o servir la compilación de producción:

```sh
npm test
npm run build
npm run preview
```

## Qué comprobé

| Evidencia | Resultado | Alcance |
| --- | --- | --- |
| Simulador público | 121 muestras reproducibles. Con los valores iniciales, el error RMS es 0,176 para la entrada y 0,144 con el filtro. | Caso sintético con trayectoria conocida. |
| Índice impreso | Armé y flexioné a mano un índice de seis piezas en mesa. | Observación cualitativa de una unidad. |
| Auditorías digitales | Revisé 192 configuraciones del índice y 45 posturas de la mano compacta sin encontrar interferencias en esas muestras. | Los informes coinciden con las mallas de esas revisiones. |

Todavía tengo que integrar sensores y motores, y comprobar si puedo estimar el movimiento de la mano. En la próxima prueba voy a medir fuerza y recorrido en mesa. Después quiero evaluar si el proyecto puede ayudar en una tarea de escritura. **Trazum es un prototipo experimental. Todavía no tiene validación como dispositivo médico.** [Desarrollo y resultados](docs/DESARROLLO.md) · [Limitaciones](docs/LIMITACIONES.md)

## IA y presentación

Usé ChatGPT/Codex para desarrollo y documentación, y Claude y DeepSeek para revisar el diseño y los informes. La demo aplica cinemática y suavizado exponencial sin modelos entrenados ni APIs de IA. [Declaración de IA](docs/USO_DE_IA.md)

Voy a sumar el enlace al video cuando esté listo. [Guion y evidencia](DEMO.md) · [Preguntas del jurado](PREGUNTAS.md)
