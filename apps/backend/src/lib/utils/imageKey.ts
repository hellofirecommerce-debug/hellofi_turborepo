import { generateRandomString } from "./generateRandomString";

export const generateImageKey = (folder: string, id: string): string => {
  const random = generateRandomString(8);
  return `${folder}/${id}/hellofi-${random}.webp`;
};
