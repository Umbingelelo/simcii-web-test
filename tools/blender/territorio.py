"""SIMCII · territorio en columnas (marca Dirección B «Testigo»).

Un mapa de un territorio de ejemplo hecho de columnas, como un gráfico de
barras: cada celda del terreno es una columna cuya altura es la elevación
(escalonada en capas). Sobre el terreno van los datos que SIMCII lee:

  - cinco estaciones (E-01 … E-09): barras finas cuya altura sobre el terreno
    es el score de la estación (0–100); E-03 va en lapislázuli claro porque
    está sobre el umbral de MP10,
  - Localidad Norte, con los reclamos de la semana como marcas naranjas,
  - el camino y el estero.

Nombres y valores siguen las pantallas de ejemplo de la marca
(01-marca/ejemplos-plataforma/pantallas/territorio_*.png). Datos de ejemplo.

Uso:
  blender -b -P tools/blender/territorio.py -- <dir_salida> [--render]

Salida:
  territorio.glb   columnas como mallas enlazadas (una malla por material),
                   listas para `gltf-transform instance` (EXT_mesh_gpu_instancing)
  territorio.json  anclas de rótulos en coordenadas three (Y arriba)
  territorio.png   (con --render) vista del hero, fondo transparente
"""
import json
import math
import os
import random
import sys

import bpy
from mathutils import Vector

ARGS = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = os.path.abspath(ARGS[0] if ARGS else "out")
RENDER = "--render" in ARGS
os.makedirs(OUT, exist_ok=True)

# ---- Grilla ----
NX, NY = 72, 50
CELL = 0.1
FOOT = CELL * 0.86            # huella de la columna; el resto es junta
X0, Y0 = -NX * CELL / 2, -NY * CELL / 2
STEP = 0.05                   # escalón de las capas
rnd = random.Random(7)

# ---- Elementos del territorio (coordenadas de mapa, y hacia el norte) ----
LOCALIDAD = [(-0.95, 0.15), (-0.35, 0.95), (0.35, 0.75), (0.45, -0.05), (-0.35, -0.45)]
ESTACIONES = [  # id, x, y, score, sobre umbral, tipo, lectura, detalle
    ("E-01", -0.9, 1.6, 82, False, "Meteorología", "Viento 14 km/h del este", "Transmite cada 5 minutos"),
    ("E-03", -0.15, 0.25, 54, True, "Calidad del aire", "MP10 142 µg/m³ · umbral 130", "Sobre el umbral desde las 08:00"),
    ("E-05", -1.6, -1.3, 76, False, "Agua del estero", "pH 7,4 · turbiedad 12 NTU", "Dentro de la norma"),
    ("E-07", 0.6, -1.25, 71, False, "Ruido", "52 dB(A) · límite nocturno 55", "Cerca del límite de noche"),
    ("E-09", 1.55, 0.7, 88, False, "Calidad del aire", "MP10 64 µg/m³ · umbral 130", "Dentro de la norma"),
]
RECLAMOS = 14
FAENA = (2.15, -0.75)      # centro del rajo
RAJO_R = 0.62
PLANTA = [(1.55, -1.6, 0.24, 0.42), (1.8, -1.6, 0.24, 0.32), (1.55, -1.85, 0.24, 0.26), (1.83, -1.87, 0.2, 0.58)]  # x, y, lado, alto
INTERNO = ((1.3, -1.4), (1.72, 0.85))  # camino interno de la faena hasta el camino principal
C14 = (1.38, -0.55)        # compromiso C-14 sobre el camino interno


def camino(t):
    """Camino de SO a NE (t en 0..1)."""
    return Vector((-3.6 + 7.2 * t, -2.4 + 4.6 * t + 0.35 * math.sin(t * 5.0), 0))


def estero_x(y):
    return -2.25 + 0.35 * math.sin(y * 1.3 + 0.6)


def elevacion(x, y):
    """Cordón montañoso al norte (fondo de la vista), lomas al este y un cerro al oeste."""
    cordon = math.exp(-((y - 2.3) ** 2) / 0.55) * (0.9 + 0.12 * math.sin(x * 1.1 + 0.5))
    lomas = 0.45 * math.exp(-((x - 3.1) ** 2) / 0.8) * math.exp(-((y - 0.6) ** 2) / 3.0)
    cerro = 0.3 * math.exp(-((x + 2.9) ** 2 + (y + 1.6) ** 2) / 0.7)
    ondula = 0.025 * math.sin(x * 2.3 + y * 1.1) * math.cos(y * 2.9 - x * 0.7)
    h = 0.1 + cordon * 1.25 + lomas + cerro + ondula
    return max(0.06, h)


