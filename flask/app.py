import matplotlib.pyplot as plt
from PIL import Image
import numpy as np
import matplotlib.patches as patches
from scipy import ndimage

# Use MATLAB-style defaults
plt.style.use('classic')

# Load the .tif image
img_path = "./annodataset/test/images/tile_107.tif"
input_image = Image.open(img_path)

# Convert to numpy array
img_array = np.array(input_image)

# If RGB, convert to grayscale
if len(img_array.shape) == 3:
    img_gray = img_array.mean(axis=2)
else:
    img_gray = img_array

# Normalize to 0-1
img_norm = (img_gray - img_gray.min()) / (img_gray.max() - img_gray.min())

# Define medium-intensity "red" range
# In jet colormap, red is at high values (~0.75-1.0)
medium_red_min = 0.75
medium_red_max = 0.9
mask = (img_norm >= medium_red_min) & (img_norm <= medium_red_max)

# Label connected regions
labeled, num_features = ndimage.label(mask)
slices = ndimage.find_objects(labeled)

# Plot side by side
plt.figure(figsize=(12, 5))

# Original image
plt.subplot(1, 2, 1)
plt.imshow(input_image)
plt.title("Original Image", fontsize=12)
plt.axis("off")

# Heatmap
ax = plt.subplot(1, 2, 2)
im = ax.imshow(img_gray, cmap="jet")
plt.colorbar(im, ax=ax, label="Intensity")
plt.title("Heatmap with Medium-Red Boxes", fontsize=12)
plt.axis("off")

# Draw black boxes around medium-red regions
for sl in slices:
    y, x = sl
    rect = patches.Rectangle(
        (x.start, y.start), x.stop - x.start, y.stop - y.start,
        linewidth=2, edgecolor='black', facecolor='none'
    )
    ax.add_patch(rect)

plt.tight_layout()
plt.show()
