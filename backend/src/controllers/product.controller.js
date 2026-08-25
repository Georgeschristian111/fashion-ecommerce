const prisma = require("../config/prisma");
const { AppError } = require("../middlewares/errorHandler");
const { slugify } = require("../utils/slugify");

// GET /api/products
// Query params : category, productType, minPrice, maxPrice, sort, search, featured, page, limit
async function getProducts(req, res) {
  const {
    category,
    productType,
    minPrice,
    maxPrice,
    sort,
    search,
    featured,
    page = 1,
    limit = 12,
  } = req.query;

  const where = { isActive: true };

  if (category) where.category = category;
  if (productType) where.productType = productType;
  if (featured === "true") where.isFeatured = true;

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  if (search) {
    // Recherche simple sur le nom (insensible à la casse)
    where.name = { contains: search };
  }

  const orderBy =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
      ? { price: "desc" }
      : { createdAt: "desc" }; // "newest" par défaut

  const take = Math.min(Number(limit), 50);
  const skip = (Number(page) - 1) * take;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        images: { orderBy: { position: "asc" }, take: 1 }, // juste l'image principale pour la liste
      },
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    success: true,
    results: products,
    pagination: {
      total,
      page: Number(page),
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  });
}

// GET /api/products/:slug
async function getProductBySlug(req, res) {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    include: {
      images: { orderBy: { position: "asc" } },
      variants: true,
    },
  });

  if (!product || !product.isActive) {
    throw new AppError("Produit introuvable.", 404);
  }

  res.json({ success: true, product });
}

// POST /api/products (admin)
async function createProduct(req, res) {
  const {
    name,
    description,
    price,
    category,
    productType,
    isFeatured,
    images = [],
    variants = [],
  } = req.body;

  const baseSlug = slugify(name);
  // Évite les collisions de slug (ex: deux produits nommés pareil)
  const existingCount = await prisma.product.count({
    where: { slug: { startsWith: baseSlug } },
  });
  const slug = existingCount > 0 ? `${baseSlug}-${existingCount + 1}` : baseSlug;

  const totalStock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      category,
      productType,
      isFeatured: Boolean(isFeatured),
      stock: totalStock,
      images: {
        create: images.map((img, i) => ({
          url: img.url,
          altText: img.altText || name,
          position: i,
        })),
      },
      variants: {
        create: variants.map((v) => ({
          size: v.size,
          color: v.color,
          stock: Number(v.stock) || 0,
        })),
      },
    },
    include: { images: true, variants: true },
  });

  res.status(201).json({ success: true, product });
}

// PUT /api/products/:id (admin)
async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, description, price, category, productType, isFeatured, isActive } = req.body;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new AppError("Produit introuvable.", 404);

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(description && { description }),
      ...(price !== undefined && { price }),
      ...(category && { category }),
      ...(productType && { productType }),
      ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
    },
  });

  res.json({ success: true, product });
}

// DELETE /api/products/:id (admin)
// Suppression douce : on désactive plutôt que de supprimer (garde l'historique des commandes intact)
async function deleteProduct(req, res) {
  const { id } = req.params;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new AppError("Produit introuvable.", 404);

  await prisma.product.update({ where: { id }, data: { isActive: false } });

  res.json({ success: true, message: "Produit désactivé avec succès." });
}

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
