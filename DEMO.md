# Cómo muestro Trazum

## Modo demostración

1. En **Iniciar demostración**, elijo si quiero una recta o una curva más suave, dibujo un trazo continuo y pulso **Aplicar ayuda**. Puedo usar el trazo de ejemplo desde ahí o con **Probar el ejemplo** en la portada. Con teclado, uso las flechas y Espacio para marcar puntos.
2. En **Comparar**, muestro la entrada en naranja y la salida filtrada en azul. Ambas se animan con el mismo reloj y la misma escala. Al elegir recta, comparo el dibujo con el segmento entre su inicio y su final. Al suavizar una curva, mido cuánto cambió el dibujo. Los valores se calculan sobre 121 muestras en unidades virtuales.
3. Elijo **Ver en 3D**. La punta del lápiz sigue la trayectoria seleccionada original o asistida. La mano es conceptual. El reloj de reproducción sigue siendo el mismo. Puedo pausar, moverme a un momento del trazo o volver a la comparación.

La ayuda actúa sobre el dibujo terminado. En la opción recta, el error después de asistir es cero por construcción porque la salida sigue el segmento elegido. [Base teórica](docs/BASE_TEORICA.md)

## Modo avanzado

Abro **Modo avanzado** para conservar el lienzo, la comparación superpuesta, la visualización del mecanismo de dos articulaciones, la cámara y los ajustes de perturbación y peso de filtrado. Con el lazo de ejemplo obtuve un RMS de **0,114 a 0,104**. Como control, bajo la perturbación a cero. Con α = 35 %, el filtro introduce atraso y el RMS pasa de **0,000 a 0,068**. Al llevar α a 100 %, la salida reproduce la entrada.

## Qué muestro del prototipo físico

Imprimí y probé un índice sobre una mesa. Puedo mostrar cómo se flexiona a mano y explicar qué me falta medir. [Galería del índice](media/README.md) · [Qué comprobé en CAD y en mesa](docs/DESARROLLO.md)

## Video

Para una toma de 16:9 puedo mostrar primero **Probar el ejemplo**, seguir con el 3D y después dibujar un trazo propio desde **Reiniciar demo**. En **English** puedo cambiar el idioma de la interfaz. Voy a sumar el enlace cuando termine de grabarlo. [Reglas de STEM2Connect](https://stem2connect-online-hackathon.devpost.com/rules)
