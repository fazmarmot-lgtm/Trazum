# Cómo construí el simulador público

Uso JavaScript para conectar el dibujo, el gráfico Canvas 2D y el visor Three.js. Hice el mecanismo con dos articulaciones y un lápiz virtual, usando formas geométricas simples.

| Archivo | Qué implementé |
| --- | --- |
| [`index.html`](../index.html) y [`demo/style.css`](../demo/style.css) | La interfaz, el lienzo y los controles. |
| [`demo/language.js`](../demo/language.js) | La opción de ver la interfaz en español o en inglés. |
| [`demo/drawing.js`](../demo/drawing.js) | Entrada de mouse, táctil, lápiz y teclado. |
| [`demo/simulation.js`](../demo/simulation.js) | El trazo de referencia, la entrada perturbada, el filtro causal y las métricas. |
| [`demo/main.js`](../demo/main.js) | La reproducción, el gráfico y la tabla de resultados. |
| [`demo/view.js`](../demo/view.js) | La visualización 3D y los dos ángulos del mecanismo. |
| [`demo/simulation.test.js`](../demo/simulation.test.js) | Las pruebas de causalidad, métricas, repetibilidad y alcance del mecanismo. |

Uso el trazo para sintetizar la entrada y medir el error. El filtro recibe solamente las posiciones de entrada. Aplico cinemática inversa al movimiento seleccionado para mostrarlo en 3D. Todo corre en el navegador. Si WebGL falla, puedo seguir usando el dibujo, el gráfico y la tabla. [Base teórica](BASE_TEORICA.md)
