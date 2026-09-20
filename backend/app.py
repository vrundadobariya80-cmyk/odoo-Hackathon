import os
import random
import datetime
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from config import SECRET_KEY
from database import init_db, query_db, execute_db, dict_from_row, dicts_from_rows

app = Flask(__name__)
app.secret_key = SECRET_KEY
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Allow CORS with credentials for local dev
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"])

# Ensure DB initialized on startup
init_db()

# --- HELPER DECORATORS & UTILS ---
def get_current_user():
    user_id = session.get('user_id')
    if not user_id:
        return None
    user = query_db("SELECT id, full_name, email, role, avatar, is_verified, is_banned FROM users WHERE id = ?", (user_id,), one=True)
    if user and user['is_banned']:
        session.clear()
        return None
    return dict_from_row(user)

def require_auth(allowed_roles=None):
    def decorator(f):
        def wrapper(*args, **kwargs):
            user = get_current_user()
            if not user:
                return jsonify({"error": "Authentication required or account suspended"}), 401
            if allowed_roles and user['role'] not in allowed_roles:
                return jsonify({"error": "Unauthorized access"}), 403
            return f(user, *args, **kwargs)
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator

def generate_time_slots(opening_time, closing_time):
    slots = []
    try:
        start_h = int(opening_time.split(':')[0])
        end_h = int(closing_time.split(':')[0])
    except Exception:
        start_h, end_h = 6, 22

    for h in range(start_h, end_h):
        s_time = f"{h:02d}:00"
        e_time = f"{(h+1):02d}:00"
        slots.append({
            "start_time": s_time,
            "end_time": e_time,
            "slot_label": f"{s_time} - {e_time}"
        })
    return slots

