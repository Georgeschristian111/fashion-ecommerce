# Backend – E-commerce Fashion

## Étape 1 : ce qui est en place
- Structure du projet (routes / controllers / middlewares / config)
- Schéma Prisma complet (`prisma/schema.prisma`) : User, Address, Product, ProductImage,
  ProductVariant (taille+couleur), Cart, CartItem, Order, OrderItem, ContactMessage
- Serveur Express sécurisé : helmet, cors restreint au frontend, rate-limiting,
  limite de taille du body, gestion centralisée des erreurs
- Endpoint de test : `GET /api/health`

## Installation (à faire chez vous, en local)
```bash
cd backend
npm install
cp .env.example .env   # puis remplir DATABASE_URL, JWT_SECRET, clés Stripe...
npx prisma migrate dev --name init
npm run dev
```

## Étape 2 : Authentification (ajoutée)
- `POST /api/auth/register` — création de compte (bcrypt, cost 12)
- `POST /api/auth/login` — connexion email/mot de passe
- `POST /api/auth/google` — connexion via Google Identity Services (vérifie le `credential` avec `google-auth-library`)
- `GET /api/auth/me` — utilisateur connecté (route protégée)
- `POST /api/auth/logout` — déconnexion

**Sécurité mise en place :**
- Mot de passe hashé avec bcrypt, jamais renvoyé au client
- JWT stocké en cookie `httpOnly` + `sameSite` (protège contre le vol via XSS)
- Rate-limiting dédié (10 tentatives/15min) sur register/login/google contre le brute-force
- Validation stricte des entrées (`express-validator`)
- Messages d'erreur volontairement génériques ("email ou mot de passe incorrect") pour ne pas révéler si un email existe

**Côté frontend (Google) :** utilisez le bouton "Sign in with Google" du SDK
[Google Identity Services](https://developers.google.com/identity/gsi/web), récupérez le `credential`
(JWT) renvoyé, puis envoyez-le à `POST /api/auth/google`.

## Étape 3 : API Produits (ajoutée)
- `GET /api/products` — liste avec filtres `?category=MEN&productType=JACKETS`,
  tri `?sort=price_asc|price_desc|newest`, recherche `?search=jean`, pagination `?page=1&limit=12`
- `GET /api/products/:slug` — détail produit (images + variantes tailles/couleurs)
- `POST /api/products` (admin) — création (slug auto-généré, anti-collision)
- `PUT /api/products/:id` (admin) — modification
- `DELETE /api/products/:id` (admin) — désactivation (soft delete, garde l'historique des commandes intact)
- `prisma/seed.js` — jeu de données de test reprenant les produits de vos maquettes

```bash
npm run prisma:seed   # peuple la base avec des produits de démo
```

## Étape 4 : Panier & Commandes (ajoutée)
- `GET /api/cart` — panier de l'utilisateur connecté (créé automatiquement si inexistant)
- `POST /api/cart/items` — ajouter un article `{ productId, variantId?, quantity }`
- `PUT /api/cart/items/:itemId` — modifier la quantité
- `DELETE /api/cart/items/:itemId` — retirer un article
- `DELETE /api/cart` — vider le panier
- `POST /api/orders` — créer une commande à partir du panier `{ shippingAddress: {...} }`
- `GET /api/orders/my` — mes commandes
- `GET /api/orders/:id` — détail d'une commande (propriétaire ou admin)
- `PUT /api/orders/:id/status` (admin) — changer le statut

**Points importants :**
- Le stock est vérifié **et** décrémenté dans une transaction Prisma (`$transaction`) :
  soit toutes les opérations réussissent, soit tout est annulé — pas de vente en survente
  si deux clients achètent le dernier article en même temps.
- Le prix de chaque article est **figé** dans `OrderItem.unitPrice` au moment de l'achat
  (si le prix du produit change après, les anciennes commandes ne sont pas affectées).
- Frais de port gratuits dès 100$ de sous-total, sinon 5.99$ ; taxe à 5% — cohérent avec
  votre maquette du panier (subtotal 240 → tax 12 → total 252).
- La commande est créée avec le statut `PENDING` ; elle passera à `PAID` via le
  webhook Stripe à l'étape 5.

## Étape 5 : Paiement Stripe (ajoutée)
- `POST /api/payments/create-checkout-session/:orderId` — crée une session Stripe Checkout
  à partir d'une commande `PENDING` (le frontend redirige ensuite l'utilisateur vers `session.url`)
- `POST /api/payments/webhook` — reçoit les événements Stripe (body brut + vérification de signature)
- `GET /api/payments/verify/:orderId` — pour la page de confirmation, vérifie le statut réel de la commande

**Points de sécurité essentiels :**
- **On ne fait jamais confiance au frontend** pour confirmer un paiement (ex: une simple
  redirection réussie ne suffit pas). Seul le webhook, dont la signature est vérifiée avec
  `stripe.webhooks.constructEvent`, peut faire passer une commande à `PAID`.
- Les montants envoyés à Stripe viennent du prix **figé côté serveur** (`OrderItem.unitPrice`),
  jamais d'un prix envoyé par le client.
- Le webhook est **idempotent** : si Stripe renvoie le même événement deux fois, la commande
  n'est mise à jour que si elle est encore `PENDING`.
- Si la session expire (`checkout.session.expired`), le stock réservé est automatiquement restauré.

**Tester en local avec la CLI Stripe :**
```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
# copiez le "whsec_..." affiché dans votre .env (STRIPE_WEBHOOK_SECRET)
```

## Prochaine étape
Étape 6 : Frontend React + Vite + Tailwind (en cours, voir dossier frontend/README.md).

## Étape 6 (frontend) : Contact complété
- `POST /api/contact` — implémenté (était en stub depuis l'étape 1), avec rate-limiting
  anti-spam (5 messages/heure/IP) et validation stricte (message 10-2000 caractères)
