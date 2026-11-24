# Cómo muestro Trazum

1. Abro el [simulador](README.md#ejecutarlo-en-tu-equipo) y elijo **Probar la letra L**. A la izquierda veo el mismo movimiento sin asistencia, y a la derecha, con motores virtuales. La L punteada sirve para medir el error de este ejemplo.
2. Muestro el RMS, que pasa de **0,045 a 0,034**, y el máximo, que pasa de **0,072 a 0,050** unidades virtuales en esta simulación. La letra conserva parte de las irregularidades.
3. En **Sensores y motores · modelo virtual** se ven las lecturas de ángulo y cuánto corrigió cada motor en el punto de la reproducción. Bajo el nivel de asistencia a cero si quiero comprobar que las dos trayectorias coinciden.
4. Entro en **Ver en 3D**. El lápiz de la mano conceptual sigue la trayectoria calculada. También puedo volver y dibujar mi propia letra de un solo trazo. Para un dibujo propio, los números muestran cuánto se movió el recorrido, porque no tengo una letra ideal con la cual compararlo.

## Experimento avanzado

En **Modo avanzado** conservo otro ensayo reproducible. Comparo una señal con perturbación lateral con la salida de un filtro exponencial. Ahí puedo ajustar la perturbación y el peso de la muestra. [Base teórica](docs/BASE_TEORICA.md)

## Prototipo y video

Imprimí y moví un índice a mano en mesa. La prueba de la L usa sensores y motores virtuales. Me falta medir el comportamiento de los componentes reales. [Galería](media/README.md) · [Cronología](docs/DESARROLLO.md)

Voy a sumar el enlace cuando termine el video. [Reglas de STEM2Connect](https://stem2connect-online-hackathon.devpost.com/rules)
