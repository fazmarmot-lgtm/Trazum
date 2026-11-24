# Cómo comparo la ayuda sobre un trazo y pruebo el filtro

## Prueba de asistencia sobre una letra

Uso una L de un solo trazo. En el ejemplo conozco la referencia porque generé una L irregular a partir de ella. Si uso un dibujo propio, reporto la diferencia entre el recorrido original y el asistido. Procesar una letra después de dibujarla todavía es una prueba de software. El cálculo por muestra es causal.

Con dos articulaciones planas convierto la posición sin asistencia en dos ángulos. Simulo dos sensores absolutos que entregan lecturas cuantizadas a 12 bits. Leo una muestra anterior, a 30 Hz, para representar unos 33 ms de retardo. Los sensores de ángulo comerciales pueden entregar lecturas cuantizadas, como en el AS5600. La resolución es una referencia. La frecuencia y el retardo son supuestos del simulador. [Ficha técnica del AS5600](https://prod-parts-data.s3.amazonaws.com/AS5600-ASOT/datasheet/1_AS5600-ASOT-Osram-datasheet-116051199.pdf)

En cada eje estimo una tendencia a partir de la lectura actual y el estado anterior, con una constante de 70 ms. Uso la diferencia entre la estimación y la lectura como comando de corrección. Acoto el comando a 0,06 rad por eje. El desplazamiento del motor se acerca a ese comando con una respuesta de primer orden de 45 ms y una velocidad máxima de 0,7 rad/s. Sumo ese desplazamiento al ángulo del movimiento de entrada y calculo la punta con cinemática directa. Uso el primer orden como aproximación de la respuesta del conjunto motor-controlador. El modelo trata movimiento voluntario y asistencia como señales aditivas. [Respuesta temporal de un motor DC, University of Michigan](https://ctms.engin.umich.edu/CTMS/index.php?aux=Activities_DCmotorA)

| L simulada | Error RMS | Error máximo |
| --- | ---: | ---: |
| Sin asistencia | 0,045 | 0,072 |
| Con asistencia | 0,034 | 0,050 |

Los valores se calculan en unidades virtuales en las mismas muestras. El controlador usa las lecturas angulares del movimiento sin asistencia. La referencia de la L queda para calcular el error. En este escenario el modelo reduce parte de la irregularidad. En otros trazos el retardo puede cambiar cuánto ayuda o empeorar un giro. Todavía me falta identificar la latencia, el rango y la respuesta reales, y medir fricción, carga, holgura y acoplamiento con la mano.

## Pregunta del experimento avanzado

Quiero saber cuándo un filtro que solo recibe muestras de posición puede reducir las oscilaciones del lápiz y cuándo el retraso que introduce empeora el seguimiento. Trabajo con posiciones virtuales en 2D. Los sensores, las fuerzas, los motores y la respuesta de una persona quedan fuera de este experimento.

## 1. Trazo y medición simulada

Uso un lazo de ejemplo o un trazo que dibujo. En el trazo libre reparto **121 puntos por distancia recorrida** y los reproduzco en **4 segundos**. Entre muestras transcurren 1/30 s. La velocidad con la que dibujé en el lienzo no se conserva.

Llamo `r[k]` al punto objetivo en la muestra `k`. Para generar la entrada, estimo la dirección local a partir de los puntos vecinos y agrego una oscilación perpendicular a ella.

```text
D = √((xmax − xmin)² + (ymax − ymin)²)
φ[k] = 2π·9k/120
z[k] = r[k] + A·D·sin(φ[k])·n[k]
```

`n[k]` es el vector unitario perpendicular a la dirección local. Si no puedo definir una dirección local, dejo esa muestra sin desvío. `A` es el porcentaje de la diagonal `D` expresado como proporción. Con el valor inicial de 8 %, el desvío máximo es el 8 % de esa diagonal. Así, un trazo más chico recibe una perturbación más chica. En una recta, la perturbación solo mueve la punta hacia los lados. La señal tiene 9 ciclos en 4 segundos (2,25 Hz). Uso esta señal reproducible como ejemplo. Todavía no medí si representa el ruido de un sensor real o el movimiento de una persona.

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
| Perturbación lateral 8 % | 0,114 | 0,104 | 0,162 | 0,141 |
| Perturbación lateral 0 % | 0,000 | 0,068 | 0,000 | 0,082 |

Con perturbación, el RMS baja aproximadamente un **9 %** en este caso. Al quitarla, la entrada ya coincide con el objetivo y el filtrado añade error. Probar otro dibujo puede cambiar el resultado: los giros y la velocidad del recorrido cambian cuánto pesa el atraso.

## 4. Qué representa el 3D

Con cinemática inversa convierto cada punto en dos ángulos de un mecanismo genérico. En el modo avanzado muestro el mecanismo de dos articulaciones. En la demostración, la mano conceptual se traslada con ese mecanismo y la punta del lápiz virtual sigue la muestra seleccionada. No simulo una postura biomecánica. Las métricas se calculan con las posiciones del simulador, antes de la visualización 3D.

## 5. Qué probaría después

Primero mediría el ruido, la frecuencia efectiva y el retraso del sensor en banco. Grabaría movimientos con una referencia independiente y compararía distintos pesos con los mismos datos. También mediría el error en giros y el atraso, además del RMS. Para afirmar que Trazum predice intención necesitaría una señal de intención definida y una prueba separada con datos reales.
