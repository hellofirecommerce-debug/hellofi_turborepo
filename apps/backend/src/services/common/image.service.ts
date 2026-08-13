import sharp from "sharp";
import { throwServerError } from "../../lib/utils/error";

interface ResizeOptions {
  width: number;
  height: number;
  quality?: number;
  background?: string; // padding color, e.g. "#ffffff" or "transparent"
}

const compressionOptions = {
  quality: 70,
  format: "webp",
};

const sizes = {
  xs: { width: 150, height: 200 },
  sm: { width: 320, height: 400 },
  md: { width: 640, height: 800 },
  lg: { width: 1024, height: 1280 },
};

interface MultiSizeOutput {
  xs: Buffer; // 100x100
  sm: Buffer; // 300x300
  md: Buffer; // 600x600
  lg: Buffer; // 1200x1200
}

class ImageService {
  async compress(buffer: Buffer, options: ResizeOptions): Promise<Buffer> {
    try {
      return await sharp(buffer)
        .resize(options.width, options.height, {
          fit: "cover",
          position: "center",
        })
        .webp({ quality: options.quality ?? 80 })
        .toBuffer();
    } catch (error) {
      return throwServerError("Image compression failed");
    }
  }

  async compressMultiSize(
    buffer: Buffer,
  ): Promise<{ xs: Buffer; sm: Buffer; md: Buffer; lg: Buffer }> {
    const entries = await Promise.all(
      Object.entries(sizes).map(async ([sizeName, dimensions]) => {
        const resizedBuffer = await sharp(buffer)
          .rotate() // Auto-rotate based on EXIF
          .resize(dimensions.width, dimensions.height, {
            fit: "inside", // preserves the entire image without cropping
            withoutEnlargement: true, // prevents upscaling smaller images
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          })
          .webp({
            quality: compressionOptions.quality,
            effort: 6,
            smartSubsample: true,
          })
          .toBuffer();

        return [sizeName, resizedBuffer] as const;
      }),
    );

    return Object.fromEntries(entries) as {
      xs: Buffer;
      sm: Buffer;
      md: Buffer;
      lg: Buffer;
    };
  }

  async compressToMultipleSizes(
    buffer: Buffer,
    sizes: { key: string; width: number; height: number }[],
  ): Promise<{ key: string; buffer: Buffer }[]> {
    try {
      return await Promise.all(
        sizes.map(async (size) => ({
          key: size.key,
          buffer: await this.compress(buffer, {
            width: size.width,
            height: size.height,
          }),
        })),
      );
    } catch (error) {
      return throwServerError("Image processing failed");
    }
  }
}

export default new ImageService();
