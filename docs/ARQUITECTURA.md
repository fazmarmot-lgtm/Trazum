# Cómo construí el simulador público

Usé JavaScript para conectar los controles, el gráfico Canvas 2D y el visor Three.js. Hice el mecanismo con dos articulaciones y un lápiz virtual. Su geometría está hecha con primitivas y no requiere los diseños de fabricación de la mano.

| Archivo | Qué implementé |
| --- | --- |
| [`index.html`](../index.html) y [`demo/style.css`](../demo/style.css) | La interfaz, el área para dibujar y los controles. |
| [`demo/drawing.js`](../demo/drawing.js) | Entrada de mouse, táctil, lápiz y teclado. |
| [`demo/simulation.js`](../demo/simulation.js) | Reparto uniforme de 121 muestras a lo largo del trazo, perturbación, corrección, métricas y cálculo de ángulos. |
| [`demo/main.js`](../demo/main.js) | Reproducción, gráfico y tabla de resultados. |
| [`demo/view.js`](../demo/view.js) | Render del mecanismo articulado, la referencia y el lápiz. |
| [`demo/simulation.test.js`](../demo/simulation.test.js) | Pruebas de repetibilidad, métricas y alcance del mecanismo. |

Aplico la misma perturbación a ambos modos. La fuerza de corrección define qué proporción de esa desviación quito. Uso cinemática inversa para traducir cada punto en dos ángulos y mostrar el movimiento. Todo corre en el navegador. Si WebGL falla, puedo seguir usando el dibujo, el gráfico y la tabla.
