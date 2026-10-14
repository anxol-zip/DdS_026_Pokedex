# DdS_026_Pokedex

Pokédex en React + Vite que consume la [PokéAPI](https://pokeapi.co/). Proyecto de clase de
**Diseño de Software** · Otoño 2026 · Angel Rugerio Jiménez (201720).

## Qué hace

- Muestra una cuadrícula de 25 Pokémon por página (imagen oficial, número, nombre, tipos, altura y
  peso), paginada con `limit`/`offset` dentro del rango #1–#1025.
- Busca un Pokémon por su nombre exacto (todavía no por id ni por parte del nombre).
- Arma un equipo de hasta 6 Pokémon sin repetir: botón "Agregar" en cada tarjeta y "Eliminar" en
  las del equipo. Los que ya están en el equipo se marcan con borde verde.
- Guarda el equipo en Firestore (colección `team`, un documento por id) y lo recupera al abrir la app.

## Stack

| Componente   | Tecnología                                            |
| ------------ | ----------------------------------------------------- |
| UI           | React 19, Vite 8                                      |
| Datos        | PokéAPI (`fetch`)                                     |
| Persistencia | Firebase Firestore (`setDoc`, `deleteDoc`, `getDocs`) |

## Correr el proyecto

```bash
npm install
cp .env.example .env   # llenar con las credenciales del proyecto de Firebase
npm run dev
```

## Estado

En desarrollo (branch `develop`). El equipo sale en el orden de los documentos de Firestore, no en
el orden en que se agregaron.
