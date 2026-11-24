# Cómo pruebo el filtro de movimiento

## Pregunta

Quiero saber cuándo un filtro que solo recibe muestras de posición puede reducir las oscilaciones del lápiz y cuándo el retraso que introduce empeora el seguimiento. Trabajo con posiciones virtuales en 2D. Los sensores, las fuerzas, los motores y la respuesta de una persona quedan fuera de este experimento.

## 1. Trazo y medición simulada

Uso un lazo de ejemplo o un trazo que dibujo. En el trazo libre reparto **121 puntos por distancia recorrida** y los reproduzco en **4 segundos**. Entre muestras transcurren 1/30 s. La velocidad con la que dibujé en el lienzo no se conserva.

Llamo `r[k]` al punto objetivo en la muestra `k`. Para fabricar una entrada reproducible le sumo dos oscilaciones:

```text
φ[k] = 2πk/120
n[k] = (A·sin(7φ[k]), 0,75A·sin(11φ[k] + 0,4))
z[k] = r[k] + n[k]
```

`A` es la amplitud en unidades virtuales. Las oscilaciones tienen 7 y 11 ciclos en 4 s, equivalentes a 1,75 y 2,75 Hz. Elegí estas señales para poder repetir el mismo ensayo. Todavía no medí si representan el ruido de un sensor real o el movimiento de una persona.

## 2. Qué sabe el filtro

Comparo la entrada `z[k]` con un promedio exponencial aplicado por separado a cada coordenada. Inicio con la primera muestra y luego mezclo la medición actual con el estado anterior.

```text
s[0] = z[0]
s[k] = α·z[k] + (1 − α)·s[k−1]
```

Los únicos datos del filtro son `z[0]…z[k]` y el peso `α`. El evaluador sí guarda `r[k]` para medir el error. Con `α = 1` la salida reproduce la entrada. Un `α` menor le da más peso al pasado. Eso puede atenuar las oscilaciones, pero también atrasar el lápiz cuando cambia el movimiento. Uso la ecuación de suavizado para estimar la posición actual. [NIST/SEMATECH, suavizado exponencial simple](https://www.itl.nist.gov/div898/handbook/pmc/section4/pmc431.htm)

## 3. Cómo lo mido

En cada instante calculo la distancia euclidiana entre la posición y el objetivo. El **RMS** es la raíz del promedio de esas distancias al cuadrado. El **máximo** es la peor distancia puntual. Comparo las muestras en el mismo instante. Así el atraso cuenta como error.

| Trazo de ejemplo, α = 0,35 | RMS entrada | RMS filtrada | Máximo entrada | Máximo filtrado |
| --- | ---: | ---: | ---: | ---: |
| Amplitud 0,20 | 0,176 | 0,144 | 0,250 | 0,239 |
| Amplitud 0 | 0,000 | 0,068 | 0,000 | 0,082 |

Con perturbación, el RMS baja aproximadamente un **18 %** en este caso. Al quitarla, la entrada ya coincide con el objetivo y el filtrado añade error. Probar otro dibujo puede cambiar el resultado: los giros y la velocidad del recorrido cambian cuánto pesa el atraso.

## 4. Qué representa el 3D

Con cinemática inversa convierto cada punto en dos ángulos de un mecanismo genérico. El brazo dibujado me permite ver el recorrido. Las métricas se calculan con las posiciones del simulador, antes de la visualización 3D.

## 5. Qué probaría después

Primero mediría el ruido, la frecuencia efectiva y el retraso del sensor en banco. Grabaría movimientos con una referencia independiente y compararía distintos pesos con los mismos datos. También mediría el error en giros y el atraso, además del RMS. Para afirmar que Trazum predice intención necesitaría una señal de intención definida y una prueba separada con datos reales.
