# Charters de exploración

Cada charter es una sesión de testing exploratorio sobre el sitio publicado, hecha por Claude Code con Playwright MCP y dirigida por fmv. Un archivo por sesión: `AAAA-MM-DD-tema.md`.

## Cómo se trabaja

1. fmv elige la misión y el riesgo a explorar.
2. El agente recorre https://fvidau.github.io como un usuario y anota lo que observa, sin tocar el código.
3. fmv revisa cada hallazgo y decide si es un defecto, una mejora o nada.
4. Lo aprobado entra por PR: primero el test, visto en rojo; después el arreglo.

## Formato

```markdown
# Charter: <tema>

- **Misión:** explorar <qué> con <qué recursos> para descubrir <qué información>.
- **Fecha y entorno:** <fecha>, <navegador>, <viewport>.
- **Riesgo:** qué se rompe para quién, si esto falla.

## Notas de la sesión
Qué se hizo y qué se observó, en orden.

## Hallazgos
| # | Observación | Evidencia | Decisión de fmv |
|---|---|---|---|

## Tests propuestos
Qué comportamiento fijar y por qué. Solo entran los que fmv apruebe.

## Fuera de alcance
Lo que se vio pero no se exploró.
```
