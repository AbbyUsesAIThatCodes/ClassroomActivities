"""Render selected classroom geometry as decorative SVGs (Python standard library).

Inputs are externally retained source assets, never whole curriculum archives.
See docs/CLASSROOM_ART.md for pinned repositories, hashes, and exact commands.
"""
import gzip
import json
import math
from pathlib import Path
import struct
import sys

sources, workshop, destination = map(Path, sys.argv[1:4])
destination.mkdir(parents=True, exist_ok=True)

def sub(a, b):
    return tuple(x-y for x, y in zip(a, b))

def dot(a, b):
    return sum(x*y for x, y in zip(a, b))

def cross(a, b):
    return (a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0])

def unit(a):
    length = math.sqrt(dot(a, a))
    return tuple(x/length for x in a) if length else (0, 0, 0)

def svg_mesh(triangles, filename, title, camera, width=900, height=470):
    forward = unit(camera)
    right = unit(cross((0, 1, 0), forward))
    up = cross(forward, right)
    light = unit((-0.6, 1, 1.5))
    projected = []
    for points, color in triangles:
        normal = unit(cross(sub(points[1], points[0]), sub(points[2], points[0])))
        if dot(normal, forward) < 0.001:
            continue
        shade = .67 + .33 * max(0, dot(normal, light))
        rgb = tuple(round(int(color[i:i+2], 16)*shade) for i in (0, 2, 4))
        ink = '#%02x%02x%02x' % rgb
        xy = [(dot(p, right), -dot(p, up)) for p in points]
        projected.append((sum(dot(p, forward) for p in points)/3, xy, ink))
    xs = [p[0] for _, points, _ in projected for p in points]
    ys = [p[1] for _, points, _ in projected for p in points]
    scale = min((width-50)/(max(xs)-min(xs)), (height-50)/(max(ys)-min(ys)))
    cx, cy = (max(xs)+min(xs))/2, (max(ys)+min(ys))/2
    lines = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">', f'<title>{title}</title>']
    for _, points, ink in sorted(projected, key=lambda t:t[0]):
        xy = ' '.join(f'{(x-cx)*scale+width/2:.2f},{(y-cy)*scale+height/2:.2f}' for x, y in points)
        lines.append(f'<polygon points="{xy}" fill="{ink}" stroke="{ink}" stroke-width=".35" stroke-linejoin="round"/>')
    lines.append('</svg>')
    (destination/filename).write_text('\n'.join(lines)+'\n')

vertices, triangles, color = [], [], 'c6c5dd'
for line in (sources/'apparatus.obj').read_text().splitlines():
    bits = line.split()
    if not bits:
        continue
    if bits[0] == 'o':
        name = bits[1]
        color = ('ecc278' if 'gold-crate' in name else 'b58e55' if 'crate-band' in name
                 else '7cc8b5' if any(s in name for s in ['teal-weight', 'weight-rim', 'effort-neck'])
                 else '526478' if 'effort-' in name else 'b29bd5' if 'fulcrum' in name else 'bad0dd')
    elif bits[0] == 'v':
        vertices.append(tuple(map(float, bits[1:4])))
    elif bits[0] == 'f':
        points = [vertices[int(index.split('/')[0])-1] for index in bits[1:]]
        for i in range(1, len(points)-1):
            triangles.append(([points[0], points[i], points[i+1]], color))
svg_mesh(triangles, 'lever-apparatus.svg', 'Original Lever Game Apparatus', (1.4, .8, 3.7))

metadata = json.loads((workshop/'public/assets/parts.json').read_text())
data = gzip.decompress((workshop/'public/assets/parts.bin.gz').read_bytes())
triangles = []
for name, color, offset, angle in [('upright', 'b0c5e7', (-2.2, .2, 0), -.18), ('angle', 'd8b4cf', (2, .4, 0), .2), ('pin', '86cab6', (0, -1.3, 1), .8)]:
    meta = metadata[name]
    coordinates = []
    for i in range(meta['count']):
        x, y, z = struct.unpack_from('<3f', data, meta['offset'] + i*24)
        coordinates.append((x*math.cos(angle)-y*math.sin(angle)+offset[0], x*math.sin(angle)+y*math.cos(angle)+offset[1], z+offset[2]))
    triangles.extend((coordinates[i:i+3], color) for i in range(0, len(coordinates), 3))
svg_mesh(triangles, 'vex-parts.svg', 'Individual VEX IQ Beam, Angle Beam, And Connector Pin', (1, 1.4, 4), height=420)

# Keep the original schematic's instrument geometry; omit review annotations,
# axes and the explicitly unverified depth rod. This is decorative, not a scale.
source = (sources/'caliper-original.svg').read_text()
start = source.index('  <rect x="180"')
end = source.index('  <path d="M657 331')
caliper = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="130 170 910 330">\n<title>Classroom Dial Caliper — Decorative Schematic, Not To Scale</title>\n' + source[start:end] + '</svg>\n'
(destination/'classroom-caliper.svg').write_text(caliper)
for name in ['ees-cog-workshop.svg', 'ees-cog-drafting-table.svg', 'dm-cube-studio.svg']:
    (destination/name).write_bytes((sources/name).read_bytes())