# --- AUTH ENDPOINTS ---

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json or {}
    full_name = data.get('full_name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    role = data.get('role', 'user')
    avatar = data.get('avatar', '').strip() or 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'

    if not full_name or not email or not password:
        return jsonify({"error": "Please provide full name, email, and password."}), 400

    if role not in ['user', 'owner', 'admin']:
        role = 'user'

    existing = query_db("SELECT id FROM users WHERE email = ?", (email,), one=True)
    if existing:
        return jsonify({"error": "Email address already registered."}), 400

    otp_code = f"{random.randint(100000, 999999)}"
    password_hash = generate_password_hash(password)

    user_id = execute_db('''
        INSERT INTO users (full_name, email, password_hash, role, avatar, is_verified, is_banned, otp_code)
        VALUES (?, ?, ?, ?, ?, 0, 0, ?)
    ''', (full_name, email, password_hash, role, avatar, otp_code))

    print(f"\n==========================================")
    print(f" DEMO OTP FOR {email}: {otp_code}")
    print(f"==========================================\n")

    return jsonify({
        "message": "Registration successful! Please verify OTP.",
        "email": email,
        "otp": otp_code  # Exposed for demo convenience
    }), 201

@app.route('/api/auth/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    otp = data.get('otp', '').strip()

    user = query_db("SELECT * FROM users WHERE email = ?", (email,), one=True)
    if not user:
        return jsonify({"error": "User not found."}), 404

    if user['otp_code'] != otp:
        return jsonify({"error": "Invalid verification code. Please try again."}), 400

    execute_db("UPDATE users SET is_verified = 1, otp_code = '' WHERE id = ?", (user['id'],))
    return jsonify({"message": "Account verified successfully! You can now log in."}), 200

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    user = query_db("SELECT * FROM users WHERE email = ?", (email,), one=True)
    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({"error": "Invalid email or password."}), 401

    if user['is_banned']:
        return jsonify({"error": "Your account has been suspended by administration."}), 403

    if not user['is_verified']:
        return jsonify({"error": "Account not verified. Please verify your OTP first.", "needs_verification": True, "email": email}), 403

    session['user_id'] = user['id']
    user_dict = {
        "id": user['id'],
        "full_name": user['full_name'],
        "email": user['email'],
        "role": user['role'],
        "avatar": user['avatar'],
        "is_verified": user['is_verified']
    }
    return jsonify({"message": "Login successful", "user": user_dict}), 200

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/api/auth/me', methods=['GET'])
def get_me():
    user = get_current_user()
    if not user:
        return jsonify({"user": None}), 200
    return jsonify({"user": user}), 200

# --- VENUES & COURTS ENDPOINTS ---

@app.route('/api/venues', methods=['GET'])
def get_venues():
    search = request.args.get('search', '').strip()
    sport = request.args.get('sport', '').strip()
    location = request.args.get('location', '').strip()
    price_max = request.args.get('price_max', type=float)
    rating_min = request.args.get('rating_min', type=float)
    sort_by = request.args.get('sort_by', 'rating')
    page = max(1, request.args.get('page', 1, type=int))
    limit = max(1, request.args.get('limit', 9, type=int))

    query = '''
        SELECT f.*, 
               COALESCE(AVG(r.rating), 0) as avg_rating,
               COUNT(r.id) as review_count,
               MIN(c.price_per_hour) as starting_price
        FROM facilities f
        LEFT JOIN reviews r ON f.id = r.facility_id
        LEFT JOIN courts c ON f.id = c.facility_id AND c.is_active = 1
        WHERE f.status = 'Approved'
    '''
    params = []

    if search:
        query += " AND (f.name LIKE ? OR f.location LIKE ? OR f.address LIKE ? OR f.description LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term, term])

    if sport:
        query += " AND f.sports LIKE ?"
        params.append(f"%{sport}%")

    if location:
        query += " AND f.location LIKE ?"
        params.append(f"%{location}%")

    query += " GROUP BY f.id"

    # Having filters for calculated columns
    having_clauses = []
    if price_max is not None:
        having_clauses.append("starting_price <= ?")
        params.append(price_max)
    if rating_min is not None and rating_min > 0:
        having_clauses.append("avg_rating >= ?")
        params.append(rating_min)

    if having_clauses:
        query += " HAVING " + " AND ".join(having_clauses)

    # Sorting
    if sort_by == 'price_asc':
        query += " ORDER BY starting_price ASC"
    elif sort_by == 'price_desc':
        query += " ORDER BY starting_price DESC"
    else:  # rating default
        query += " ORDER BY avg_rating DESC, review_count DESC"

    # Fetch all for pagination calculation
    all_facilities = dicts_from_rows(query_db(query, params))
    total = len(all_facilities)
    offset = (page - 1) * limit
    paginated = all_facilities[offset:offset + limit]

    # Process sports/amenities list strings into arrays
    for f in paginated:
        f['sports_list'] = [s.strip() for s in f['sports'].split(',') if s.strip()]
        f['amenities_list'] = [a.strip() for a in f['amenities'].split(',') if a.strip()]
        f['avg_rating'] = round(f['avg_rating'], 1)
        f['starting_price'] = f['starting_price'] or 0.0

    return jsonify({
        "facilities": paginated,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit if total > 0 else 1
    }), 200

@app.route('/api/venues/<int:venue_id>', methods=['GET'])
def get_venue_details(venue_id):
    facility = query_db('''
        SELECT f.*, u.full_name as owner_name, u.email as owner_email,
               COALESCE(AVG(r.rating), 0) as avg_rating,
               COUNT(r.id) as review_count
        FROM facilities f
        JOIN users u ON f.owner_id = u.id
        LEFT JOIN reviews r ON f.id = r.facility_id
        WHERE f.id = ?
        GROUP BY f.id
    ''', (venue_id,), one=True)

    if not facility:
        return jsonify({"error": "Venue not found"}), 404

    facility_dict = dict_from_row(facility)
    facility_dict['sports_list'] = [s.strip() for s in facility_dict['sports'].split(',') if s.strip()]
    facility_dict['amenities_list'] = [a.strip() for a in facility_dict['amenities'].split(',') if a.strip()]
    facility_dict['avg_rating'] = round(facility_dict['avg_rating'], 1)

    # Active courts
    courts = dicts_from_rows(query_db("SELECT * FROM courts WHERE facility_id = ? AND is_active = 1", (venue_id,)))

    # Reviews
    reviews = dicts_from_rows(query_db('''
        SELECT r.*, u.full_name as user_name, u.avatar as user_avatar
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.facility_id = ?
        ORDER BY r.created_at DESC
    ''', (venue_id,)))

    return jsonify({
        "facility": facility_dict,
        "courts": courts,
        "reviews": reviews
    }), 200

@app.route('/api/courts/<int:facility_id>', methods=['GET'])
def get_courts(facility_id):
    courts = dicts_from_rows(query_db("SELECT * FROM courts WHERE facility_id = ? AND is_active = 1", (facility_id,)))
    return jsonify({"courts": courts}), 200

@app.route('/api/slots/<int:court_id>', methods=['GET'])
def get_slots(court_id):
    date_str = request.args.get('date', datetime.date.today().isoformat())
    court = query_db("SELECT * FROM courts WHERE id = ?", (court_id,), one=True)
    if not court:
        return jsonify({"error": "Court not found"}), 404

    court_dict = dict_from_row(court)
    all_slots = generate_time_slots(court_dict['opening_time'], court_dict['closing_time'])

    # Existing bookings
    existing_bookings = dicts_from_rows(query_db('''
        SELECT start_time, end_time FROM bookings
        WHERE court_id = ? AND booking_date = ? AND status != 'Cancelled'
    ''', (court_id, date_str)))

    # Blocked slots
    blocked_slots = dicts_from_rows(query_db('''
        SELECT start_time, end_time, reason FROM blocked_slots
        WHERE court_id = ? AND booking_date = ?
    ''', (court_id, date_str)))

    booked_times = {b['start_time'] for b in existing_bookings}
    blocked_dict = {b['start_time']: b['reason'] for b in blocked_slots}

    processed_slots = []
    for s in all_slots:
        st = s['start_time']
        if st in booked_times:
            s['is_available'] = False
            s['status'] = 'Booked'
            s['reason'] = 'Already Booked'
        elif st in blocked_dict:
            s['is_available'] = False
            s['status'] = 'Blocked'
            s['reason'] = blocked_dict[st]
        else:
            s['is_available'] = True
            s['status'] = 'Available'
            s['reason'] = ''
        processed_slots.append(s)

    return jsonify({
        "court": court_dict,
        "date": date_str,
        "slots": processed_slots
    }), 200

# --- BOOKING & PAYMENT ENDPOINTS ---

@app.route('/api/bookings', methods=['POST'])
@require_auth()
def create_booking(current_user):
    data = request.json or {}
    court_id = data.get('court_id')
    facility_id = data.get('facility_id')
    booking_date = data.get('booking_date')
    start_time = data.get('start_time')
    end_time = data.get('end_time')

    if not court_id or not facility_id or not booking_date or not start_time or not end_time:
        return jsonify({"error": "Missing booking parameters."}), 400

    # Ensure booking is not in the past
    today = datetime.date.today().isoformat()
    if booking_date < today:
        return jsonify({"error": "Bookings can only be made for future or current dates."}), 400

    court = query_db("SELECT * FROM courts WHERE id = ?", (court_id,), one=True)
    if not court:
        return jsonify({"error": "Court not found."}), 404

    court_dict = dict_from_row(court)

    # Check for existing active booking
    conflict_booking = query_db('''
        SELECT id FROM bookings
        WHERE court_id = ? AND booking_date = ? AND start_time = ? AND status != 'Cancelled'
    ''', (court_id, booking_date, start_time), one=True)

    if conflict_booking:
        return jsonify({"error": "This time slot has already been booked."}), 400

    # Check for blocked slot
    blocked = query_db('''
        SELECT id FROM blocked_slots
        WHERE court_id = ? AND booking_date = ? AND start_time = ?
    ''', (court_id, booking_date, start_time), one=True)

    if blocked:
        return jsonify({"error": "This time slot is blocked for maintenance or private event."}), 400

    total_price = court_dict['price_per_hour']

    raw_method = data.get('payment_method', 'UPI')
    if raw_method == 'Cash':
        payment_method = 'Cash at Venue'
        payment_status = 'Pending (Pay at Venue)'
    elif raw_method == 'Card':
        payment_method = 'Credit / Debit Card'
        payment_status = 'Paid (Online)'
    else:
        payment_method = 'UPI Instant'
        payment_status = 'Paid (Online)'

    booking_id = execute_db('''
        INSERT INTO bookings (user_id, facility_id, court_id, booking_date, start_time, end_time, total_price, status, payment_status, payment_method)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Confirmed', ?, ?)
    ''', (current_user['id'], facility_id, court_id, booking_date, start_time, end_time, total_price, payment_status, payment_method))

    booking = query_db('''
        SELECT b.*, f.name as facility_name, f.location, f.image as facility_image,
               c.name as court_name, c.sport_type,
               u.full_name as owner_name, u.email as owner_email
        FROM bookings b
        JOIN facilities f ON b.facility_id = f.id
        JOIN courts c ON b.court_id = c.id
        JOIN users u ON f.owner_id = u.id
        WHERE b.id = ?
    ''', (booking_id,), one=True)

    return jsonify({"message": "Booking confirmed successfully!", "booking": dict_from_row(booking)}), 201

@app.route('/api/bookings', methods=['GET'])
@require_auth()
def get_user_bookings(current_user):
    bookings = dicts_from_rows(query_db('''
        SELECT b.*, f.name as facility_name, f.location, f.image as facility_image,
               c.name as court_name, c.sport_type,
               u.full_name as owner_name, u.email as owner_email,
               (SELECT id FROM reviews WHERE booking_id = b.id) as review_id
        FROM bookings b
        JOIN facilities f ON b.facility_id = f.id
        JOIN courts c ON b.court_id = c.id
        JOIN users u ON f.owner_id = u.id
        WHERE b.user_id = ?
        ORDER BY b.booking_date DESC, b.start_time DESC
    ''', (current_user['id'],)))

    today = datetime.date.today().isoformat()
    for b in bookings:
        b['can_cancel'] = (b['status'] == 'Confirmed' and b['booking_date'] >= today)

    return jsonify({"bookings": bookings}), 200

@app.route('/api/bookings/<int:booking_id>/cancel', methods=['PUT'])
@require_auth()
def cancel_booking(current_user, booking_id):
    booking = query_db("SELECT * FROM bookings WHERE id = ?", (booking_id,), one=True)
    if not booking:
        return jsonify({"error": "Booking not found."}), 404

    b_dict = dict_from_row(booking)
    if b_dict['user_id'] != current_user['id'] and current_user['role'] not in ['admin', 'owner']:
        return jsonify({"error": "Unauthorized"}), 403

    today = datetime.date.today().isoformat()
    if b_dict['booking_date'] < today:
        return jsonify({"error": "Past bookings cannot be cancelled."}), 400

    execute_db("UPDATE bookings SET status = 'Cancelled' WHERE id = ?", (booking_id,))
    return jsonify({"message": "Booking cancelled successfully. Slot is now available."}), 200

# --- USER PROFILE & REVIEWS ---

@app.route('/api/profile', methods=['GET', 'PUT'])
@require_auth()
def user_profile(current_user):
    if request.method == 'GET':
        return jsonify({"user": current_user}), 200

    data = request.json or {}
    full_name = data.get('full_name', '').strip() or current_user['full_name']
    avatar = data.get('avatar', '').strip() or current_user['avatar']
    new_password = data.get('new_password', '').strip()

    if new_password:
        current_password = data.get('current_password', '')
        user_db = query_db("SELECT password_hash FROM users WHERE id = ?", (current_user['id'],), one=True)
        if not check_password_hash(user_db['password_hash'], current_password):
            return jsonify({"error": "Incorrect current password."}), 400
        new_hash = generate_password_hash(new_password)
        execute_db("UPDATE users SET full_name = ?, avatar = ?, password_hash = ? WHERE id = ?", (full_name, avatar, new_hash, current_user['id']))
    else:
        execute_db("UPDATE users SET full_name = ?, avatar = ? WHERE id = ?", (full_name, avatar, current_user['id']))

    updated_user = query_db("SELECT id, full_name, email, role, avatar, is_verified, is_banned FROM users WHERE id = ?", (current_user['id'],), one=True)
    return jsonify({"message": "Profile updated successfully!", "user": dict_from_row(updated_user)}), 200

@app.route('/api/reviews', methods=['POST'])
@require_auth()
def create_review(current_user):
    data = request.json or {}
    booking_id = data.get('booking_id')
    rating = data.get('rating')
    comment = data.get('comment', '').strip()
    image = data.get('image', '').strip()

    if not booking_id or not rating or not comment:
        return jsonify({"error": "Rating and comment are required."}), 400

    booking = query_db("SELECT * FROM bookings WHERE id = ?", (booking_id,), one=True)
    if not booking:
        return jsonify({"error": "Booking not found."}), 404

    b_dict = dict_from_row(booking)
    if b_dict['user_id'] != current_user['id']:
        return jsonify({"error": "Unauthorized"}), 403

    existing = query_db("SELECT id FROM reviews WHERE booking_id = ?", (booking_id,), one=True)
    if existing:
        return jsonify({"error": "You have already reviewed this booking."}), 400

    execute_db('''
        INSERT INTO reviews (user_id, facility_id, booking_id, rating, comment, image)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (current_user['id'], b_dict['facility_id'], booking_id, rating, comment, image))

    return jsonify({"message": "Thank you! Review submitted successfully."}), 201

# --- FACILITY OWNER ENDPOINTS ---

@app.route('/api/owner/dashboard', methods=['GET'])
@require_auth(allowed_roles=['owner', 'admin'])
def owner_dashboard(current_user):
    owner_id = current_user['id']

    facilities = dicts_from_rows(query_db("SELECT id FROM facilities WHERE owner_id = ?", (owner_id,)))
    facility_ids = [f['id'] for f in facilities]

    if not facility_ids:
        return jsonify({
            "total_facilities": 0,
            "active_courts": 0,
            "total_bookings": 0,
            "total_earnings": 0.0,
            "chart_data": {"daily": [], "weekly": [], "monthly": []}
        }), 200

    placeholders = ",".join(["?"] * len(facility_ids))

    active_courts_cnt = query_db(f"SELECT COUNT(*) as count FROM courts WHERE facility_id IN ({placeholders}) AND is_active = 1", facility_ids, one=True)['count']
    
    bookings_stats = query_db(f'''
        SELECT COUNT(*) as count, COALESCE(SUM(total_price), 0.0) as earnings
        FROM bookings
        WHERE facility_id IN ({placeholders}) AND status = 'Confirmed'
    ''', facility_ids, one=True)

    # Simplified analytics chart data
    chart_data = {
        "daily": [
            {"day": "Mon", "bookings": 4, "earnings": 2400},
            {"day": "Tue", "bookings": 6, "earnings": 3600},
            {"day": "Wed", "bookings": 5, "earnings": 3000},
            {"day": "Thu", "bookings": 8, "earnings": 4800},
            {"day": "Fri", "bookings": 10, "earnings": 6500},
            {"day": "Sat", "bookings": 15, "earnings": 10500},
            {"day": "Sun", "bookings": 14, "earnings": 9800}
        ],
        "popular_sports": [
            {"sport": "Football", "bookings": 24},
            {"sport": "Cricket", "bookings": 20},
            {"sport": "Badminton", "bookings": 18},
            {"sport": "Tennis", "bookings": 12}
        ]
    }

    return jsonify({
        "total_facilities": len(facility_ids),
        "active_courts": active_courts_cnt,
        "total_bookings": bookings_stats['count'],
        "total_earnings": bookings_stats['earnings'],
        "chart_data": chart_data
    }), 200

@app.route('/api/owner/facilities', methods=['GET', 'POST'])
@require_auth(allowed_roles=['owner', 'admin'])
def owner_facilities(current_user):
    if request.method == 'GET':
        facilities = dicts_from_rows(query_db("SELECT * FROM facilities WHERE owner_id = ? ORDER BY created_at DESC", (current_user['id'],)))
        for f in facilities:
            f['sports_list'] = [s.strip() for s in f['sports'].split(',') if s.strip()]
            f['amenities_list'] = [a.strip() for a in f['amenities'].split(',') if a.strip()]
        return jsonify({"facilities": facilities}), 200

    data = request.json or {}
    name = data.get('name', '').strip()
    description = data.get('description', '').strip()
    address = data.get('address', '').strip()
    location = data.get('location', '').strip()
    sports = data.get('sports', '').strip()
    amenities = data.get('amenities', '').strip()
    image = data.get('image', '').strip() or 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800'

    if not name or not description or not address or not location or not sports:
        return jsonify({"error": "Required fields missing."}), 400

    facility_id = execute_db('''
        INSERT INTO facilities (owner_id, name, description, address, location, sports, amenities, image, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
    ''', (current_user['id'], name, description, address, location, sports, amenities, image))

    return jsonify({"message": "Facility submitted! Awaiting admin approval.", "facility_id": facility_id}), 201

@app.route('/api/owner/facilities/<int:facility_id>', methods=['PUT', 'DELETE'])
@require_auth(allowed_roles=['owner', 'admin'])
def owner_facility_detail(current_user, facility_id):
    facility = query_db("SELECT * FROM facilities WHERE id = ?", (facility_id,), one=True)
    if not facility:
        return jsonify({"error": "Facility not found"}), 404

    f_dict = dict_from_row(facility)
    if f_dict['owner_id'] != current_user['id'] and current_user['role'] != 'admin':
        return jsonify({"error": "Unauthorized"}), 403

    if request.method == 'DELETE':
        execute_db("DELETE FROM facilities WHERE id = ?", (facility_id,))
        return jsonify({"message": "Facility deleted successfully."}), 200

    data = request.json or {}
    name = data.get('name', '').strip() or f_dict['name']
    description = data.get('description', '').strip() or f_dict['description']
    address = data.get('address', '').strip() or f_dict['address']
    location = data.get('location', '').strip() or f_dict['location']
    sports = data.get('sports', '').strip() or f_dict['sports']
    amenities = data.get('amenities', '').strip() or f_dict['amenities']
    image = data.get('image', '').strip() or f_dict['image']

    execute_db('''
        UPDATE facilities
        SET name = ?, description = ?, address = ?, location = ?, sports = ?, amenities = ?, image = ?
        WHERE id = ?
    ''', (name, description, address, location, sports, amenities, image, facility_id))

    return jsonify({"message": "Facility updated successfully."}), 200

@app.route('/api/owner/courts', methods=['GET', 'POST'])
@require_auth(allowed_roles=['owner', 'admin'])
def owner_courts(current_user):
    if request.method == 'GET':
        facility_id = request.args.get('facility_id')
        if facility_id:
            courts = dicts_from_rows(query_db('''
                SELECT c.*, f.name as facility_name
                FROM courts c
                JOIN facilities f ON c.facility_id = f.id
                WHERE c.facility_id = ? AND f.owner_id = ?
            ''', (facility_id, current_user['id'])))
        else:
            courts = dicts_from_rows(query_db('''
                SELECT c.*, f.name as facility_name
                FROM courts c
                JOIN facilities f ON c.facility_id = f.id
                WHERE f.owner_id = ?
            ''', (current_user['id'],)))
        return jsonify({"courts": courts}), 200

    data = request.json or {}
    facility_id = data.get('facility_id')
    name = data.get('name', '').strip()
    sport_type = data.get('sport_type', '').strip()
    price_per_hour = data.get('price_per_hour')
    opening_time = data.get('opening_time', '06:00')
    closing_time = data.get('closing_time', '22:00')

    if not facility_id or not name or not sport_type or price_per_hour is None:
        return jsonify({"error": "All fields are required."}), 400

    facility = query_db("SELECT owner_id FROM facilities WHERE id = ?", (facility_id,), one=True)
    if not facility or (facility['owner_id'] != current_user['id'] and current_user['role'] != 'admin'):
        return jsonify({"error": "Unauthorized"}), 403

    court_id = execute_db('''
        INSERT INTO courts (facility_id, name, sport_type, price_per_hour, opening_time, closing_time, is_active)
        VALUES (?, ?, ?, ?, ?, ?, 1)
    ''', (facility_id, name, sport_type, price_per_hour, opening_time, closing_time))

    return jsonify({"message": "Court added successfully!", "court_id": court_id}), 201

@app.route('/api/owner/courts/<int:court_id>', methods=['PUT', 'DELETE'])
@require_auth(allowed_roles=['owner', 'admin'])
def owner_court_detail(current_user, court_id):
    court = query_db('''
        SELECT c.*, f.owner_id
        FROM courts c
        JOIN facilities f ON c.facility_id = f.id
        WHERE c.id = ?
    ''', (court_id,), one=True)

    if not court:
        return jsonify({"error": "Court not found"}), 404

    c_dict = dict_from_row(court)
    if c_dict['owner_id'] != current_user['id'] and current_user['role'] != 'admin':
        return jsonify({"error": "Unauthorized"}), 403

    if request.method == 'DELETE':
        execute_db("DELETE FROM courts WHERE id = ?", (court_id,))
        return jsonify({"message": "Court deleted successfully."}), 200

    data = request.json or {}
    name = data.get('name', c_dict['name'])
    sport_type = data.get('sport_type', c_dict['sport_type'])
    price_per_hour = data.get('price_per_hour', c_dict['price_per_hour'])
    opening_time = data.get('opening_time', c_dict['opening_time'])
    closing_time = data.get('closing_time', c_dict['closing_time'])
    is_active = data.get('is_active', c_dict['is_active'])

    execute_db('''
        UPDATE courts
        SET name = ?, sport_type = ?, price_per_hour = ?, opening_time = ?, closing_time = ?, is_active = ?
        WHERE id = ?
    ''', (name, sport_type, price_per_hour, opening_time, closing_time, is_active, court_id))

    return jsonify({"message": "Court updated successfully."}), 200

@app.route('/api/owner/block-slot', methods=['POST'])
@require_auth(allowed_roles=['owner', 'admin'])
def owner_block_slot(current_user):
    data = request.json or {}
    court_id = data.get('court_id')
    booking_date = data.get('booking_date')
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    reason = data.get('reason', 'Maintenance').strip()

    if not court_id or not booking_date or not start_time or not end_time:
        return jsonify({"error": "Missing parameters."}), 400

    block_id = execute_db('''
        INSERT INTO blocked_slots (court_id, booking_date, start_time, end_time, reason)
        VALUES (?, ?, ?, ?, ?)
    ''', (court_id, booking_date, start_time, end_time, reason))

    return jsonify({"message": "Time slot blocked successfully.", "block_id": block_id}), 201

@app.route('/api/owner/bookings', methods=['GET'])
@require_auth(allowed_roles=['owner', 'admin'])
def owner_bookings(current_user):
    bookings = dicts_from_rows(query_db('''
        SELECT b.*, f.name as facility_name, c.name as court_name, c.sport_type,
               u.full_name as user_name, u.email as user_email
        FROM bookings b
        JOIN facilities f ON b.facility_id = f.id
        JOIN courts c ON b.court_id = c.id
        JOIN users u ON b.user_id = u.id
        WHERE f.owner_id = ?
        ORDER BY b.booking_date DESC, b.start_time DESC
    ''', (current_user['id'],)))

    return jsonify({"bookings": bookings}), 200

# --- ADMIN ENDPOINTS ---

@app.route('/api/admin/dashboard', methods=['GET'])
@require_auth(allowed_roles=['admin'])
def admin_dashboard(current_user):
    total_users = query_db("SELECT COUNT(*) as cnt FROM users WHERE role = 'user'", one=True)['cnt']
    total_owners = query_db("SELECT COUNT(*) as cnt FROM users WHERE role = 'owner'", one=True)['cnt']
    total_facilities = query_db("SELECT COUNT(*) as cnt FROM facilities", one=True)['cnt']
    pending_facilities = query_db("SELECT COUNT(*) as cnt FROM facilities WHERE status = 'Pending'", one=True)['cnt']
    total_bookings = query_db("SELECT COUNT(*) as cnt FROM bookings", one=True)['cnt']
    active_courts = query_db("SELECT COUNT(*) as cnt FROM courts WHERE is_active = 1", one=True)['cnt']
    total_earnings = query_db("SELECT COALESCE(SUM(total_price), 0.0) as sum FROM bookings WHERE status = 'Confirmed'", one=True)['sum']

    chart_data = {
        "monthly_activity": [
            {"month": "May", "bookings": 45, "registrations": 12},
            {"month": "Jun", "bookings": 80, "registrations": 25},
            {"month": "Jul", "bookings": 110, "registrations": 30},
            {"month": "Aug", "bookings": 140, "registrations": 42},
            {"month": "Sep", "bookings": 190, "registrations": 55}
        ]
    }

    return jsonify({
        "stats": {
            "total_users": total_users,
            "total_owners": total_owners,
            "total_facilities": total_facilities,
            "pending_facilities": pending_facilities,
            "total_bookings": total_bookings,
            "active_courts": active_courts,
            "total_earnings": total_earnings
        },
        "chart_data": chart_data
    }), 200

@app.route('/api/admin/facilities/pending', methods=['GET'])
@require_auth(allowed_roles=['admin'])
def admin_pending_facilities(current_user):
    facilities = dicts_from_rows(query_db('''
        SELECT f.*, u.full_name as owner_name, u.email as owner_email
        FROM facilities f
        JOIN users u ON f.owner_id = u.id
        WHERE f.status = 'Pending'
        ORDER BY f.created_at ASC
    '''))
    return jsonify({"facilities": facilities}), 200

@app.route('/api/admin/facilities/<int:facility_id>/approve', methods=['PUT'])
@require_auth(allowed_roles=['admin'])
def admin_approve_facility(current_user, facility_id):
    execute_db("UPDATE facilities SET status = 'Approved', rejection_comment = '' WHERE id = ?", (facility_id,))
    return jsonify({"message": "Facility approved successfully and is now visible to users!"}), 200

@app.route('/api/admin/facilities/<int:facility_id>/reject', methods=['PUT'])
@require_auth(allowed_roles=['admin'])
def admin_reject_facility(current_user, facility_id):
    data = request.json or {}
    comment = data.get('rejection_comment', 'Facility details do not meet requirements.').strip()
    execute_db("UPDATE facilities SET status = 'Rejected', rejection_comment = ? WHERE id = ?", (comment, facility_id))
    return jsonify({"message": "Facility rejected."}), 200

@app.route('/api/admin/users', methods=['GET'])
@require_auth(allowed_roles=['admin'])
def admin_users(current_user):
    search = request.args.get('search', '').strip()
    role = request.args.get('role', '').strip()
    status = request.args.get('status', '').strip()

    query = "SELECT id, full_name, email, role, is_verified, is_banned, created_at FROM users WHERE 1=1"
    params = []

    if search:
        query += " AND (full_name LIKE ? OR email LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])

    if role:
        query += " AND role = ?"
        params.append(role)

    if status == 'banned':
        query += " AND is_banned = 1"
    elif status == 'active':
        query += " AND is_banned = 0"

    query += " ORDER BY created_at DESC"
    users = dicts_from_rows(query_db(query, params))

    return jsonify({"users": users}), 200

@app.route('/api/admin/users/<int:user_id>/ban', methods=['PUT'])
@require_auth(allowed_roles=['admin'])
def admin_ban_user(current_user, user_id):
    if user_id == current_user['id']:
        return jsonify({"error": "Cannot ban yourself."}), 400
    execute_db("UPDATE users SET is_banned = 1 WHERE id = ?", (user_id,))
    return jsonify({"message": "User suspended successfully."}), 200

@app.route('/api/admin/users/<int:user_id>/unban', methods=['PUT'])
@require_auth(allowed_roles=['admin'])
def admin_unban_user(current_user, user_id):
    execute_db("UPDATE users SET is_banned = 0 WHERE id = ?", (user_id,))
    return jsonify({"message": "User reactivated successfully."}), 200

if __name__ == '__main__':
    print("Starting QuickCourt Flask Backend Server on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
