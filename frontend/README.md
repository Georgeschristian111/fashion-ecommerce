# Frontend – E-commerce Fashion

## Sous-partie 1 : Setup + Layout (en place)
- Projet Vite + React 18 + Tailwind CSS configuré
- Client API Axios (`src/api/axios.js`) — envoie automatiquement le cookie `httpOnly` du backend
- `AuthContext` / `CartContext` — état global utilisateur et panier
- **Navbar responsive** : liens horizontaux dès `lg` (1024px), menu hamburger en dessous
- **Footer responsive** : grille 1 colonne (mobile) → 2 (tablette `sm`) → 4 colonnes (`lg`)
- Toutes les routes déclarées dans `App.jsx`, avec pages placeholder (à remplir dans les
  prochaines sous-parties) et une route protégée (`ProtectedRoute`) pour `/account`

## Installation (à faire chez vous, en local)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Ouvre http://localhost:5173 — assurez-vous que le backend tourne sur le port 5000
(`VITE_API_URL` dans `.env`).

## Responsive
Breakpoints Tailwind utilisés dans tout le projet :
- **Mobile** : < 640px (défaut, aucun préfixe)
- **Tablette** : `sm:` (≥640px) et `md:` (≥768px)
- **Ordinateur** : `lg:` (≥1024px) et `xl:` (≥1280px)

## Sous-partie 2 : Page d'accueil (en place)
- `src/api/products.js` — appels à `GET /api/products`
- `ProductCard` + `ProductGridSkeleton` — composants réutilisables (utilisés sur Home, puis Shop)
- **Hero** : titre, CTA "Shop Now"/"Learn More", image avec badge prix flottant
- **Latest Collections** : grille responsive (2 colonnes mobile → 3 tablette → 5 desktop),
  10 produits les plus récents
- **Best Sellers** : mêmes cartes, filtrées sur `isFeatured: true`
- **Why Shop With Us** : 3 colonnes (Easy Exchange / 7-Day Returns / Best Support),
  empilées en 1 colonne sur mobile

## Sous-partie 3 : Shop + Détail produit (en place)
- **Page Shop** : filtres pilotés par l'URL (`?category=MEN&productType=JACKETS&sort=price_asc&page=2`),
  donc partageables par lien et compatibles avec le bouton "précédent" du navigateur.
  Sidebar fixe à partir de `lg`, **tiroir de filtres** en overlay sur mobile/tablette.
- **Page Détail produit** : galerie avec miniatures, sélection taille/couleur reliée aux
  vraies variantes du backend (le stock affiché correspond à la variante sélectionnée),
  bouton "Add to Cart" désactivé si rupture de stock, redirection vers `/login` si non connecté.
- `ShopFilters`, `Pagination` — composants réutilisables

## Sous-partie 4 : Panier, Login/Register (+ Google), Contact (en place)
- **Page Cart** : contrôles quantité, suppression, récapitulatif (aperçu client, revérifié
  et recalculé côté serveur à la création de la commande — jamais de confiance dans un total
  calculé uniquement côté client)
- **Login / Register** : formulaires connectés au backend + bouton officiel **Google
  Identity Services** (SDK chargé dans `index.html`, composant `GoogleButton` réutilisable)
- **Page Contact** : formulaire relié à `POST /api/contact` (le backend a été complété
  pour cette sous-partie — il était resté en stub depuis l'étape 1)
- Route `/checkout` ajoutée en placeholder (sera construite avec l'intégration Stripe
  dans la prochaine sous-partie)

**Configuration requise pour Google Sign-In :**
Dans `frontend/.env`, renseignez `VITE_GOOGLE_CLIENT_ID` avec le même Client ID que
`GOOGLE_CLIENT_ID` côté backend (Google Cloud Console > Identifiants).

## Sous-partie 5 : Checkout + Stripe + Confirmation (en place) — étape 6 terminée
- **Page Checkout** : formulaire d'adresse de livraison → `POST /api/orders` (réserve le
  stock, calcule le total final côté serveur) → `POST /api/payments/create-checkout-session/:orderId`
  → redirection vers la page de paiement hébergée par Stripe
- **Page OrderConfirmation** : vérifie le **vrai statut** de la commande via
  `GET /api/payments/verify/:orderId` (pas seulement l'URL de retour), avec un léger
  polling (jusqu'à 6 tentatives / 2s) le temps que le webhook Stripe confirme le paiement
- **Page Account** : infos utilisateur, historique des commandes avec badge de statut coloré,
  déconnexion

**Le flux d'achat complet est maintenant fonctionnel de bout en bout :**
Shop → Product → Cart → Checkout (adresse) → Stripe (paiement) → webhook backend →
Order Confirmation → Account (historique).

## Le frontend est complet (React + Vite + Tailwind, responsive mobile/tablette/ordinateur)
Prochaine étape possible : sécurisation finale (helmet CSP, tests) et déploiement,
ou ajout d'un espace admin pour gérer les produits.
