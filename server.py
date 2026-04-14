from __future__ import annotations

import argparse
import hashlib
import hmac
import json
import mimetypes
import os
import secrets
import sqlite3
from datetime import datetime, timedelta, timezone
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
DB_PATH = DATA_DIR / "athelgard.db"
SCHEMA_PATH = ROOT / "schema.sql"
SESSION_COOKIE = "athelgard_session"
SESSION_DURATION_HOURS = 12
DEFAULT_ADMIN_USERNAME = os.environ.get("ATHELGARD_ADMIN_USER", "athelgard")
DEFAULT_ADMIN_PASSWORD = os.environ.get("ATHELGARD_ADMIN_PASSWORD", "AthelgardPrivate42!")
VALID_CATEGORIES = {"classic", "sporty", "vintage"}
VALID_ORDER_STATUSES = {"pending", "paid", "shipped", "delivered", "cancelled"}
STATIC_EXTENSIONS = {".html", ".css", ".js"}

DEFAULT_WATCHES = [
  {
    "id": "nocturne-classic",
    "name": "Nocturne Classic",
    "price": 12800,
    "category": "classic",
    "description": "A formal reference with deep black lacquer, knife-edge hands, and proportions tuned for evening wear.",
    "tagline": "Architectural calm for the longest table in the room.",
    "materials": "316L steel case, lacquer dial, diamond-polished dauphine hands, black calfskin strap",
    "movement": "AG-02 automatic movement with a 38-hour reserve",
    "designStory": "The Nocturne was drawn to look composed beneath low light. Its bezel is thin, its dial is quiet, and its silhouette leaves nothing competing with the wearer.",
    "craftsmanship": "Each case is alternated between satin brushing and bright polished bevels, then hand-inspected for edge tension and dial alignment.",
    "diameter": "39 mm",
    "strap": "Black calfskin leather",
    "reserve": "38 hours",
    "waterResistance": "50 m",
    "availability": "Private appointment",
    "image": ""
  },
  {
    "id": "regent-calendar",
    "name": "Regent Calendar",
    "price": 16800,
    "category": "classic",
    "description": "A composed calendar watch with sector-like balance, soft silver detailing, and quiet boardroom presence.",
    "tagline": "Measured complication with the discipline of a dress reference.",
    "materials": "Brushed steel, matte charcoal dial, silver calendar aperture, stitched alligator-grain strap",
    "movement": "AG-08 automatic calendar calibre with semi-instant date change",
    "designStory": "Regent Calendar places complication inside a calm visual field so the watch still reads as formal first and technical second.",
    "craftsmanship": "The chapter ring, aperture frame, and applied indices are aligned by hand to preserve the symmetry that gives the dial its authority.",
    "diameter": "40 mm",
    "strap": "Alligator-grain leather",
    "reserve": "42 hours",
    "waterResistance": "50 m",
    "availability": "Current house edit",
    "image": ""
  },
  {
    "id": "meridian-s",
    "name": "Meridian S",
    "price": 15400,
    "category": "sporty",
    "description": "A high-contrast sports watch with brushed shoulders, a compact bezel, and the confidence of a precision tool.",
    "tagline": "Weekend energy without surrendering polish.",
    "materials": "Brushed steel case, matte dial, luminous baton markers, integrated rubber-backed strap",
    "movement": "AG-Sport automatic movement with anti-shock architecture",
    "designStory": "Meridian S is tuned for acceleration. The hands are bolder, the contrast is cleaner, and the case sits with more forward pressure on the wrist.",
    "craftsmanship": "The case features wide satin planes and disciplined polished breaks so the sporty stance remains refined rather than aggressive.",
    "diameter": "41 mm",
    "strap": "Hybrid performance strap",
    "reserve": "44 hours",
    "waterResistance": "200 m",
    "availability": "Limited release",
    "image": ""
  },
  {
    "id": "apex-circuit",
    "name": "Apex Circuit",
    "price": 17900,
    "category": "sporty",
    "description": "An assertive chronograph-inspired silhouette defined by tension, traction, and grey-scale precision.",
    "tagline": "Trackside rhythm, tailored for private clubs.",
    "materials": "Steel case, layered anthracite dial, engraved rehaut, bracelet with brushed outer links",
    "movement": "AG-Circuit automatic timing movement with reinforced crown system",
    "designStory": "Apex Circuit nods to motorsport timing without falling into nostalgia. Its geometry is sharper, its dial depth is more technical, and its presence is unmistakably modern.",
    "craftsmanship": "Multiple levels of dial finishing create depth without clutter, allowing the watch to feel engineered and ceremonial at once.",
    "diameter": "42 mm",
    "strap": "Brushed steel bracelet",
    "reserve": "46 hours",
    "waterResistance": "150 m",
    "availability": "By allocation",
    "image": ""
  },
  {
    "id": "archive-1958",
    "name": "Archive 1958",
    "price": 13600,
    "category": "vintage",
    "description": "A warm, nostalgic reference with softened numerals, gilt accents, and the poise of a rediscovered heirloom.",
    "tagline": "Memory in the metal, confidence in the proportions.",
    "materials": "Steel case, warm charcoal dial, gilt minute track, tobacco leather strap",
    "movement": "AG-Heritage automatic movement with decorated rotor",
    "designStory": "Archive 1958 borrows the romance of old paddock chronographs while keeping the case thickness and stance crisp enough for contemporary wear.",
    "craftsmanship": "Textured dial treatments and warm metallic detailing are balanced carefully so the watch feels storied rather than artificially distressed.",
    "diameter": "38 mm",
    "strap": "Tobacco calf leather",
    "reserve": "40 hours",
    "waterResistance": "100 m",
    "availability": "Seasonal release",
    "image": ""
  },
  {
    "id": "monceau-sector",
    "name": "Monceau Sector",
    "price": 14700,
    "category": "vintage",
    "description": "A sector-dial study in restraint with domed cues, nuanced typography, and a gentleman-racer sensibility.",
    "tagline": "Soft contrast for collectors who notice the smallest lines.",
    "materials": "Steel case, sector dial, applied gilt signature, woven leather-backed strap",
    "movement": "AG-Heritage automatic movement regulated for daily stability",
    "designStory": "Monceau Sector is less about nostalgia and more about romance. It feels collected, kept, and passed on without ever appearing fragile.",
    "craftsmanship": "Fine dial printing, softened chapter ring transitions, and careful crystal reflections give this reference its old-world dignity.",
    "diameter": "39 mm",
    "strap": "Espresso woven strap",
    "reserve": "40 hours",
    "waterResistance": "50 m",
    "availability": "Current house edit",
    "image": ""
  }
]

