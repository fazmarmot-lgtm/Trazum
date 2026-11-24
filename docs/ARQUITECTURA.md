# Arquitectura pública

| Archivo | Función |
| --- | --- |
| [`index.html`](../index.html) y [`demo/style.css`](../demo/style.css) | Interfaz y diseño adaptable. |
| [`demo/simulation.js`](../demo/simulation.js) | Genera 121 muestras de un lazo, añade perturbación determinista, interpola hacia el objetivo y calcula error RMS y pico. También resuelve los dos ángulos del mecanismo. |
| [`demo/main.js`](../demo/main.js) | Conecta parámetros, reloj, controles y gráfico Canvas 2D. |
| [`demo/view.js`](../demo/view.js) | Dibuja dos segmentos genéricos articulados y un lápiz virtual en Three.js. Construye la geometría con primitivas. |
| [`demo/simulation.test.js`](../demo/simulation.test.js) | Verifica el modelo matemático con el ejecutor de pruebas de Node.js. |

Cada corrida usa la misma trayectoria objetivo y la misma perturbación para ambos modos. La fuerza de corrección define qué fracción de la desviación se elimina en cada muestra. El punto resultante se convierte en dos ángulos con cinemática inversa plana. La cámara permite ver ese plano en 3D. Si WebGL no está disponible, el gráfico y las métricas siguen funcionando.

Todo se ejecuta en el navegador. Los parámetros se mantienen en memoria durante la sesión. La demo no recibe datos de sensores ni se conecta a dispositivos o a servidores de inferencia.
