#!/bin/bash

# Un Mundo Nuevo - Slider Image Optimization Script
# This script creates optimized versions of slider images for desktop, tablet, and mobile

echo "=========================================="
echo "  Slider Image Optimization Script"
echo "=========================================="
echo ""

# Check if ImageMagick is available
if command -v magick &> /dev/null; then
    TOOL="magick"
    echo "✓ Using ImageMagick"
elif command -v convert &> /dev/null; then
    TOOL="convert"
    echo "✓ Using ImageMagick (convert)"
else
    echo "✗ ImageMagick not found. Using macOS sips..."
    TOOL="sips"
fi

echo ""

# Define target dimensions
DESKTOP_WIDTH=1920
DESKTOP_HEIGHT=800
TABLET_WIDTH=1280
TABLET_HEIGHT=720
MOBILE_WIDTH=768
MOBILE_HEIGHT=576

# Quality settings
DESKTOP_QUALITY=85
TABLET_QUALITY=80
MOBILE_QUALITY=75

# Function to optimize with ImageMagick
optimize_imagemagick() {
    local source=$1
    local output=$2
    local width=$3
    local height=$4
    local quality=$5

    if [ "$TOOL" = "magick" ]; then
        magick "$source" -resize "${width}x${height}^" -gravity center -extent "${width}x${height}" -quality "$quality" "$output"
    else
        convert "$source" -resize "${width}x${height}^" -gravity center -extent "${width}x${height}" -quality "$quality" "$output"
    fi
}

# Function to optimize with sips (macOS fallback)
optimize_sips() {
    local source=$1
    local output=$2
    local width=$3
    local height=$4

    # Copy source to output first
    cp "$source" "$output"

    # Convert to JPG if PNG
    if [[ "$output" == *.jpg ]]; then
        sips -s format jpeg "$output" --out "$output" &> /dev/null
    fi

    # Resize with crop to fill
    sips -z "$height" "$width" "$output" &> /dev/null
}

# Process function
process_image() {
    local slide_name=$1
    local source_file=$2

    echo "Processing $slide_name (source: $source_file)..."

    if [ ! -f "$source_file" ]; then
        echo "  ⚠️  Warning: $source_file not found, skipping..."
        return
    fi

    # Desktop version
    desktop_output="${slide_name}-desktop.jpg"
    echo "  → Creating desktop version (${DESKTOP_WIDTH}x${DESKTOP_HEIGHT})..."
    if [ "$TOOL" = "sips" ]; then
        optimize_sips "$source_file" "$desktop_output" $DESKTOP_WIDTH $DESKTOP_HEIGHT
    else
        optimize_imagemagick "$source_file" "$desktop_output" $DESKTOP_WIDTH $DESKTOP_HEIGHT $DESKTOP_QUALITY
    fi

    # Tablet version
    tablet_output="${slide_name}-tablet.jpg"
    echo "  → Creating tablet version (${TABLET_WIDTH}x${TABLET_HEIGHT})..."
    if [ "$TOOL" = "sips" ]; then
        optimize_sips "$source_file" "$tablet_output" $TABLET_WIDTH $TABLET_HEIGHT
    else
        optimize_imagemagick "$source_file" "$tablet_output" $TABLET_WIDTH $TABLET_HEIGHT $TABLET_QUALITY
    fi

    # Mobile version
    mobile_output="${slide_name}-mobile.jpg"
    echo "  → Creating mobile version (${MOBILE_WIDTH}x${MOBILE_HEIGHT})..."
    if [ "$TOOL" = "sips" ]; then
        optimize_sips "$source_file" "$mobile_output" $MOBILE_WIDTH $MOBILE_HEIGHT
    else
        optimize_imagemagick "$source_file" "$mobile_output" $MOBILE_WIDTH $MOBILE_HEIGHT $MOBILE_QUALITY
    fi

    echo "  ✓ Complete"
    echo ""
}

# Process each slide
process_image "slide0" "slide-image-min-1.png"
process_image "slide1" "slide-image-min-2.png"
process_image "slide2" "slide-image-min-3.png"
process_image "slide3" "slide-image-min-4.png"
process_image "slide4" "slide-image-min-5.png"
process_image "slide5" "slide5-min.jpg"
process_image "slide6" "slide6-min.jpg"
process_image "slide7" "slide7-min.jpg"

echo "=========================================="
echo "  Optimization Complete!"
echo "=========================================="
echo ""
echo "File size comparison:"
echo ""

# Function to show file sizes
show_sizes() {
    local slide_name=$1
    local source_file=$2

    if [ -f "$source_file" ]; then
        original_size=$(ls -lh "$source_file" | awk '{print $5}')
        desktop_size=$(ls -lh "${slide_name}-desktop.jpg" 2>/dev/null | awk '{print $5}')
        tablet_size=$(ls -lh "${slide_name}-tablet.jpg" 2>/dev/null | awk '{print $5}')
        mobile_size=$(ls -lh "${slide_name}-mobile.jpg" 2>/dev/null | awk '{print $5}')

        echo "$slide_name:"
        echo "  Original: $original_size ($source_file)"
        echo "  Desktop:  $desktop_size"
        echo "  Tablet:   $tablet_size"
        echo "  Mobile:   $mobile_size"
        echo ""
    fi
}

show_sizes "slide0" "slide-image-min-1.png"
show_sizes "slide1" "slide-image-min-2.png"
show_sizes "slide2" "slide-image-min-3.png"
show_sizes "slide3" "slide-image-min-4.png"
show_sizes "slide4" "slide-image-min-5.png"
show_sizes "slide5" "slide5-min.jpg"
show_sizes "slide6" "slide6-min.jpg"
show_sizes "slide7" "slide7-min.jpg"

echo "Next steps:"
echo "1. Review the optimized images"
echo "2. Update index.html to use responsive picture elements"
echo "3. Test the slider on different devices"
echo ""