def dentro(poly, x, y):
    c = False
    for (x1, y1), (x2, y2) in zip(poly, poly[1:] + poly[:1]):
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            c = not c
    return c


def dist_camino(x, y):
    p = Vector((x, y, 0))
    return min((camino(i / 200) - p).length for i in range(201))


def srgb(hexstr):
    h = hexstr.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(h[i:i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, 1.0)


bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


def material(name, hexstr, rough=0.85):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = srgb(hexstr)
    b.inputs["Roughness"].default_value = rough
    return m


# rampa de terreno: de basalto a andesita, siempre bajo el contraste de los datos
RAMPA = ["#2E3337", "#353B40", "#3E444A", "#495056", "#565D64", "#656C73", "#767D84", "#8A9096"]
MATS = {f"capa{i}": material(f"Terreno {i}", c) for i, c in enumerate(RAMPA)}
MATS.update({
    "estero": material("Estero", "#34506E", rough=0.4),
    "camino": material("Camino", "#A9A69E"),
    "localidad": material("Localidad", "#8A8D88"),
    "estacion": material("Estación", "#ECEAE4", rough=0.6),
    "sobre": material("Estación sobre umbral", "#8FA6E0", rough=0.6),
    "reclamo": material("Reclamo", "#E39A4A", rough=0.6),
    "rajo": material("Rajo", "#50565C"),
    "rajo2": material("Rajo banco", "#42484E"),
    "planta": material("Planta", "#B9B6AE"),
    "compromiso": material("Compromiso", "#B8A046", rough=0.5),
})


def caja(nombre, mat):
    """Cubo unitario con la base en z = 0 (escalar en z = altura)."""
    me = bpy.data.meshes.new(nombre)
    v = [(x, y, z) for z in (0, 1) for y in (-.5, .5) for x in (-.5, .5)]
    f = [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)]
    me.from_pydata(v, [], f)
    me.materials.append(MATS[mat])
    for p in me.polygons:
        p.use_smooth = False
    return me


MALLAS = {k: caja(f"col_{k}", k) for k in MATS}
col = bpy.data.collections.new("Territorio")
scene.collection.children.link(col)


def columna(nombre, mat, x, y, w, h, z0=0.0):
    ob = bpy.data.objects.new(nombre, MALLAS[mat])
    ob.location = (x, y, z0)
    ob.scale = (w, w, h)
    col.objects.link(ob)
    return ob


def dist_segmento(x, y, a, b):
    ax, ay = a; bx, by = b
    t = max(0.0, min(1.0, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2)))
    return math.hypot(x - (ax + t * (bx - ax)), y - (ay + t * (by - ay)))


alturas = {}
for i in range(NX):
    for j in range(NY):
        x, y = X0 + (i + 0.5) * CELL, Y0 + (j + 0.5) * CELL
        h = elevacion(x, y)
        mat = None
        d_rajo = math.hypot(x - FAENA[0], y - FAENA[1])
        if abs(x - estero_x(y)) < 0.13 and y < 1.3:  # nace al pie del cordón
            h, mat = 0.04, "estero"
        elif d_rajo < RAJO_R:  # rajo en bancos: fondo bajo y borde alto
            banco = int(d_rajo / RAJO_R * 5)
            h, mat = 0.08 + 0.11 * banco, ("rajo" if banco % 2 else "rajo2")
        elif dentro(LOCALIDAD, x, y):
            h, mat = 0.16 + rnd.choice([0, 0, 0.05, 0.1]), "localidad"
        elif dist_camino(x, y) < 0.07 or dist_segmento(x, y, *INTERNO) < 0.06:
            mat = "camino"
        h = max(STEP, round(h / STEP) * STEP)
        if mat is None:
            mat = f"capa{min(len(RAMPA) - 1, int(h / 0.16))}"
        alturas[(i, j)] = h
        columna(f"c{i}_{j}", mat, x, y, FOOT, h)


def altura_en(x, y):
    i = min(NX - 1, max(0, int((x - X0) / CELL)))
    j = min(NY - 1, max(0, int((y - Y0) / CELL)))
    return alturas[(i, j)]


def three(x, y, z):
    """Coordenadas three (Y arriba): Blender (x, y, z) → (x, z, -y)."""
    return [round(x, 3), round(z, 3), round(-y, 3)]


anclas = {"estaciones": [], "elementos": []}
for ident, x, y, score, sobre, tipo, lectura, detalle in ESTACIONES:
    base = altura_en(x, y)
    barra = 0.1 + 0.9 * score / 100
    columna(f"{ident}_barra", "sobre" if sobre else "estacion", x, y, 0.13, barra, base)
    anclas["estaciones"].append({"id": ident, "score": score, "sobre": sobre, "tipo": tipo, "lectura": lectura,
                                 "detalle": detalle, "pos": three(x, y, base + barra + 0.05),
                                 "base": three(x, y, base + 0.01)})

