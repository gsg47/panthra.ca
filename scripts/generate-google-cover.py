#!/usr/bin/env python3
"""Google Business cover: invert OG panthra_logo.png, solid black eye, PANTHRA text."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
LOGO_PATH = ROOT / "panthra_logo.png"
FONT_PATH = Path("/usr/share/fonts/truetype/macos/Inter-Bold.ttf")
OUT_DIR = ROOT / "assets"

BG = (0, 0, 0)


def solid_eye_mask(eye: np.ndarray) -> Image.Image:
    """Turn the grainy purple eye into one solid filled shape."""
    ys, xs = np.where(eye)
    if len(xs) == 0:
        return Image.new("L", eye.shape[::-1], 0)

    # Aggressive almond from the eye extents (solid, not speckled).
    x0, x1 = int(xs.min()), int(xs.max())
    y0, y1 = int(ys.min()), int(ys.max())
    cx = (x0 + x1) / 2
    cy = (y0 + y1) / 2
    # Match OG: left tip higher, right tip lower (angled slit).
    points = [
        (x0, y0),  # left tip
        (cx, y0 - (y1 - y0) * 0.15),  # top
        (x1, y1 - (y1 - y0) * 0.15),  # right tip
        (cx, y1 + (y1 - y0) * 0.1),  # bottom
    ]

    mask = Image.new("L", (eye.shape[1], eye.shape[0]), 0)
    draw = ImageDraw.Draw(mask)
    draw.polygon(points, fill=255)
    return mask


def invert_og_logo(size: int) -> Image.Image:
    """
    Black OG mark on white → invert → white panther on black.
    Purple grainy eye is replaced with a solid cutout so it stays black.
    """
    logo = Image.open(LOGO_PATH).convert("RGBA")
    arr = np.array(logo, dtype=np.uint8)
    rgb = arr[:, :, :3]
    alpha = arr[:, :, 3]

    visible = alpha > 20
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    eye = visible & (r > 80) & (b > 120) & (g < 80)

    # Body only on transparent (eye hole carved solid).
    cut = np.zeros_like(arr)
    body = visible & ~eye
    cut[body, 0:3] = rgb[body]
    cut[body, 3] = 255

    eye_mask = solid_eye_mask(eye)
    eye_arr = np.array(eye_mask) > 0
    cut[eye_arr, 3] = 0  # solid hole

    white_bg = Image.new("RGBA", logo.size, (255, 255, 255, 255))
    white_bg.alpha_composite(Image.fromarray(cut, "RGBA"))
    inverted = ImageOps.invert(white_bg.convert("RGB"))

    ia = np.array(inverted, dtype=np.uint8)
    # Pure B/W
    bright = ia.max(axis=2) >= 128
    rgba = np.zeros((ia.shape[0], ia.shape[1], 4), dtype=np.uint8)
    rgba[bright] = (255, 255, 255, 255)
    # Black areas (bg + eye + mouth) stay transparent for cover bg

    mark = Image.fromarray(rgba, "RGBA")
    mark.thumbnail((size, size), Image.Resampling.LANCZOS)

    ma = np.array(mark, dtype=np.uint8)
    opaque = ma[:, :, 3] > 200  # strict — drop soft grey edges
    out = np.zeros_like(ma)
    out[opaque] = (255, 255, 255, 255)
    return Image.fromarray(out, "RGBA")


def draw_brand_text(draw: ImageDraw.ImageDraw, x: int, y: int, font: ImageFont.FreeTypeFont) -> None:
    letter_spacing = int(font.size * 0.08)
    cursor_x = x
    for char in "PANTHRA":
        draw.text((cursor_x, y), char, font=font, fill=(255, 255, 255, 255))
        bbox = draw.textbbox((0, 0), char, font=font)
        cursor_x += (bbox[2] - bbox[0]) + letter_spacing


def build_cover(width: int, height: int) -> Image.Image:
    canvas = Image.new("RGB", (width, height), BG)
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))

    logo_size = int(height * 0.72)
    logo = invert_og_logo(logo_size)

    font_size = int(height * 0.19)
    font = ImageFont.truetype(str(FONT_PATH), font_size)

    tmp_draw = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    letter_spacing = int(font_size * 0.08)
    text_w = sum(
        tmp_draw.textbbox((0, 0), ch, font=font)[2] - tmp_draw.textbbox((0, 0), ch, font=font)[0]
        for ch in "PANTHRA"
    ) + letter_spacing * 6
    text_h = tmp_draw.textbbox((0, 0), "P", font=font)[3] - tmp_draw.textbbox((0, 0), "P", font=font)[1]

    gap = int(width * 0.02)
    group_w = logo.width + gap + text_w
    start_x = (width - group_w) // 2
    logo_x = start_x
    logo_y = (height - logo.height) // 2
    text_x = logo_x + logo.width + gap
    text_y = (height - text_h) // 2 - int(font_size * 0.08)

    overlay.alpha_composite(logo, (logo_x, logo_y))
    draw = ImageDraw.Draw(overlay)
    draw_brand_text(draw, text_x, text_y, font)

    result = Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")
    ra = np.array(result, dtype=np.uint8)
    bright = ra.max(axis=2) >= 128
    ra[bright] = (255, 255, 255)
    ra[~bright] = (0, 0, 0)
    return Image.fromarray(ra, "RGB")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    square = Image.new("RGB", (1024, 1024), BG)
    mark = invert_og_logo(900)
    sx = (1024 - mark.width) // 2
    sy = (1024 - mark.height) // 2
    layer = Image.new("RGBA", (1024, 1024), (0, 0, 0, 255))
    layer.alpha_composite(mark, (sx, sy))
    layer.convert("RGB").save(OUT_DIR / "panthra-logo-white.png", "PNG")

    for filename, size in {
        "google-business-cover-1920x1080.png": (1920, 1080),
        "google-business-cover-1024x576.png": (1024, 576),
    }.items():
        build_cover(*size).save(OUT_DIR / filename, "PNG")

    print("Created:")
    print(f"  {OUT_DIR / 'panthra-logo-white.png'}")
    print(f"  {OUT_DIR / 'google-business-cover-1920x1080.png'}")
    print(f"  {OUT_DIR / 'google-business-cover-1024x576.png'}")


if __name__ == "__main__":
    main()
