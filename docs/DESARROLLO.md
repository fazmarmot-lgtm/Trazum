# Desarrollo y resultados

| Etapa | Evidencia disponible |
| --- | --- |
| Investigación y simulación | El registro de desarrollo del 29 de octubre de 2026 documenta un simulador de movimiento y escritura. Era trabajo de investigación. La demo de este repositorio se desarrolló como aplicación independiente. |
| Diseño e impresión del índice | En noviembre de 2026 el desarrollador mostró una foto del índice impreso y reportó que las articulaciones se doblaban a mano. Informó algo de juego en un encastre. No hay registro instrumental ni una tanda de repeticiones supervisadas. |
| Revisión digital | Los informes del índice y de la mano compacta registran 192 y 45 muestras, respectivamente, con cero interferencias en las posturas examinadas. Se compararon los SHA-256 de los informes con los STL de entrada de ambas revisiones, con cero discrepancias. Los informes no constituyen pruebas físicas. |
| Demo pública independiente | Preparada en noviembre de 2026. Incluye un mecanismo genérico, una corrida determinista, dos trayectorias bajo la misma perturbación y métricas sintéticas. |

Con la amplitud inicial de 0,20 unidades virtuales y la corrección al 65 %, el RMS es 0,176 para la trayectoria sin corrección y 0,062 para la corregida. Los picos son 0,250 y 0,087. Las cuatro pruebas automatizadas verifican repetibilidad, casos límite, métricas y alcance del modelo articulado.

## Próximos pasos

1. Registrar fuerza y recorrido en mesa, repetir la prueba y documentar el juego y el desgaste del encastre.
2. Comprobar el armado de la mano completa y probar sensado y actuación primero en un banco de pruebas.
3. Definir un protocolo de seguridad y evaluación antes de ensayar un dispositivo sobre una persona o medir su efecto sobre la escritura.

Para la declaración de trabajo previo y del período del evento, ver [la ficha de Devpost](../PITCH.md#stem2connect-y-devpost).
