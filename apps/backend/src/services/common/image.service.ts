import sharp from "sharp";
import { throwServerError } from "../../lib/utils/error";

interface ResizeOptions {
  width: number;
  height: number;
  quality?: number;
}

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
        .resize(options.width, options.height)
        .webp({ quality: options.quality ?? 80 })
        .toBuffer();
    } catch (error) {
      return throwServerError("Image compression failed");
    }
  }

  async compressMultiSize(buffer: Buffer): Promise<MultiSizeOutput> {
    const sizes = [
      { key: "xs", size: 100 },
      { key: "sm", size: 300 },
      { key: "md", size: 600 },
      { key: "lg", size: 1200 },
    ];

    const results = await Promise.all(
      sizes.map(({ size }) =>
        sharp(buffer)
          .resize(size, size, { fit: "cover" })
          .webp({ quality: 80 })
          .toBuffer(),
      ),
    );

    return {
      xs: results[0]!,
      sm: results[1]!,
      md: results[2]!,
      lg: results[3]!,
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
