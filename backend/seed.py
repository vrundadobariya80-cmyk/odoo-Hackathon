import os
import sys
from werkzeug.security import generate_password_hash
from database import init_db, get_db_connection, execute_db, query_db

def seed_database():
    init_db(skip_auto_seed=True)
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

    # Authentic Facilities across Major Indian Cities
    facilities_data = [
        # Mumbai
        {
            "owner_id": owner_id,
            "name": "Andheri Sports Complex & Turf",
            "description": "Multi-purpose Olympic standard indoor and outdoor venue with FIFA turf and synthetic courts.",
            "address": "Veera Desai Road, Andheri West",
            "location": "Andheri West, Mumbai",
            "city": "Mumbai",
            "sports": "Badminton, Football, Tennis",
            "amenities": "Floodlights, Changing Rooms, Free Parking, Shower, AC",
            "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80",
            "latitude": 19.1363,
            "longitude": 72.8354,
            "status": "Approved"
        },
        {
            "owner_id": owner2_id,
            "name": "Bandra Turf & Box Cricket Club",
            "description": "Premium rooftop box cricket and futsal turf overlooking Bandra skyline with high lux LED lighting.",
            "address": "Near Hill Road, Bandra West",
            "location": "Bandra West, Mumbai",
            "city": "Mumbai",
            "sports": "Cricket, Football",
            "amenities": "Floodlights, Locker Room, Refreshment Kiosk, Equipment Rental",
            "image": "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1000&q=80",
            "latitude": 19.0596,
            "longitude": 72.8295,
            "status": "Approved"
        },

        # Bengaluru
        {
            "owner_id": owner_id,
            "name": "Play Arena Sarjapur",
            "description": "Bengaluru's premier 10-acre multi-sport complex offering BWF wooden badminton courts and 7-a-side turfs.",
            "address": "Central Jail Road, Sarjapur Road",
            "location": "Sarjapur Road, Bengaluru",
            "city": "Bengaluru",
            "sports": "Badminton, Football, Basketball",
            "amenities": "Pro Shop, Cafeteria, Shower, Equipment Rental, Parking",
            "image": "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=80",
            "latitude": 12.9081,
            "longitude": 77.6710,
            "status": "Approved"
        },
        {
            "owner_id": owner2_id,
            "name": "XLR8 Indoor Sports Arena",
            "description": "State-of-the-art climate-controlled indoor arena for box cricket, futsal, and volleyball.",
            "address": "Hennur Bagalur Main Road, Kothanur",
            "location": "Hennur, Bengaluru",
            "city": "Bengaluru",
            "sports": "Cricket, Football",
            "amenities": "Indoor AC Turf, Canteen, Free Wifi, Changing Rooms",
            "image": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1000&q=80",
            "latitude": 13.0638,
            "longitude": 77.6432,
            "status": "Approved"
        },

        # Delhi NCR
        {
            "owner_id": owner_id,
            "name": "Thyagaraj Sports Complex Arena",
            "description": "Government certified world-class sports complex with international badminton mats and tennis courts.",
            "address": "Near INA Metro Station, INA Colony",
            "location": "INA Colony, Delhi",
            "city": "Delhi NCR",
            "sports": "Badminton, Table Tennis, Tennis",
            "amenities": "Wooden Flooring, AC, Grandstand, Parking, Lockers",
            "image": "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&w=1000&q=80",
            "latitude": 28.5828,
            "longitude": 77.2185,
            "status": "Approved"
        },
        {
            "owner_id": owner2_id,
            "name": "Gurgaon Sports Zone & Futsal Turf",
            "description": "High-intensity artificial turf grounds for box cricket night matches and 5-a-side football.",
            "address": "Sector 56, Golf Course Extension Road",
            "location": "Sector 56, Gurgaon",
            "city": "Delhi NCR",
            "sports": "Football, Cricket",
            "amenities": "Floodlights, Seating Area, Beverage Bar, Washrooms",
            "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80",
            "latitude": 28.4239,
            "longitude": 77.1044,
            "status": "Approved"
        },

        # Pune
        {
            "owner_id": owner_id,
            "name": "Poona Club Sports Complex",
            "description": "Historic sports facility featuring professional clay tennis courts, badminton hall, and cricket practice nets.",
            "address": "Camp Area, Near Pune Station",
            "location": "Camp, Pune",
            "city": "Pune",
            "sports": "Tennis, Badminton, Cricket",
            "amenities": "Coach Available, Lounge, Refreshments, Parking",
            "image": "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=80",
            "latitude": 18.5204,
            "longitude": 73.8767,
            "status": "Approved"
        },
        {
            "owner_id": owner2_id,
            "name": "Baner Turf & Box Cricket Park",
            "description": "Popular youth hangout turf for box cricket leagues and futsal tournaments with evening floodlights.",
            "address": "High Street Road, Baner",
            "location": "Baner, Pune",
            "city": "Pune",
            "sports": "Cricket, Football",
            "amenities": "LED Floodlights, Snack Bar, Changing Rooms",
            "image": "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1000&q=80",
            "latitude": 18.5590,
            "longitude": 73.7868,
            "status": "Approved"
        },

        # Surat
        {
            "owner_id": owner_id,
            "name": "Vesu Multi-Sport Turf",
            "description": "Surat's leading 4th generation shock-absorption turf for box cricket and 6-a-side football matches.",
            "address": "VIP Road, Vesu",
            "location": "Vesu, Surat",
            "city": "Surat",
            "sports": "Cricket, Football",
            "amenities": "Floodlights, Juice Bar, Parking, Shower",
            "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80",
            "latitude": 21.1444,
            "longitude": 72.7711,
            "status": "Approved"
        },

        # Ahmedabad
        {
            "owner_id": owner_id,
            "name": "SBR Turf & Sports Arena",
            "description": "Premier FIFA-grade synthetic turf for Football and Box Cricket with floodlights and parking.",
            "address": "Opposite Rajpath Club, Sindhu Bhavan Road",
            "location": "Sindhu Bhavan Road, Ahmedabad",
            "city": "Ahmedabad",
            "sports": "Football, Cricket",
            "amenities": "Floodlights, Changing Rooms, Free Parking, Refreshment Kiosk, Shower",
            "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80",
            "latitude": 23.0396,
            "longitude": 72.5020,
            "status": "Approved"
        },
        {
            "owner_id": owner_id,
            "name": "Bodakdev Badminton & Smash Zone",
            "description": "Air-conditioned wooden indoor courts with professional BWF approved mat surfaces.",
            "address": "Near Judges Bungalow Cross Road, Bodakdev",
            "location": "Bodakdev, Ahmedabad",
            "city": "Ahmedabad",
            "sports": "Badminton, Table Tennis",
            "amenities": "AC, Pro Shop, Locker Room, Water Cooler, Equipment Rental",
            "image": "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=80",
            "latitude": 23.0384,
            "longitude": 72.5119,
            "status": "Approved"
        },
        {
            "owner_id": owner_id,
            "name": "SG Highway Multi-Sport Complex",
            "description": "State-of-the-art sports complex featuring basketball courts, cricket nets, and football field.",
            "address": "Near ISKCON Temple, SG Highway",
            "location": "SG Highway, Ahmedabad",
            "city": "Ahmedabad",
            "sports": "Cricket, Basketball, Football",
            "amenities": "Floodlights, Grandstand Seating, Parking, Cafeteria, First Aid",
            "image": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1000&q=80",
            "latitude": 23.0274,
            "longitude": 72.5074,
            "status": "Approved"
        },

        # Jaipur
        {
            "owner_id": owner2_id,
            "name": "SMS Stadium Sports Complex",
            "description": "Pink City's iconic sports venue featuring clay tennis courts, badminton hall, and practice nets.",
            "address": "Lalkothi, Tonk Road",
            "location": "Lalkothi, Jaipur",
            "city": "Jaipur",
            "sports": "Tennis, Badminton, Cricket",
            "amenities": "Coach Available, Floodlights, Lockers, Restrooms",
            "image": "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=80",
            "latitude": 26.8924,
            "longitude": 75.8052,
            "status": "Approved"
        },

        # Hyderabad
        {
            "owner_id": owner_id,
            "name": "Gachibowli Indoor Stadium Arena",
            "description": "Modern multi-purpose sports complex with wooden flooring for badminton and basketball.",
            "address": "Old Mumbai Highway, Gachibowli",
            "location": "Gachibowli, Hyderabad",
            "city": "Hyderabad",
            "sports": "Badminton, Basketball",
            "amenities": "AC, Changing Rooms, Parking, Cafe",
            "image": "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80",
            "latitude": 17.4435,
            "longitude": 78.3486,
            "status": "Approved"
        }
    ]

    facility_ids = []
    for f in facilities_data:
        cursor.execute('''
            INSERT INTO facilities (owner_id, name, description, address, location, city, sports, amenities, image, latitude, longitude, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (f["owner_id"], f["name"], f["description"], f["address"], f["location"], f["city"], f["sports"], f["amenities"], f["image"], f["latitude"], f["longitude"], f["status"]))
        facility_ids.append(cursor.lastrowid)

    conn.commit()

    # Courts setup for facilities
    courts_data = [
        # Facility 1: Andheri (Mumbai)
        (facility_ids[0], "Court 1 - Synthetic Badminton", "Badminton", 550.0, "06:00", "22:00", 1),
        (facility_ids[0], "Turf A - FIFA Football Pitch", "Football", 1500.0, "06:00", "23:00", 1),

        # Facility 2: Bandra (Mumbai)
        (facility_ids[1], "Rooftop Box Cricket Turf 1", "Cricket", 1200.0, "06:00", "23:00", 1),
        (facility_ids[1], "Futsal Arena 1", "Football", 1300.0, "06:00", "23:00", 1),

        # Facility 3: Play Arena (Bengaluru)
        (facility_ids[2], "BWF Wooden Court 1", "Badminton", 500.0, "06:00", "22:00", 1),
        (facility_ids[2], "7-a-side Football Turf", "Football", 1600.0, "06:00", "23:00", 1),

        # Facility 4: XLR8 (Bengaluru)
        (facility_ids[3], "Indoor Cricket Net 1", "Cricket", 900.0, "06:00", "22:00", 1),

        # Facility 5: Thyagaraj (Delhi)
        (facility_ids[4], "Badminton Court 1", "Badminton", 450.0, "06:00", "21:00", 1),
        (facility_ids[4], "Pro TT Table 1", "Table Tennis", 300.0, "07:00", "21:00", 1),

        # Facility 6: Gurgaon Sports Zone (Delhi NCR)
        (facility_ids[5], "Box Cricket Arena 1", "Cricket", 1000.0, "06:00", "23:00", 1),

        # Facility 7: Poona Club (Pune)
        (facility_ids[6], "Clay Tennis Court 1", "Tennis", 800.0, "06:00", "21:00", 1),

        # Facility 8: Baner Turf (Pune)
        (facility_ids[7], "Futsal & Cricket Field 1", "Cricket", 950.0, "06:00", "23:00", 1),

        # Facility 9: Vesu Turf (Surat)
        (facility_ids[8], "Vesu Turf Box Cricket 1", "Cricket", 900.0, "06:00", "23:00", 1),

        # Facility 10: SBR Turf (Ahmedabad)
        (facility_ids[9], "Court A - Main Football Field", "Football", 1200.0, "06:00", "23:00", 1),
        (facility_ids[9], "Turf B - Box Cricket Pitch 1", "Cricket", 800.0, "06:00", "23:00", 1),

        # Facility 11: Bodakdev (Ahmedabad)
        (facility_ids[10], "Wooden Court 1 (BWF Standard)", "Badminton", 450.0, "06:00", "22:00", 1),
        (facility_ids[10], "TT Arena - Table 1", "Table Tennis", 300.0, "07:00", "21:00", 1),

        # Facility 12: SG Highway (Ahmedabad)
        (facility_ids[11], "Outdoor Basketball Court 1", "Basketball", 600.0, "06:00", "22:00", 1),

        # Facility 13: SMS Stadium (Jaipur)
        (facility_ids[12], "Clay Tennis Court 1", "Tennis", 750.0, "06:00", "21:00", 1),

        # Facility 14: Gachibowli (Hyderabad)
        (facility_ids[13], "Badminton Court 1", "Badminton", 500.0, "06:00", "22:00", 1)
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
        (user_id, facility_ids[0], court_ids[0], "2026-10-10", "18:00", "19:00", 550.0, "Confirmed", "Paid (Online)", "UPI Instant"),
        (user_id, facility_ids[2], court_ids[4], "2026-10-11", "07:00", "08:00", 500.0, "Confirmed", "Paid (Online)", "Credit / Debit Card"),
        (user2_id, facility_ids[9], court_ids[10], "2026-10-08", "19:00", "20:00", 1200.0, "Completed", "Paid (Online)", "UPI Instant")
    ]

    booking_ids = []
    for b in bookings_sample:
        cursor.execute('''
            INSERT INTO bookings (user_id, facility_id, court_id, booking_date, start_time, end_time, total_price, status, payment_status, payment_method)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', b)
        booking_ids.append(cursor.lastrowid)

    conn.commit()

    # Sample Reviews
    reviews_sample = [
        (user_id, facility_ids[0], booking_ids[0], 5, "Amazing FIFA turf in Andheri West! Great floodlights and clean facilities.", "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80"),
        (user2_id, facility_ids[2], booking_ids[1], 5, "Play Arena Sarjapur has top class wooden badminton courts!", "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80")
    ]

    for r in reviews_sample:
        cursor.execute('''
            INSERT INTO reviews (user_id, facility_id, booking_id, rating, comment, image)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', r)

    conn.commit()
    conn.close()
    print("Database seeded successfully with authentic pan-India sports venues!")

if __name__ == '__main__':
    seed_database()