CATEGORY_DEFAULTS = {
  "classic": {
    "tagline": "Formal restraint",
    "materials": "316L steel, piano-black dial, polished dauphine hands, calfskin leather",
    "movement": "AG-02 automatic calibre regulated in five positions",
    "diameter": "39 mm",
    "strap": "Leather strap",
    "reserve": "40 hours",
    "waterResistance": "50 m",
    "availability": "New private release"
  },
  "sporty": {
    "tagline": "Performance confidence",
    "materials": "Brushed steel, high-contrast dial printing, articulated bracelet or technical strap",
    "movement": "AG-Sport automatic calibre with reinforced rotor assembly",
    "diameter": "41 mm",
    "strap": "Performance strap",
    "reserve": "44 hours",
    "waterResistance": "150 m",
    "availability": "New private release"
  },
  "vintage": {
    "tagline": "Patina-minded elegance",
    "materials": "Steel case, domed crystal effect, softened numerals, textured leather or woven strap",
    "movement": "AG-Heritage automatic calibre with warm gilt detailing",
    "diameter": "39 mm",
    "strap": "Leather strap",
    "reserve": "40 hours",
    "waterResistance": "50 m",
    "availability": "New private release"
  }
}


def utc_now() -> datetime:
  return datetime.now(timezone.utc)


