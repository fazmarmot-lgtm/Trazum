# Demostración y evidencia

## Reproducir la prueba digital

1. Ejecutá los [comandos del README](README.md#ejecutarlo-en-tu-equipo) y abrí el simulador.
2. Tocá **Reset run** para volver a 0,20 de perturbación y 65 % de corrección. Ejecutá **Run**. La corrida termina en cuatro segundos, con 121 muestras.
3. Mirá el trazo y los errores en la tabla. Cambiá **Motion shown in 3D** a **Target correction** para ver el otro recorrido. La tabla compara ambos bajo la misma perturbación.
4. Llevá la corrección a 0 % y comprobá que ambas columnas coinciden. Volvé a reiniciar.

| Valores iniciales | Sin corrección | Con corrección |
| --- | ---: | ---: |
| RMS | 0,176 | 0,062 |
| Pico | 0,250 | 0,087 |

Los errores están en unidades virtuales. El ejemplo le da a la corrección acceso al objetivo. [Qué se verificó en CAD y en mesa](docs/DESARROLLO.md)

## Imágenes del índice

La galería incluye las vistas en extensión, en flexión y de perfil, junto con una ilustración generada con IA identificada en su pie. [Galería del índice](media/README.md)

## Guion de grabación para el jurado

- **0:00–0:35**. Presentar el problema y explicar qué parte explora el simulador.
- **0:35–2:15**. Ejecutar la app. Mover la cámara, cambiar el modo y mostrar qué pasa con 0 % de corrección.
- **2:15–3:00**. Si se graba una toma del índice, mostrar una flexión manual en mesa. Los resultados del simulador y la observación física son pruebas distintas.
- **3:00–3:40**. Explicar qué se aprendió, las limitaciones actuales, qué se midió y qué queda por medir. Mencionar las herramientas de IA usadas.

**Video pendiente.** Para STEM2Connect, subir a YouTube o Vimeo con acceso público o no listado y mantener la duración en seis minutos o menos. [Reglas oficiales](https://stem2connect-online-hackathon.devpost.com/rules)
