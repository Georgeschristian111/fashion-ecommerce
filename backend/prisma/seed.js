// Peuple la base avec des données de test reprenant les produits de vos maquettes.
// Lancer avec : npm run prisma:seed
const { PrismaClient } = require("@prisma/client");
const { slugify } = require("../src/utils/slugify");

const prisma = new PrismaClient();

const products = [
  { 
    name: "Classic Jean Jacket", 
    price: 40.0, 
    category: "WOMEN", 
    productType: "JACKETS", 
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop"
  },
  { 
    name: "Modern Stock Jeans", 
    price: 59.99, 
    category: "MEN", 
    productType: "JEANS",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop"
  },
  { 
    name: "Shirts for Children", 
    price: 17.99, 
    category: "CHILDREN", 
    productType: "SHIRTS", 
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&auto=format&fit=crop"
  },
  { 
    name: "Mens T-shirt", 
    price: 15.99, 
    category: "MEN", 
    productType: "T_SHIRTS",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop"
  },
  { 
    name: "Classic Hoodie", 
    price: 44.49, 
    category: "MEN", 
    productType: "HOODIES", 
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop"
  },
  { 
    name: "Womens Shirt", 
    price: 12.99, 
    category: "WOMEN", 
    productType: "SHIRTS", 
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&auto=format&fit=crop"
  },
  { 
    name: "Mens Shirt", 
    price: 11.99, 
    category: "MEN", 
    productType: "SHIRTS", 
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop"
  },
  { 
    name: "Sleek Trousers", 
    price: 10.0, 
    category: "MEN", 
    productType: "TROUSERS",
    imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop"
  },
  { 
    name: "Classic Jean Jacket - Blue", 
    price: 39.99, 
    category: "WOMEN", 
    productType: "JACKETS", 
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop"
  },
  { 
    name: "Classic Men Jacket", 
    price: 45.99, 
    category: "MEN", 
    productType: "JACKETS",
    imageUrl: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=600&auto=format&fit=crop"
  },
];

const SIZES = ["XS", "S", "M", "L", "XL"];
const COLORS = ["Black", "White", "Gray", "Blue", "Red"];

async function main() {
  console.log(" Supprimant les anciennes données...");
  await prisma.orderItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();

  console.log(" Création des produits...");
  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: slugify(p.name),
        description: `${p.name} - matière premium, coupe confortable, idéal pour toutes les occasions.`,
        price: p.price,
        category: p.category,
        productType: p.productType,
        isFeatured: p.isFeatured || false,
        stock: 100,
        images: {
          create: [{ url: p.imageUrl, position: 0 }],
        },
        variants: {
          create: SIZES.slice(0, 3).flatMap((size) =>
            COLORS.slice(0, 2).map((color) => ({ size, color, stock: 15 }))
          ),
        },
      },
    });
  }

  console.log(` ${products.length} produits créés avec succès.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });