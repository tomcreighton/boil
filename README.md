# Line Boil

A tiny, zero-dependency JS library that adds a hand-drawn "line boil" animation to any HTML element. It works by injecting SVG displacement filters with varying turbulence seeds and cycling through them on a timer, giving static elements the wobbly, alive quality of traditional animation.

## Usage

Add the script to your page and put `class="boil"` on anything you want to wobble:

```html
<script src="line-boil.js"></script>

<h1 class="boil">Wobbly heading</h1>
```

## Options

Fine-tune per element with data attributes:

```html
<div class="boil" data-boil-scale="6" data-boil-speed="50" data-boil-frames="8">
```

| Attribute | Default | Description |
|---|---|---|
| `data-boil-scale` | `3` | Displacement intensity |
| `data-boil-speed` | `100` | Milliseconds between frames |
| `data-boil-frames` | `4` | Number of animation steps (2–12) |

## Credit

Based on [Simulating Hand-Drawn Motion with SVG Filters](https://camillovisini.com/coding/simulating-hand-drawn-motion-with-svg-filters) by Camillo Visini.
