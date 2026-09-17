import os
import sys
from werkzeug.security import generate_password_hash
from database import init_db, get_db_connection, execute_db, query_db

def seed_database():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Clear existing data for fresh seed
    cursor.execute("DELETE FROM reviews")
    cursor.execute("DELETE FROM bookings")
    cursor.execute("DELETE FROM blocked_slots")
    cursor.execute("DELETE FROM courts")
    cursor.execute("DELETE FROM facilities")
    cursor.execute("DELETE FROM users")
    conn.commit()

    # Create Users
    admin_pass = generate_password_hash("Admin@123")
    owner_pass = generate_password_hash("Owner@123")
    user_pass = generate_password_hash("User@123")

    cursor.execute('''
        INSERT INTO users (full_name, email, password_hash, role, avatar, is_verified, is_banned)
        VALUES (?, ?, ?, ?, ?, 1, 0)
    ''', ("QuickCourt Admin", "admin@quickcourt.com", admin_pass, "admin", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"))
    admin_id = cursor.lastrowid

    cursor.execute('''
        INSERT INTO users (full_name, email, password_hash, role, avatar, is_verified, is_banned)
        VALUES (?, ?, ?, ?, ?, 1, 0)
    ''', ("Rajesh Patel (Owner)", "owner@quickcourt.com", owner_pass, "owner", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"))
    owner_id = cursor.lastrowid

    cursor.execute('''
        INSERT INTO users (full_name, email, password_hash, role, avatar, is_verified, is_banned)
        VALUES (?, ?, ?, ?, ?, 1, 0)
    ''', ("Aarav Sharma", "user@quickcourt.com", user_pass, "user", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"))
    user_id = cursor.lastrowid

    # Add a second demo owner and second user
    cursor.execute('''
        INSERT INTO users (full_name, email, password_hash, role, avatar, is_verified, is_banned)
        VALUES (?, ?, ?, ?, ?, 1, 0)
    ''', ("Priya Shah", "owner2@quickcourt.com", owner_pass, "owner", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"))
    owner2_id = cursor.lastrowid

    cursor.execute('''
        INSERT INTO users (full_name, email, password_hash, role, avatar, is_verified, is_banned)
        VALUES (?, ?, ?, ?, ?, 1, 0)
    ''', ("Rohan Mehta", "rohan@quickcourt.com", user_pass, "user", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"))
    user2_id = cursor.lastrowid

    conn.commit()

    # Facilities in Ahmedabad
    facilities_data = [
        {
            "owner_id": owner_id,
            "name": "SBR Turf & Sports Arena",
            "description": "Premier FIFA-grade synthetic turf for Football and Box Cricket with floodlights and parking.",
            "address": "Opposite Rajpath Club, Sindhu Bhavan Road",
            "location": "Sindhu Bhavan Road, Ahmedabad",
            "sports": "Football, Cricket",
            "amenities": "Floodlights, Changing Rooms, Free Parking, Refreshment Kiosk, Shower",
            "image": "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800",
            "status": "Approved"
        },
        {
            "owner_id": owner_id,
            "name": "Bodakdev Badminton & Smash Zone",
            "description": "Air-conditioned wooden indoor courts with professional BWF approved mat surfaces.",
            "address": "Near Judges Bungalow Cross Road, Bodakdev",
            "location": "Bodakdev, Ahmedabad",
            "sports": "Badminton, Table Tennis",
            "amenities": "AC, Pro Shop, Locker Room, Water Cooler, Equipment Rental",
            "image": "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800",
            "status": "Approved"
        },
        {
            "owner_id": owner_id,
            "name": "SG Highway Multi-Sport Complex",
            "description": "State-of-the-art sports complex featuring basketball courts, cricket nets, and football field.",
            "address": "Near ISKCON Temple, SG Highway",
            "location": "SG Highway, Ahmedabad",
            "sports": "Cricket, Basketball, Football",
            "amenities": "Floodlights, Grandstand Seating, Parking, Cafeteria, First Aid",
            "image": "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
            "status": "Approved"
        },
        {
            "owner_id": owner_id,
            "name": "Satellite Tennis Club",
            "description": "High performance synthetic clay and hard courts for singles and doubles matches.",
            "address": "Near Star Bazaar, Satellite",
            "location": "Satellite, Ahmedabad",
            "sports": "Tennis",
            "amenities": "Coach Available, Floodlights, Ball Machine, Lounge Area",
            "image": "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800",
            "status": "Approved"
        },
        {
            "owner_id": owner2_id,
            "name": "Prahlad Nagar Sports Hub",
            "description": "Modern multi-tier indoor arena for Badminton, Table Tennis, and Pickleball.",
            "address": "Opp. Prahlad Nagar Garden, Anand Nagar Road",
            "location": "Prahlad Nagar, Ahmedabad",
            "sports": "Badminton, Table Tennis",
            "amenities": "Synthetic Flooring, AC, Snack Bar, Wifi, Lockers",
            "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
            "status": "Approved"
        },
        {
            "owner_id": owner2_id,
            "name": "Vastrapur Lake Sports Pavilion",
            "description": "Scenic open air basketball and tennis courts overlooking Vastrapur Lake park.",
            "address": "Near Vastrapur Lake, Vastrapur",
            "location": "Vastrapur, Ahmedabad",
            "sports": "Basketball, Tennis",
            "amenities": "Night Lighting, Refreshment Stall, Restrooms, Parking",
            "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
            "status": "Approved"
        },
        {
            "owner_id": owner_id,
            "name": "Drive-In Smash & Spin Arena",
            "description": "Indoor air-conditioned arena specializing in competitive Table Tennis & Badminton.",
            "address": "Near Drive-In Cinema, Thaltej",
            "location": "Drive-In Road, Ahmedabad",
            "sports": "Table Tennis, Badminton",
            "amenities": "Stiga Tables, Yonex Nets, Air Conditioning, Beverage Station",
            "image": "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=800",
            "status": "Approved"
        },
        {
            "owner_id": owner2_id,
            "name": "Navrangpura Turf Ground",
            "description": "Popular box cricket and futsal arena with shock-pad artificial turf in heart of the city.",
            "address": "Near Commerce Six Roads, Navrangpura",
            "location": "Navrangpura, Ahmedabad",
            "sports": "Cricket, Football",
            "amenities": "LED Lights, Seating Area, Changing Room, Canteen",
            "image": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800",
            "status": "Approved"
        },
        {
            "owner_id": owner_id,
            "name": "Bhopal Eco Turf & Courts",
            "description": "Newly constructed eco-friendly sports hub with synthetic turf and pickleball courts.",
            "address": "Near SP Ring Road, Bopal",
            "location": "Bopal, Ahmedabad",
            "sports": "Football, Tennis",
            "amenities": "EV Charging, Green Pavilion, Floodlights, Locker Room",
            "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800",
            "status": "Pending"
        }
    ]

    facility_ids = []
    for f in facilities_data:
        cursor.execute('''
            INSERT INTO facilities (owner_id, name, description, address, location, sports, amenities, image, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (f["owner_id"], f["name"], f["description"], f["address"], f["location"], f["sports"], f["amenities"], f["image"], f["status"]))
        facility_ids.append(cursor.lastrowid)

    conn.commit()

    # Courts setup for facilities
    courts_data = [
        # Facility 1: SBR Turf (id 1)
        (facility_ids[0], "Court A - Main Football Field", "Football", 1200.0, "06:00", "23:00", 1),
        (facility_ids[0], "Turf B - Box Cricket Pitch 1", "Cricket", 800.0, "06:00", "23:00", 1),
        (facility_ids[0], "Turf C - Box Cricket Pitch 2", "Cricket", 800.0, "06:00", "23:00", 1),

        # Facility 2: Bodakdev Badminton (id 2)
        (facility_ids[1], "Wooden Court 1 (BWF Standard)", "Badminton", 450.0, "06:00", "22:00", 1),
        (facility_ids[1], "Wooden Court 2 (BWF Standard)", "Badminton", 450.0, "06:00", "22:00", 1),
        (facility_ids[1], "TT Arena - Table 1", "Table Tennis", 300.0, "07:00", "21:00", 1),

        # Facility 3: SG Highway Complex (id 3)
        (facility_ids[2], "Outdoor Basketball Court 1", "Basketball", 600.0, "06:00", "22:00", 1),
        (facility_ids[2], "Floodlit Cricket Net 1", "Cricket", 500.0, "06:00", "22:00", 1),

        # Facility 4: Satellite Tennis Club (id 4)
        (facility_ids[3], "Clay Court 1 (Singles/Doubles)", "Tennis", 750.0, "06:00", "21:00", 1),
        (facility_ids[3], "Synthetic Hard Court 2", "Tennis", 700.0, "06:00", "21:00", 1),

        # Facility 5: Prahlad Nagar Hub (id 5)
        (facility_ids[4], "Badminton Synthetic Court 1", "Badminton", 400.0, "06:00", "22:00", 1),
        (facility_ids[4], "TT Pro Table A", "Table Tennis", 250.0, "07:00", "22:00", 1),

        # Facility 6: Vastrapur Pavilion (id 6)
        (facility_ids[5], "Main Basketball Court", "Basketball", 550.0, "06:00", "22:00", 1),
        (facility_ids[5], "Tennis Court 1", "Tennis", 650.0, "06:00", "21:00", 1),

        # Facility 7: Drive-In Arena (id 7)
        (facility_ids[6], "Pro Table Tennis Table 1", "Table Tennis", 280.0, "08:00", "22:00", 1),
        (facility_ids[6], "Air-Conditioned Badminton Court", "Badminton", 500.0, "06:00", "22:00", 1),

        # Facility 8: Navrangpura Turf (id 8)
        (facility_ids[7], "Futsal & Box Cricket Field 1", "Football", 1000.0, "06:00", "23:00", 1),
        (facility_ids[7], "Futsal & Box Cricket Field 2", "Cricket", 900.0, "06:00", "23:00", 1)
    ]

    court_ids = []
    for c in courts_data:
        cursor.execute('''
            INSERT INTO courts (facility_id, name, sport_type, price_per_hour, opening_time, closing_time, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', c)
        court_ids.append(cursor.lastrowid)

    conn.commit()

    # Sample Bookings
    bookings_sample = [
        (user_id, facility_ids[0], court_ids[0], "2026-09-20", "18:00", "19:00", 1200.0, "Confirmed", "Paid (Demo)"),
        (user_id, facility_ids[1], court_ids[3], "2026-09-21", "07:00", "08:00", 450.0, "Confirmed", "Paid (Demo)"),
        (user2_id, facility_ids[2], court_ids[6], "2026-09-18", "19:00", "20:00", 600.0, "Completed", "Paid (Demo)"),
        (user2_id, facility_ids[3], court_ids[8], "2026-09-19", "08:00", "09:00", 750.0, "Confirmed", "Paid (Demo)")
    ]

    booking_ids = []
    for b in bookings_sample:
        cursor.execute('''
            INSERT INTO bookings (user_id, facility_id, court_id, booking_date, start_time, end_time, total_price, status, payment_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', b)
        booking_ids.append(cursor.lastrowid)

    conn.commit()

    # Sample Reviews
    reviews_sample = [
        (user_id, facility_ids[0], booking_ids[0], 5, "Amazing FIFA turf! Great floodlights and very well maintained."),
        (user2_id, facility_ids[2], booking_ids[2], 4, "Excellent basketball court with great grip and clean facilities."),
        (user2_id, facility_ids[3], booking_ids[3], 5, "Best tennis clay court in Satellite area. Very helpful staff!")
    ]

    for r in reviews_sample:
        cursor.execute('''
            INSERT INTO reviews (user_id, facility_id, booking_id, rating, comment)
            VALUES (?, ?, ?, ?, ?)
        ''', r)

    # Sample Blocked Slots
    cursor.execute('''
        INSERT INTO blocked_slots (court_id, booking_date, start_time, end_time, reason)
        VALUES (?, '2026-09-22', '14:00', '16:00', 'Routine Turf Cleaning & Maintenance')
    ''', (court_ids[0],))

    conn.commit()
    conn.close()
    print("Database seeded successfully with demo accounts, facilities, courts, bookings, and reviews!")

if __name__ == '__main__':
    seed_database()
