# Cómo construí el simulador público

Uso JavaScript para conectar el dibujo, el gráfico Canvas 2D y el visor Three.js. En el modo avanzado uso dos articulaciones y un lápiz virtual. En el modo demostración muestro una mano conceptual y un lápiz con formas geométricas simples.

| Archivo | Qué implementé |
| --- | --- |
| [`index.html`](../index.html) y [`demo/style.css`](../demo/style.css) | La interfaz, el lienzo y los controles. |
| [`demo/language.js`](../demo/language.js) | La opción de ver la interfaz en español o en inglés. |
| [`demo/drawing.js`](../demo/drawing.js) | Entrada de mouse, táctil, lápiz y teclado. |
| [`demo/assistance.js`](../demo/assistance.js) | Construye una recta entre extremos o suaviza el trazo dibujado. |
| [`demo/simulation.js`](../demo/simulation.js) | El trazo de referencia, la entrada perturbada, el filtro causal y las métricas. |
| [`demo/main.js`](../demo/main.js) | La reproducción, el gráfico y la tabla de resultados. |
| [`demo/view.js`](../demo/view.js) | La visualización 3D y los dos ángulos del mecanismo. |
| [`demo/simulation.test.js`](../demo/simulation.test.js) | Las pruebas de causalidad, métricas, repetibilidad y alcance del mecanismo. |

En la demostración uso el dibujo sin agregarle perturbación. En el modo avanzado uso el trazo para sintetizar la entrada y medir el error. El filtro recibe solamente las posiciones de entrada. Los gráficos y el 3D comparten un índice de muestra. Aplico cinemática inversa al movimiento seleccionado para situar la punta del lápiz en 3D. Todo corre en el navegador. Si WebGL falla, puedo seguir usando el dibujo, el gráfico y la tabla. [Base teórica](BASE_TEORICA.md)
