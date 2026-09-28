import os
import time
from playwright.sync_api import sync_playwright

def capture_screenshots():
    base_dir = os.path.abspath(os.path.dirname(__file__))
    output_dir = os.path.join(base_dir, "presentation_assets")
    os.makedirs(output_dir, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        # 16:9 high resolution viewport
        context = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1.5)
        page = context.new_page()

        # -------------------------------------------------------------
        # Screenshot 1: Login Page (Admin view)
        # -------------------------------------------------------------
        print("Capturing Login Page (Admin)...")
        login_url = f"file:///{os.path.join(base_dir, 'login.html').replace('\\', '/')}"
        page.goto(login_url)
        page.wait_for_timeout(1000)
        page.screenshot(path=os.path.join(output_dir, "01_login_admin.png"))

        # -------------------------------------------------------------
        # Screenshot 2: Login Page (Sales view with 9 counters selector)
        # -------------------------------------------------------------
        print("Capturing Login Page (Sales)...")
        page.click("#tabSales")
        page.wait_for_timeout(800)
        page.screenshot(path=os.path.join(output_dir, "02_login_sales.png"))

        # -------------------------------------------------------------
        # Screenshot 3: Super Admin Dashboard
        # -------------------------------------------------------------
        print("Capturing Super Admin Dashboard...")
        # Seed admin user into localStorage
        page.evaluate("""() => {
            localStorage.setItem('bus_auth_token', 'token_admin');
            localStorage.setItem('bus_user_v1', JSON.stringify({
                id: 'admin',
                role: 'admin',
                name: 'Central Control HQ',
                email: 'admin@buscentral.com'
            }));
        }""")
        admin_url = f"file:///{os.path.join(base_dir, 'admin-dashboard.html').replace('\\', '/')}"
        page.goto(admin_url)
        page.wait_for_timeout(1200)
        page.screenshot(path=os.path.join(output_dir, "03_admin_dashboard.png"))

        # -------------------------------------------------------------
        # Screenshot 4: Super Admin Seat Plan Audit
        # -------------------------------------------------------------
        print("Capturing Super Admin Seat Plan Audit...")
        # Open seat modal for first bus
        page.evaluate("openAdminSeatMap('TRIP-101')")
        page.wait_for_timeout(800)
        page.screenshot(path=os.path.join(output_dir, "04_admin_seat_map.png"))
        page.evaluate("closeAdminSeatModal()")

        # -------------------------------------------------------------
        # Screenshot 5: Terminal Sales Dashboard (Sayedabad Counter)
        # -------------------------------------------------------------
        print("Capturing Terminal Sales Dashboard (Sayedabad)...")
        page.evaluate("""() => {
            localStorage.setItem('bus_auth_token', 'token_sales');
            localStorage.setItem('bus_user_v1', JSON.stringify({
                id: 'sales-2',
                role: 'sales',
                counterId: 2,
                name: 'Kamal Hossain',
                counterName: 'Sayedabad Counter',
                email: 'sayedabad@buscentral.com'
            }));
        }""")
        sales_url = f"file:///{os.path.join(base_dir, 'sales-dashboard.html').replace('\\', '/')}"
        page.goto(sales_url)
        page.wait_for_timeout(1200)
        page.screenshot(path=os.path.join(output_dir, "05_sales_dashboard.png"))

        # -------------------------------------------------------------
        # Screenshot 6: Sales Live Seat Booking Module
        # -------------------------------------------------------------
        print("Capturing Sales Live Seat Booking Module...")
        page.evaluate("switchSalesTab('booking')")
        page.wait_for_timeout(1000)
        page.screenshot(path=os.path.join(output_dir, "06_sales_seat_booking.png"))

        # -------------------------------------------------------------
        # Screenshot 7: Sales Printable Ticket Receipt
        # -------------------------------------------------------------
        print("Capturing Sales Printable Ticket Receipt...")
        page.evaluate("""() => {
            showTicketReceipt({
                id: 'TKT-7821',
                busNo: 'DM-BA-12-8821',
                busName: 'Royal Coach Hyundai Universe',
                counterName: 'Sayedabad Counter (Dhaka)',
                destination: "Cox's Bazar (Kolatoli)",
                departureTime: '08:15 AM',
                seatNo: 'B2',
                passengerName: 'Engr. Rayhan Ahmed',
                phone: '01712-889900',
                fare: 1800,
                bookingTime: '08:05 AM'
            });
        }""")
        page.wait_for_timeout(800)
        page.screenshot(path=os.path.join(output_dir, "07_sales_ticket_receipt.png"))

        # -------------------------------------------------------------
        # Screenshot 8: Sales Passenger Manifest / Sold Tickets
        # -------------------------------------------------------------
        print("Capturing Sales Passenger Manifest...")
        page.evaluate("closeTicketPrintModal()")
        page.evaluate("switchSalesTab('manifest')")
        page.wait_for_timeout(800)
        page.screenshot(path=os.path.join(output_dir, "08_sales_manifest.png"))

        # -------------------------------------------------------------
        # Screenshot 9: Super Admin Income & Expense Financial Audit
        # -------------------------------------------------------------
        print("Capturing Super Admin Income & Expense Module...")
        page.evaluate("""() => {
            localStorage.setItem('bus_auth_token', 'token_admin');
            localStorage.setItem('bus_user_v1', JSON.stringify({
                id: 'admin',
                role: 'admin',
                name: 'Central Control HQ',
                email: 'admin@buscentral.com'
            }));
        }""")
        page.goto(admin_url)
        page.wait_for_timeout(1000)
        page.evaluate("switchAdminTab('finance')")
        page.wait_for_timeout(1000)
        page.screenshot(path=os.path.join(output_dir, "09_admin_finance_audit.png"))

        # -------------------------------------------------------------
        # Screenshot 10: Counter Sales Daily Cashbook (Fuel/Toll/Parcel)
        # -------------------------------------------------------------
        print("Capturing Counter Sales Daily Cashbook...")
        page.evaluate("""() => {
            localStorage.setItem('bus_auth_token', 'token_sales');
            localStorage.setItem('bus_user_v1', JSON.stringify({
                id: 'sales-2',
                role: 'sales',
                counterId: 2,
                name: 'Kamal Hossain',
                counterName: 'Sayedabad Counter',
                email: 'sayedabad@buscentral.com'
            }));
        }""")
        page.goto(sales_url)
        page.wait_for_timeout(1000)
        page.evaluate("switchSalesTab('cashbook')")
        page.wait_for_timeout(1000)
        page.screenshot(path=os.path.join(output_dir, "10_sales_cashbook.png"))

        browser.close()
        print("All screenshots successfully captured in:", output_dir)

if __name__ == "__main__":
    capture_screenshots()
