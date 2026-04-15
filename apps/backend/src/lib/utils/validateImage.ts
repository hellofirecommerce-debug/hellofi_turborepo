// lib/utils/validateImage.ts
import { throwInputError } from "./error";

export const validateImage = (
  imageBuffer: Buffer,
  imageFileName: string,
): void => {
  if (!imageBuffer || imageBuffer.length === 0)
    throwInputError("Image is required");
  if (!imageFileName) throwInputError("Image file name is required");
};
