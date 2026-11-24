# Cómo construí el simulador público

| Archivo | Qué implementé |
| --- | --- |
| [`index.html`](../index.html) y [`demo/style.css`](../demo/style.css) | La interfaz de dibujo y comparación. |
| [`demo/drawing.js`](../demo/drawing.js) | Entrada de mouse, táctil, lápiz y teclado. |
| [`demo/assistance.js`](../demo/assistance.js) | Letra de ejemplo, lectura angular cuantizada con retardo, estimador causal y dos motores virtuales acotados. |
| [`demo/simulation.js`](../demo/simulation.js) | Remuestreo, cinemática inversa, métricas y experimento avanzado de filtro. |
| [`demo/main.js`](../demo/main.js) | Reproducción, gráficos, resultados y lecturas de cada muestra. |
| [`demo/view.js`](../demo/view.js) | Mano conceptual y mecanismo de dos articulaciones en Three.js. |
| [`demo/assistance.test.js`](../demo/assistance.test.js) y [`demo/simulation.test.js`](../demo/simulation.test.js) | Pruebas de causalidad, límites, precisión y repetibilidad. |

Uso el mismo modelo planar en los cálculos y en el visor. La rama sin asistencia conserva el recorrido. La rama asistida aplica un desplazamiento angular limitado a cada articulación y usa cinemática directa para calcular la punta. La referencia de la L se usa para medir y graficar. El controlador recibe las lecturas del movimiento de entrada. Los gráficos y el 3D leen la misma muestra. [Base teórica](BASE_TEORICA.md)
