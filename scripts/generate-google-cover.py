#!/usr/bin/env python3
"""Google Business cover from panthra_logo_inverted.png — invert colors, add text."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "panthra_logo_inverted.png"
FONT_PATH = Path("/usr/share/fonts/truetype/macos/Inter-Bold.ttf")
OUT_DIR = ROOT / "assets"

BG = (0, 0, 0)


def load_inverted_mark(size: int) -> Image.Image:
    """Just invert the user's logo. Nothing else."""
    src = Image.open(SOURCE).convert("RGB")
    inverted = ImageOps.invert(src)

    # White mark on transparent (black becomes transparent for compositing)
    arr = np.array(inverted, dtype=np.uint8)
    bright = arr.max(axis=2) >= 128
    rgba = np.zeros((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)
    rgba[bright] = (255, 255, 255, 255)

    mark = Image.fromarray(rgba, "RGBA")
    mark.thumbnail((size, size), Image.Resampling.LANCZOS)
    return mark


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

    # Wide black margins so GBP cropping doesn't clip the "A".
    side_margin = int(width * 0.18)
    max_content_w = width - side_margin * 2

    logo_size = int(height * 0.48)
    logo = load_inverted_mark(logo_size)

    font_size = int(height * 0.13)
    font = ImageFont.truetype(str(FONT_PATH), font_size)

    tmp_draw = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    letter_spacing = int(font_size * 0.08)
    text_w = sum(
        tmp_draw.textbbox((0, 0), ch, font=font)[2] - tmp_draw.textbbox((0, 0), ch, font=font)[0]
        for ch in "PANTHRA"
    ) + letter_spacing * 6
    text_h = tmp_draw.textbbox((0, 0), "P", font=font)[3] - tmp_draw.textbbox((0, 0), "P", font=font)[1]

    gap = int(width * 0.025)
    group_w = logo.width + gap + text_w

    # Shrink if still too wide for safe margins.
    if group_w > max_content_w:
        scale = max_content_w / group_w
        new_logo_size = max(1, int(logo_size * scale))
        logo = load_inverted_mark(new_logo_size)
        font_size = max(12, int(font_size * scale))
        font = ImageFont.truetype(str(FONT_PATH), font_size)
        letter_spacing = int(font_size * 0.08)
        text_w = sum(
            tmp_draw.textbbox((0, 0), ch, font=font)[2] - tmp_draw.textbbox((0, 0), ch, font=font)[0]
            for ch in "PANTHRA"
        ) + letter_spacing * 6
        text_h = tmp_draw.textbbox((0, 0), "P", font=font)[3] - tmp_draw.textbbox((0, 0), "P", font=font)[1]
        gap = int(gap * scale)
        group_w = logo.width + gap + text_w

    start_x = (width - group_w) // 2
    logo_x = start_x
    logo_y = (height - logo.height) // 2
    text_x = logo_x + logo.width + gap
    text_y = (height - text_h) // 2 - int(font_size * 0.08)

    overlay.alpha_composite(logo, (logo_x, logo_y))
    draw = ImageDraw.Draw(overlay)
    draw_brand_text(draw, text_x, text_y, font)

    return Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # Square version: just the inverted logo
    ImageOps.invert(Image.open(SOURCE).convert("RGB")).save(
        OUT_DIR / "panthra-logo-white.png", "PNG"
    )

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
