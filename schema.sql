PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  admin_id INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS watches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  tagline TEXT,
  materials TEXT,
  movement TEXT,
  design_story TEXT,
  craftsmanship TEXT,
  diameter TEXT,
  strap TEXT,
  reserve_hours TEXT,
  water_resistance TEXT,
  availability TEXT,
  image TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  delivery TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount INTEGER NOT NULL,
  card_last4 TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL,
  watch_id TEXT NOT NULL,
  watch_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (watch_id) REFERENCES watches(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_watches_category ON watches(category);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
