import faker from "faker";

export interface ShopifyProduct {
  createdAt: string; // DateTime
  description: string; // Stripped description of the product
  featuredImage: string; // not sure what the datamodel for this is,  TODO: String for now
  handle: string; // human friendly string
  id: string; // (PK) - Globally unique identifier
  metafield: string[]; // TODO should be a union type of String or Number, but typing is weird
  title: string; // title of the product
}

type PrivateMetafieldValueType = String | Number;

export interface Metafield {
  id: string; // (ID!)The id of the private metafield.
  key: string; // (String!)The key name for a private metafield.
  namespace: string; // (String!)The namespace for a private metafield.
  value: string; // (String!)The value of a private metafield.
  valueType: PrivateMetafieldValueType; // (PrivateMetafieldValueType!)Represents the private metafield value type.
}

export interface PrivateMetafield extends Metafield {}

export const generateShopifyMockProducts = (numProducts: number) => {
  const mockProducts: ShopifyProduct[] = [];
  for (let i = 0; i < numProducts; i++) {
    mockProducts.push({
      title: faker.lorem.sentence(12),
      createdAt: faker.date.past(0.2).toDateString(),
      description: faker.lorem.sentence(12),
      featuredImage: faker.image.image(),
      handle: faker.lorem.sentence(12),
      id: faker.random.uuid(),
      metafield: [faker.random.word()]
    });
  }
  return mockProducts;
};
