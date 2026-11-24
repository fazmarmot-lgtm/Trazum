# Cómo fui desarrollando Trazum

| Cuándo | Qué hice |
| --- | --- |
| Al inicio, fecha sin registrar | Volví de visita al Dámaso Centeno y me quedé pensando en las dificultades que me contaron. Empecé a trabajar en una idea ese mismo día. No tengo registrada la fecha exacta de la visita. |
| 29 de octubre de 2026 | Registré una primera versión del simulador de investigación, con movimiento sintético y visualización 3D de escritura. Es el primer registro de desarrollo que pude fechar. |
| 5 de noviembre de 2026 | Escribí a mi antiguo colegio para contarles la idea y ofrecerme a mostrar el prototipo. |
| 11 de noviembre de 2026 | Ya tenía un candidato digital del índice R8 con encastres y guía para el carro. En esa etapa revisé trayectorias y posturas del modelo. |
| Noviembre de 2026 | Imprimí un índice de seis piezas, lo armé y moví a mano sus tres articulaciones. En una de las pruebas noté algo de juego en un encastre. |
| Noviembre de 2026 | Preparé el simulador público independiente. Empecé con un lazo de ejemplo y después agregué la opción de dibujar un trazo propio y un filtro que usa las muestras de posición. |

El programa STEM2Connect empezó el 11 de octubre. El primer registro fechado que tengo es posterior. La fecha exacta en que surgió la idea queda abierta. [Ficha para Devpost](../PITCH.md#stem2connect-y-devpost)

## Qué comprobé

En la prueba física observé cómo se armaba y se movía un índice impreso. Todavía no medí fuerzas ni repetí una serie instrumentada.

Los informes digitales del índice y de la mano compacta registran 192 y 45 posturas, respectivamente, con cero interferencias en las muestras examinadas. Verifiqué que los hashes de los informes coinciden con los STL de las dos revisiones.

En el lazo de ejemplo con perturbación lateral del 8 % y peso 0,35, obtuve un RMS de 0,114 en la entrada y 0,104 en la salida filtrada. Con perturbación cero, el RMS pasó de 0,000 a 0,068. Uso ambos casos para estudiar el compromiso entre suavizar y seguir el trazo a tiempo. [Base teórica](BASE_TEORICA.md)

## Qué sigue

Primero quiero medir fuerza y recorrido en mesa y ver cuánto juego aparece después de varios ciclos. Después quiero probar la mano completa y la electrónica en banco. También quiero seguir conversando con el colegio para entender qué dificultades priorizar y acordar el protocolo antes de probar un dispositivo sobre una persona.
