
import matplotlib.pyplot as plt
from PIL import Image
import numpy as np

# Load the .tif image
img_path = "./annodataset/test/images/tile_107.tif"  # replace with your file
input_image = Image.open(img_path)

# Convert to numpy array
img_array = np.array(input_image)

# If RGB, convert to grayscale for heatmap
if len(img_array.shape) == 3:
    img_gray = img_array.mean(axis=2)
else:
    img_gray = img_array

# Plot original and heatmap
plt.figure(figsize=(12, 6))

# Original image
plt.subplot(1, 2, 1)
plt.imshow(input_image)
plt.title("Original Image")
plt.axis("off")

# Heatmap
plt.subplot(1, 2, 2)
plt.imshow(img_gray, cmap="jet")
plt.colorbar(label="Intensity")
plt.title("Heatmap")
plt.axis("off")

plt.tight_layout()
plt.show()
