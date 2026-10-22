import type { Prisma } from "@prisma/client";

const author = { select: { username: true } } as const;
export const publicCatchFields = {
  id: true, species: true, weight: true, length: true, lureType: true,
  imageUrl: true, locationLat: true, locationLng: true, user: author,
} as const satisfies Prisma.CatchSelect;

export const publicSpotFields = {
  id: true, name: true, speciesSeen: true, imageUrl: true, thumbnailUrl: true,
  locationLat: true, locationLng: true, user: author,
} as const satisfies Prisma.SpotSelect;

export const publicHazardFields = {
  id: true, name: true, note: true, imageUrl: true, thumbnailUrl: true, locationLat: true, locationLng: true, user: author,
} as const satisfies Prisma.HazardSelect;

export const publicShopFields = {
  id: true, name: true, description: true, address: true, website: true, locationLat: true, locationLng: true,
} as const satisfies Prisma.ShopSelect;