for k, (x, y, lado, alto) in enumerate(PLANTA):
    columna(f"planta{k}", "planta", x, y, lado, alto, altura_en(x, y))
columna("C-14", "compromiso", C14[0], C14[1], 0.09, 0.32, altura_en(*C14))

reclamos = []
while len(reclamos) < RECLAMOS:
    x, y = rnd.uniform(-0.9, 0.45), rnd.uniform(-0.45, 0.95)
    if not dentro(LOCALIDAD, x, y):
        continue
    z = altura_en(x, y) + 0.06
    columna(f"reclamo{len(reclamos)}", "reclamo", x, y, 0.055, 0.055, z)
    reclamos.append((x, y, z))
cx = sum(p[0] for p in LOCALIDAD) / len(LOCALIDAD)
cy = sum(p[1] for p in LOCALIDAD) / len(LOCALIDAD)
r214 = reclamos[0]
anclas["elementos"] = [
    {"id": "faena", "nombre": "Faena Norte", "tipo": "Operación", "lectura": "Rajo y planta de procesos",
     "detalle": "3 compromisos RCA activos", "pos": three(FAENA[0] + 0.1, FAENA[1] - 0.35, 0.75)},
    {"id": "localidad", "nombre": "Localidad Norte", "tipo": "Comunidad", "lectura": "4.200 habitantes",
     "detalle": "14 reclamos abiertos, 4 nuevos esta semana", "pos": three(cx - 0.75, cy - 0.7, 0.35)},
    {"id": "r214", "nombre": "Reclamo #214", "tipo": "Comunidad", "lectura": "Polvo en calle Los Aromos",
     "detalle": "5 sep, 08:40 · relacionado con E-03", "pos": three(r214[0], r214[1], r214[2] + 0.12)},
    {"id": "c14", "nombre": "C-14", "tipo": "Compromiso RCA", "lectura": "Humectación de caminos internos",
     "detalle": "En curso · 60 % de avance", "pos": three(C14[0], C14[1], altura_en(*C14) + 0.4)},
]
# polvo: del rajo hacia la localidad, con el viento del este que mide E-01
anclas["polvo"] = {"desde": three(FAENA[0], FAENA[1], 0.35), "hacia": three(cx, cy, 0.3), "radio": RAJO_R}
anclas["extension"] = [NX * CELL, NY * CELL]

with open(os.path.join(OUT, "territorio.json"), "w") as fh:
    json.dump(anclas, fh, ensure_ascii=False, indent=1)

bpy.ops.export_scene.gltf(
    filepath=os.path.join(OUT, "territorio.glb"), export_format="GLB", export_apply=False,
    export_yup=True, export_normals=True, export_texcoords=False, export_materials="EXPORT",
    export_cameras=False, export_lights=False, export_animations=False,
)
print("GLB:", os.path.join(OUT, "territorio.glb"), len(col.objects), "columnas")
if not RENDER:
    sys.exit(0)

# ---- Render de respaldo (Cycles, fondo transparente) ----
scene.render.engine = "CYCLES"
prefs = bpy.context.preferences.addons["cycles"].preferences
try:
    prefs.compute_device_type = "METAL"
    prefs.get_devices()
    for d in prefs.devices:
        d.use = True
    scene.cycles.device = "GPU"
except Exception:
    scene.cycles.device = "CPU"
scene.cycles.samples = 64
scene.cycles.use_denoising = True
scene.render.film_transparent = True
scene.view_settings.view_transform = "Standard"  # conserva los hex de marca
world = bpy.data.worlds.new("Mundo")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = srgb("#3A3F44")
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 1.6
scene.world = world
sol = bpy.data.objects.new("Sol", bpy.data.lights.new("Sol", "SUN"))
sol.data.energy = 4.2
sol.data.angle = math.radians(6)
sol.rotation_euler = (math.radians(48), math.radians(-24), math.radians(-35))
scene.collection.objects.link(sol)
cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam"))
scene.collection.objects.link(cam)
scene.camera = cam
# misma vista que el hero web: three mira a (0, 0.2, 0) desde 1,05 × (6.4, 7.4, 9.4) más la mira; Blender (x, -z, y)
cam.location = (6.4 * 1.05, -9.4 * 1.05, 0.2 + 7.4 * 1.05)
cam.rotation_euler = (Vector((0, 0, 0.2)) - cam.location).to_track_quat("-Z", "Y").to_euler()
cam.data.lens = 50
scene.render.resolution_x, scene.render.resolution_y = 1600, 1100
scene.render.filepath = os.path.join(OUT, "territorio.png")
bpy.ops.render.render(write_still=True)
print("Render listo")