def iso_timestamp(value: datetime | None = None) -> str:
  return (value or utc_now()).replace(microsecond=0).isoformat()


def get_db() -> sqlite3.Connection:
  connection = sqlite3.connect(DB_PATH)
  connection.row_factory = sqlite3.Row
  connection.execute("PRAGMA foreign_keys = ON")
  connection.execute("PRAGMA journal_mode = MEMORY")
  connection.execute("PRAGMA temp_store = MEMORY")
  return connection


def hash_password(password: str) -> str:
  salt = secrets.token_bytes(16)
  derived = hashlib.scrypt(password.encode("utf-8"), salt=salt, n=16384, r=8, p=1)
  return f"{salt.hex()}${derived.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
  try:
    salt_hex, digest_hex = stored_hash.split("$", 1)
  except ValueError:
    return False
  salt = bytes.fromhex(salt_hex)
  expected = bytes.fromhex(digest_hex)
  derived = hashlib.scrypt(password.encode("utf-8"), salt=salt, n=16384, r=8, p=1)
  return hmac.compare_digest(derived, expected)


def slugify(value: str) -> str:
  lowered = value.strip().lower()
  parts = []
  last_dash = False
  for character in lowered:
    if character.isalnum():
      parts.append(character)
      last_dash = False
    elif not last_dash:
      parts.append("-")
      last_dash = True
  slug = "".join(parts).strip("-")
  return slug or f"reference-{secrets.token_hex(3)}"


def row_to_watch(row: sqlite3.Row) -> dict[str, object]:
  return {
    "id": row["id"],
    "name": row["name"],
    "price": row["price"],
    "category": row["category"],
    "description": row["description"],
    "tagline": row["tagline"] or "",
    "materials": row["materials"] or "",
    "movement": row["movement"] or "",
    "designStory": row["design_story"] or "",
    "craftsmanship": row["craftsmanship"] or "",
    "diameter": row["diameter"] or "",
    "strap": row["strap"] or "",
    "reserve": row["reserve_hours"] or "",
    "waterResistance": row["water_resistance"] or "",
    "availability": row["availability"] or "",
    "image": row["image"] or ""
  }


def row_to_order(row: sqlite3.Row, items: list[dict[str, object]]) -> dict[str, object]:
  return {
    "id": row["id"],
    "fullName": row["full_name"],
    "email": row["email"],
    "address": row["address"],
    "city": row["city"],
    "postalCode": row["postal_code"],
    "country": row["country"],
    "delivery": row["delivery"],
    "status": row["status"],
    "totalAmount": row["total_amount"],
    "cardLast4": row["card_last4"] or "",
    "createdAt": row["created_at"],
    "items": items
  }


def insert_watch(connection: sqlite3.Connection, watch: dict[str, object]) -> None:
  connection.execute(
    """
    INSERT OR REPLACE INTO watches (
      id, name, price, category, description, tagline, materials, movement,
      design_story, craftsmanship, diameter, strap, reserve_hours,
      water_resistance, availability, image, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """,
    (
      watch["id"],
      watch["name"],
      watch["price"],
      watch["category"],
      watch["description"],
      watch.get("tagline", ""),
      watch.get("materials", ""),
      watch.get("movement", ""),
      watch.get("designStory", ""),
      watch.get("craftsmanship", ""),
      watch.get("diameter", ""),
      watch.get("strap", ""),
      watch.get("reserve", ""),
      watch.get("waterResistance", ""),
      watch.get("availability", ""),
      watch.get("image", ""),
      iso_timestamp()
    )
  )


def seed_default_watches(connection: sqlite3.Connection) -> None:
  connection.execute("DELETE FROM watches")
  for watch in DEFAULT_WATCHES:
    insert_watch(connection, watch)


