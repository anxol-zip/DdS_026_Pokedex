# DdS_026_Pokedex

Pokédex en React + Vite que consume la [PokéAPI](https://pokeapi.co/). Proyecto de clase de
**Diseño de Software** · Otoño 2026 · Angel Rugerio Jiménez (201720).

## Qué hace

- Muestra un Pokémon a la vez (imagen oficial, número, nombre, tipos, altura y peso), empezando en Mewtwo (#150).
- Navega al anterior / siguiente con botones, dentro del rango #1–#1025.
- Muestra un vistazo del Pokémon vecino a cada lado.

## Stack

| Componente | Tecnología |
| ---------- | ---------- |
| UI | React 19, Vite 8 |
| Datos | PokéAPI (`fetch`) |
| Persistencia | Firebase — conexión inicializada, todavía sin uso |

## Correr el proyecto

```bash
npm install
cp .env.example .env   # llenar con las credenciales del proyecto de Firebase
npm run dev
```

## Estado

En desarrollo (branch `develop`). La integración con Firestore apenas empezó: `src/firebase.js`
inicializa la app, pero aún no se lee ni escribe nada.
