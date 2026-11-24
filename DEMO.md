# Cómo muestro Trazum

Primero abro el [simulador público](README.md#ejecutarlo-en-tu-equipo). En **Draw my own path** dibujo un trazo continuo con el mouse, el dedo o un lápiz táctil. También puedo mover el cursor con las flechas y usar la barra espaciadora para marcar puntos.

Elijo **Use my path** y después **Run**. Puedo cambiar **Motion shown in 3D** para ver el recorrido sin corrección o el que se acerca al trazo. En el gráfico comparo ambos sobre el mismo dibujo. Si quiero volver al lazo inicial, uso **Use example loop**.

Con los parámetros iniciales veo estos resultados. La unidad es virtual.

| Error | Sin corrección | Con corrección |
| --- | ---: | ---: |
| RMS | 0,176 | 0,062 |
| Pico | 0,250 | 0,087 |

Como control, bajo la corrección a 0 %. En ese caso las dos columnas coinciden. La demo usa el trazo como referencia conocida, así que esta prueba me permite comparar el seguimiento de un objetivo. Para estimar un movimiento de escritura a partir de sensores necesitaría otra prueba.

## Qué muestro del prototipo físico

Imprimí y probé un índice sobre una mesa. Puedo mostrar cómo se flexiona a mano y explicar qué me falta medir. [Galería del índice](media/README.md) · [Qué comprobé en CAD y en mesa](docs/DESARROLLO.md)

## Video

Voy a sumar el enlace del video a esta página cuando esté listo. En la grabación quiero mostrar el dibujo, activar la comparación y explicar qué aprendí con el índice y qué falta probar. [Reglas de STEM2Connect](https://stem2connect-online-hackathon.devpost.com/rules)