def ensure_admin_account(connection: sqlite3.Connection) -> None:
  existing = connection.execute("SELECT id FROM admins WHERE username = ?", (DEFAULT_ADMIN_USERNAME,)).fetchone()
  if existing:
    return
  connection.execute(
    "INSERT INTO admins (username, password_hash, created_at) VALUES (?, ?, ?)",
    (DEFAULT_ADMIN_USERNAME, hash_password(DEFAULT_ADMIN_PASSWORD), iso_timestamp())
  )


def initialize_database() -> None:
  DATA_DIR.mkdir(parents=True, exist_ok=True)
  with get_db() as connection:
    connection.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
    migrate_database(connection)
    ensure_admin_account(connection)
    count = connection.execute("SELECT COUNT(*) AS count FROM watches").fetchone()["count"]
    if count == 0:
      seed_default_watches(connection)
    connection.execute("DELETE FROM sessions WHERE expires_at <= ?", (iso_timestamp(),))
    connection.commit()


def migrate_database(connection: sqlite3.Connection) -> None:
  order_columns = {
    row["name"]
    for row in connection.execute("PRAGMA table_info(orders)").fetchall()
  }
  if "status" not in order_columns:
    connection.execute("ALTER TABLE orders ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'")
    connection.execute("UPDATE orders SET status = 'pending' WHERE status IS NULL OR status = ''")


def make_watch_from_payload(payload: dict[str, object]) -> dict[str, object]:
  category = str(payload.get("category", "")).strip().lower()
  if category not in VALID_CATEGORIES:
    raise ValueError("Category must be classic, sporty, or vintage.")

  name = str(payload.get("name", "")).strip()
  description = str(payload.get("description", "")).strip()
  if not name or not description:
    raise ValueError("Name and description are required.")

  try:
    price = int(payload.get("price", 0))
  except (TypeError, ValueError) as error:
    raise ValueError("Price must be a valid number.") from error

  if price <= 0:
    raise ValueError("Price must be greater than zero.")

  defaults = CATEGORY_DEFAULTS[category]
  suffix = secrets.token_hex(2)

  return {
    "id": f"{slugify(name)}-{suffix}",
    "name": name,
    "price": price,
    "category": category,
    "description": description,
    "tagline": defaults["tagline"],
    "materials": defaults["materials"],
    "movement": defaults["movement"],
    "designStory": description,
    "craftsmanship": "Prepared for the private house edit with attention to finishing balance, tactile confidence, and restrained presentation.",
    "diameter": defaults["diameter"],
    "strap": defaults["strap"],
    "reserve": defaults["reserve"],
    "waterResistance": defaults["waterResistance"],
    "availability": defaults["availability"],
    "image": str(payload.get("image", "")).strip()
  }


def parse_json_body(handler: BaseHTTPRequestHandler) -> dict[str, object]:
  content_length = int(handler.headers.get("Content-Length", "0") or 0)
  raw_body = handler.rfile.read(content_length) if content_length else b"{}"
  if not raw_body:
    return {}
  try:
    return json.loads(raw_body.decode("utf-8"))
  except json.JSONDecodeError as error:
    raise ValueError("Request body must be valid JSON.") from error


def extract_session_token(cookie_header: str | None) -> str | None:
  if not cookie_header:
    return None
  jar = SimpleCookie()
  jar.load(cookie_header)
  token = jar.get(SESSION_COOKIE)
  return token.value if token else None


def build_session_cookie(token: str, expires_at: datetime | None = None) -> str:
  cookie = SimpleCookie()
  cookie[SESSION_COOKIE] = token
  cookie[SESSION_COOKIE]["httponly"] = True
  cookie[SESSION_COOKIE]["path"] = "/"
  cookie[SESSION_COOKIE]["samesite"] = "Lax"
  if expires_at is not None:
    cookie[SESSION_COOKIE]["expires"] = expires_at.strftime("%a, %d %b %Y %H:%M:%S GMT")
  return cookie.output(header="").strip()


def clear_session_cookie() -> str:
  cookie = SimpleCookie()
  cookie[SESSION_COOKIE] = ""
  cookie[SESSION_COOKIE]["path"] = "/"
  cookie[SESSION_COOKIE]["httponly"] = True
  cookie[SESSION_COOKIE]["samesite"] = "Lax"
  cookie[SESSION_COOKIE]["expires"] = "Thu, 01 Jan 1970 00:00:00 GMT"
  return cookie.output(header="").strip()


class AthelgardHandler(BaseHTTPRequestHandler):
  server_version = "AthelgardHTTP/1.0"

  def do_GET(self) -> None:
    parsed = urlparse(self.path)
    path = unquote(parsed.path)
    if path.startswith("/api/"):
      self.handle_api_get(path)
      return
    self.serve_static(path, parsed)

  def do_POST(self) -> None:
    parsed = urlparse(self.path)
    path = unquote(parsed.path)
    if not path.startswith("/api/"):
      self.send_error(HTTPStatus.NOT_FOUND)
      return
    self.handle_api_post(path)

  def do_DELETE(self) -> None:
    parsed = urlparse(self.path)
    path = unquote(parsed.path)
    if not path.startswith("/api/"):
      self.send_error(HTTPStatus.NOT_FOUND)
      return
    self.handle_api_delete(path)

  def log_message(self, format_string: str, *args: object) -> None:
    return

  def send_json(self, status: HTTPStatus, payload: dict[str, object], headers: dict[str, str] | None = None) -> None:
    body = json.dumps(payload).encode("utf-8")
    self.send_response(status)
    self.send_header("Content-Type", "application/json; charset=utf-8")
    self.send_header("Content-Length", str(len(body)))
    if headers:
      for key, value in headers.items():
        self.send_header(key, value)
    self.end_headers()
    self.wfile.write(body)

  def redirect(self, location: str) -> None:
    self.send_response(HTTPStatus.FOUND)
    self.send_header("Location", location)
    self.end_headers()

  def current_session(self) -> dict[str, object] | None:
    token = extract_session_token(self.headers.get("Cookie"))
    if not token:
      return None

    with get_db() as connection:
      row = connection.execute(
        """
        SELECT sessions.token, sessions.expires_at, admins.id AS admin_id, admins.username
        FROM sessions
        JOIN admins ON admins.id = sessions.admin_id
        WHERE sessions.token = ?
        """,
        (token,)
      ).fetchone()
      if not row:
        return None
      if row["expires_at"] <= iso_timestamp():
        connection.execute("DELETE FROM sessions WHERE token = ?", (token,))
        connection.commit()
        return None
      return {
        "token": row["token"],
        "adminId": row["admin_id"],
        "username": row["username"]
      }

  def require_session(self) -> dict[str, object] | None:
    session = self.current_session()
    if session:
      return session
    self.send_json(HTTPStatus.UNAUTHORIZED, {"error": "Authentication required."})
    return None

  def serve_static(self, path: str, parsed) -> None:
    target_path = "/index.html" if path == "/" else path
    if target_path == "/admin.html" and not self.current_session():
      next_path = parsed.path or "/admin.html"
      self.redirect(f"/login.html?next={next_path}")
      return
    if target_path == "/login.html" and self.current_session():
      self.redirect("/admin.html")
      return

    extension = Path(target_path).suffix.lower()
    if extension not in STATIC_EXTENSIONS:
      self.send_error(HTTPStatus.NOT_FOUND)
      return

    file_path = (ROOT / target_path.lstrip("/")).resolve()
    if ROOT not in file_path.parents and file_path != ROOT:
      self.send_error(HTTPStatus.FORBIDDEN)
      return
    if not file_path.exists() or not file_path.is_file():
      self.send_error(HTTPStatus.NOT_FOUND)
      return

    payload = file_path.read_bytes()
    content_type = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"
    self.send_response(HTTPStatus.OK)
    self.send_header("Content-Type", content_type)
    self.send_header("Content-Length", str(len(payload)))
    self.end_headers()
    self.wfile.write(payload)

  def handle_api_get(self, path: str) -> None:
    if path == "/api/watches":
      with get_db() as connection:
        rows = connection.execute(
          "SELECT * FROM watches ORDER BY created_at DESC, rowid DESC"
        ).fetchall()
      self.send_json(HTTPStatus.OK, {"watches": [row_to_watch(row) for row in rows]})
      return

    if path == "/api/admin/session":
      session = self.current_session()
      if not session:
        self.send_json(HTTPStatus.OK, {"authenticated": False})
        return
      self.send_json(
        HTTPStatus.OK,
        {"authenticated": True, "username": session["username"]}
      )
      return

    if path == "/api/admin/orders":
      session = self.require_session()
      if not session:
        return
      self.list_orders()
      return

    self.send_error(HTTPStatus.NOT_FOUND)

  def handle_api_post(self, path: str) -> None:
    try:
      payload = parse_json_body(self)
    except ValueError as error:
      self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})
      return

    if path == "/api/admin/login":
      self.login_admin(payload)
      return
    if path == "/api/admin/logout":
      self.logout_admin()
      return
    if path == "/api/admin/watches":
      self.create_watch(payload)
      return
    if path == "/api/admin/reset":
      self.reset_watches()
      return
    if path.startswith("/api/admin/orders/") and path.endswith("/status"):
      order_id = path[len("/api/admin/orders/"):-len("/status")].strip("/")
      self.update_order_status(order_id, payload)
      return
    if path == "/api/orders":
      self.create_order(payload)
      return

    self.send_error(HTTPStatus.NOT_FOUND)

  def handle_api_delete(self, path: str) -> None:
    if path.startswith("/api/admin/watches/"):
      watch_id = path.rsplit("/", 1)[-1]
      self.delete_watch(watch_id)
      return
    self.send_error(HTTPStatus.NOT_FOUND)

  def login_admin(self, payload: dict[str, object]) -> None:
    username = str(payload.get("username", "")).strip()
    password = str(payload.get("password", ""))
    if not username or not password:
      self.send_json(HTTPStatus.BAD_REQUEST, {"error": "Username and password are required."})
      return

    with get_db() as connection:
      row = connection.execute(
        "SELECT id, username, password_hash FROM admins WHERE username = ?",
        (username,)
      ).fetchone()
      if not row or not verify_password(password, row["password_hash"]):
        self.send_json(HTTPStatus.UNAUTHORIZED, {"error": "Invalid credentials."})
        return

      token = secrets.token_urlsafe(32)
      expires_at = utc_now() + timedelta(hours=SESSION_DURATION_HOURS)
      connection.execute(
        "INSERT INTO sessions (token, admin_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
        (token, row["id"], iso_timestamp(expires_at), iso_timestamp())
      )
      connection.commit()

    self.send_json(
      HTTPStatus.OK,
      {"authenticated": True, "username": row["username"]},
      headers={"Set-Cookie": build_session_cookie(token, expires_at)}
    )

  def logout_admin(self) -> None:
    token = extract_session_token(self.headers.get("Cookie"))
    if token:
      with get_db() as connection:
        connection.execute("DELETE FROM sessions WHERE token = ?", (token,))
        connection.commit()
    self.send_json(
      HTTPStatus.OK,
      {"authenticated": False},
      headers={"Set-Cookie": clear_session_cookie()}
    )

  def create_watch(self, payload: dict[str, object]) -> None:
    session = self.require_session()
    if not session:
      return
    try:
      watch = make_watch_from_payload(payload)
    except ValueError as error:
      self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})
      return

    with get_db() as connection:
      insert_watch(connection, watch)
      connection.commit()
    self.send_json(HTTPStatus.CREATED, {"watch": watch})

  def delete_watch(self, watch_id: str) -> None:
    session = self.require_session()
    if not session:
      return
    try:
      with get_db() as connection:
        row = connection.execute("SELECT id FROM watches WHERE id = ?", (watch_id,)).fetchone()
        if not row:
          self.send_json(HTTPStatus.NOT_FOUND, {"error": "Watch not found."})
          return
        connection.execute("DELETE FROM watches WHERE id = ?", (watch_id,))
        connection.commit()
    except sqlite3.IntegrityError:
      self.send_json(
        HTTPStatus.CONFLICT,
        {"error": "This watch is linked to an existing order and cannot be removed."}
      )
      return
    self.send_json(HTTPStatus.OK, {"deleted": watch_id})

  def reset_watches(self) -> None:
    session = self.require_session()
    if not session:
      return
    try:
      with get_db() as connection:
        seed_default_watches(connection)
        connection.commit()
        rows = connection.execute(
          "SELECT * FROM watches ORDER BY created_at DESC, rowid DESC"
        ).fetchall()
    except sqlite3.IntegrityError:
      self.send_json(
        HTTPStatus.CONFLICT,
        {"error": "Inventory reset is blocked because existing orders still reference current watches."}
      )
      return
    self.send_json(HTTPStatus.OK, {"watches": [row_to_watch(row) for row in rows]})

  def list_orders(self) -> None:
    with get_db() as connection:
      order_rows = connection.execute(
        """
        SELECT *
        FROM orders
        ORDER BY created_at DESC, id DESC
        """
      ).fetchall()
      item_rows = connection.execute(
        """
        SELECT order_id, watch_id, watch_name, quantity, unit_price
        FROM order_items
        ORDER BY order_id DESC, id ASC
        """
      ).fetchall()

    item_map: dict[str, list[dict[str, object]]] = {}
    for item_row in item_rows:
      item_map.setdefault(item_row["order_id"], []).append({
        "watchId": item_row["watch_id"],
        "watchName": item_row["watch_name"],
        "quantity": item_row["quantity"],
        "unitPrice": item_row["unit_price"]
      })

    orders = [row_to_order(order_row, item_map.get(order_row["id"], [])) for order_row in order_rows]
    self.send_json(HTTPStatus.OK, {"orders": orders})

  def update_order_status(self, order_id: str, payload: dict[str, object]) -> None:
    session = self.require_session()
    if not session:
      return

    status = str(payload.get("status", "")).strip().lower()
    if status not in VALID_ORDER_STATUSES:
      self.send_json(HTTPStatus.BAD_REQUEST, {"error": "Invalid order status."})
      return

    with get_db() as connection:
      row = connection.execute("SELECT id FROM orders WHERE id = ?", (order_id,)).fetchone()
      if not row:
        self.send_json(HTTPStatus.NOT_FOUND, {"error": "Order not found."})
        return
      connection.execute(
        "UPDATE orders SET status = ? WHERE id = ?",
        (status, order_id)
      )
      connection.commit()
      order_row = connection.execute("SELECT * FROM orders WHERE id = ?", (order_id,)).fetchone()
      item_rows = connection.execute(
        """
        SELECT order_id, watch_id, watch_name, quantity, unit_price
        FROM order_items
        WHERE order_id = ?
        ORDER BY id ASC
        """,
        (order_id,)
      ).fetchall()

    items = [{
      "watchId": item_row["watch_id"],
      "watchName": item_row["watch_name"],
      "quantity": item_row["quantity"],
      "unitPrice": item_row["unit_price"]
    } for item_row in item_rows]

    self.send_json(HTTPStatus.OK, {"order": row_to_order(order_row, items)})

  def create_order(self, payload: dict[str, object]) -> None:
    required_fields = ["fullName", "email", "address", "city", "postalCode", "country", "delivery"]
    missing_fields = [field for field in required_fields if not str(payload.get(field, "")).strip()]
    if missing_fields:
      self.send_json(HTTPStatus.BAD_REQUEST, {"error": "All checkout fields are required."})
      return

    raw_items = payload.get("items")
    if not isinstance(raw_items, list) or not raw_items:
      self.send_json(HTTPStatus.BAD_REQUEST, {"error": "At least one watch is required for checkout."})
      return

    requested_items: dict[str, int] = {}
    for item in raw_items:
      if not isinstance(item, dict):
        continue
      watch_id = str(item.get("id", "")).strip()
      try:
        quantity = int(item.get("quantity", 0))
      except (TypeError, ValueError):
        quantity = 0
      if watch_id and quantity > 0:
        requested_items[watch_id] = requested_items.get(watch_id, 0) + quantity

    if not requested_items:
      self.send_json(HTTPStatus.BAD_REQUEST, {"error": "No valid watch selections were provided."})
      return

    placeholders = ", ".join("?" for _ in requested_items)
    with get_db() as connection:
      rows = connection.execute(
        f"SELECT id, name, price FROM watches WHERE id IN ({placeholders})",
        tuple(requested_items.keys())
      ).fetchall()
      if len(rows) != len(requested_items):
        self.send_json(HTTPStatus.BAD_REQUEST, {"error": "One or more selected watches are no longer available."})
        return

      order_id = f"ord_{secrets.token_hex(6)}"
      total_amount = 0
      line_items = []
      for row in rows:
        quantity = requested_items[row["id"]]
        total_amount += row["price"] * quantity
        line_items.append((order_id, row["id"], row["name"], quantity, row["price"]))

      card_number = str(payload.get("cardNumber", "")).strip()
      card_last4 = card_number[-4:] if len(card_number) >= 4 else ""

      connection.execute(
        """
        INSERT INTO orders (
          id, full_name, email, address, city, postal_code, country,
          delivery, status, total_amount, card_last4, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
          order_id,
          str(payload["fullName"]).strip(),
          str(payload["email"]).strip(),
          str(payload["address"]).strip(),
          str(payload["city"]).strip(),
          str(payload["postalCode"]).strip(),
          str(payload["country"]).strip(),
          str(payload["delivery"]).strip(),
          "pending",
          total_amount,
          card_last4,
          iso_timestamp()
        )
      )
      connection.executemany(
        """
        INSERT INTO order_items (order_id, watch_id, watch_name, quantity, unit_price)
        VALUES (?, ?, ?, ?, ?)
        """,
        line_items
      )
      connection.commit()

    self.send_json(
      HTTPStatus.CREATED,
      {
        "orderId": order_id,
        "status": "pending",
        "totalAmount": total_amount,
        "message": "Order recorded. Concierge follow-up initiated."
      }
    )


def run_server(host: str, port: int) -> None:
  with ThreadingHTTPServer((host, port), AthelgardHandler) as server:
    print(f"Athelgard running at http://{host}:{port}")
    print(f"Private login: http://{host}:{port}/login.html")
    print(f"Default admin username: {DEFAULT_ADMIN_USERNAME}")
    print("Default admin password comes from ATHELGARD_ADMIN_PASSWORD or the built-in fallback.")
    try:
      server.serve_forever()
    except KeyboardInterrupt:
      print("\nServer stopped.")


def main() -> None:
  parser = argparse.ArgumentParser(description="Athelgard SQLite-backed web server")
  parser.add_argument("--host", default="127.0.0.1", help="Host interface to bind")
  parser.add_argument("--port", type=int, default=8000, help="Port to bind")
  parser.add_argument("--init-only", action="store_true", help="Initialize the database and exit")
  args = parser.parse_args()

  initialize_database()
  if args.init_only:
    print(f"Database initialized at {DB_PATH}")
    return

  run_server(args.host, args.port)


if __name__ == "__main__":
  main()
