import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    base_dir = os.path.abspath(os.path.dirname(__file__))
    assets_dir = os.path.join(base_dir, "presentation_assets")
    output_pptx = os.path.join(base_dir, "Central_Bus_Management_System_Presentation.pptx")

    prs = Presentation()
    # 16:9 widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Theme Colors
    COLOR_BG_DARK = RGBColor(15, 23, 42)       # Slate 900
    COLOR_CARD_DARK = RGBColor(30, 41, 59)     # Slate 800
    COLOR_BG_LIGHT = RGBColor(248, 250, 252)   # Slate 50
    COLOR_CARD_LIGHT = RGBColor(255, 255, 255) # Pure White
    COLOR_PRIMARY = RGBColor(79, 70, 229)      # Indigo 600
    COLOR_PRIMARY_LIGHT = RGBColor(224, 231, 255) # Indigo 100
    COLOR_AMBER = RGBColor(217, 119, 6)        # Amber 600
    COLOR_EMERALD = RGBColor(16, 185, 129)     # Emerald 500
    COLOR_TEXT_MAIN = RGBColor(15, 23, 42)     # Slate 900
    COLOR_TEXT_MUTED = RGBColor(100, 116, 139) # Slate 500
    COLOR_TEXT_LIGHT = RGBColor(255, 255, 255) # White
    COLOR_BORDER = RGBColor(226, 232, 240)     # Slate 200

    def add_header(slide, tag_text, title_text, subtitle_text, dark=False):
        # Header Box
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(1.2))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        # Tag Pill
        p_tag = tf.paragraphs[0]
        p_tag.text = tag_text.upper()
        p_tag.font.size = Pt(10)
        p_tag.font.bold = True
        p_tag.font.color.rgb = COLOR_PRIMARY if not dark else COLOR_EMERALD

        # Title
        p_title = tf.add_paragraph()
        p_title.text = title_text
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_TEXT_MAIN if not dark else COLOR_TEXT_LIGHT
        p_title.space_after = Pt(2)

        # Subtitle
        p_sub = tf.add_paragraph()
        p_sub.text = subtitle_text
        p_sub.font.size = Pt(11)
        p_sub.font.color.rgb = COLOR_TEXT_MUTED if not dark else RGBColor(148, 163, 184)

    def set_slide_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background() # no line

    # =========================================================================
    # SLIDE 1: COVER TITLE SLIDE (Dark Premium Theme)
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide1, COLOR_BG_DARK)

    # Decorative top bar
    bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.2), Inches(1.8), Inches(0.08))
    bar.fill.solid()
    bar.fill.fore_color.rgb = COLOR_PRIMARY
    bar.line.fill.background()

    # Title Box
    title_box = slide1.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.7), Inches(4.5))
    tf1 = title_box.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "CENTRAL BUS DESK"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY_LIGHT
    p.space_after = Pt(8)

    p2 = tf1.add_paragraph()
    p2.text = "৯টি কাউন্টার ও রিয়েল-টাইম বাস ফ্লিট ম্যানেজমেন্ট সিস্টেম"
    p2.font.size = Pt(32)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_TEXT_LIGHT
    p2.space_after = Pt(12)

    p3 = tf1.add_paragraph()
    p3.text = "Super Admin Supervision & Terminal-Wise Counter Sales Dashboard Presentation"
    p3.font.size = Pt(15)
    p3.font.color.rgb = RGBColor(148, 163, 184)
    p3.space_after = Pt(28)

    # 3 Summary Badge Cards
    badges = [
        ("🛡️ SUPER ADMIN PORTAL", "সারাদেশের ৯টি কাউন্টারের লাইভ মনিটরিং, ছাড়া বাস ও খালি সিটের তথ্য"),
        ("🎫 9 COUNTER SALES PORTALS", "প্রতিটি কাউন্টারের জন্য আলাদা লগইন, বাসের শিডিউল ও সিট বুকিং ডেস্ক"),
        ("💺 REAL-TIME 2x2 SEAT PLAN", "বাসের অভ্যন্তরীণ আসন বিন্যাস, কনফার্মেশন ও স্বয়ংক্রিয় প্রিন্ট রিসিট")
    ]
    for i, (b_title, b_desc) in enumerate(badges):
        x = Inches(0.8 + i * 3.9)
        card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(4.5), Inches(3.7), Inches(1.6))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_DARK
        card.line.color.rgb = RGBColor(51, 65, 85)

        tb = slide1.shapes.add_textbox(x + Inches(0.2), Inches(4.65), Inches(3.3), Inches(1.3))
        tb_tf = tb.text_frame
        tb_tf.word_wrap = True
        
        bp1 = tb_tf.paragraphs[0]
        bp1.text = b_title
        bp1.font.size = Pt(11)
        bp1.font.bold = True
        bp1.font.color.rgb = COLOR_TEXT_LIGHT
        bp1.space_after = Pt(4)

        bp2 = tb_tf.add_paragraph()
        bp2.text = b_desc
        bp2.font.size = Pt(10)
        bp2.font.color.rgb = RGBColor(148, 163, 184)

    # Footer note
    foot = slide1.shapes.add_textbox(Inches(0.8), Inches(6.6), Inches(11.7), Inches(0.5))
    foot.text_frame.paragraphs[0].text = "Developed using HTML5, Tailwind CSS & Pure Vanilla JavaScript • Fully Responsive Single Page Application"
    foot.text_frame.paragraphs[0].font.size = Pt(10)
    foot.text_frame.paragraphs[0].font.color.rgb = RGBColor(100, 116, 139)

    # =========================================================================
    # SLIDE 2: 9 COUNTERS ARCHITECTURE & NETWORK
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2, COLOR_BG_LIGHT)
    add_header(slide2, "Network Architecture", "৯টি প্রধান ইন্টার-ডিস্ট্রিক্ট টার্মিনাল হাব ও রোল বিভাজন", "সেন্ট্রাল অ্যাডমিন মনিটরিং এবং পৃথক টার্মিনাল সেলস একাউন্টের সমন্বিত কাঠামো")

    # 9 Counters Grid Representation (3x3 grid)
    counters_data = [
        ("১. গাবতলী কাউন্টার (GAB-01)", "ঢাকা সেন্ট্রাল", "রফিকুল ইসলাম", "gabtoli@buscentral.com"),
        ("২. সায়েদাবাদ কাউন্টার (SAY-02)", "ঢাকা আন্তঃজেলা", "কামাল হোসেন", "sayedabad@buscentral.com"),
        ("৩. মহাখালী কাউন্টার (MOH-03)", "ঢাকা উত্তর হাব", "জাহিদ হাসান", "mohakhali@buscentral.com"),
        ("৪. উত্তরা কাউন্টার (UTT-04)", "সেক্টর ৭, উত্তরা", "তানভীর আহমেদ", "uttara@buscentral.com"),
        ("৫. চট্টগ্রাম জিইসি (CTG-05)", "জিইসি সার্কেল", "নাজমুল হুদা", "chittagong@buscentral.com"),
        ("৬. কক্সবাজার কাউন্টার (CXB-06)", "কলাতলী বিচ রোড", "মাহবুব আলম", "coxsbazar@buscentral.com"),
        ("৭. সিলেট কদমতলী (SYL-07)", "সেন্ট্রাল বাস টার্মিনাল", "ফারুক হোসেন", "sylhet@buscentral.com"),
        ("৮. রাজশাহী রেলগেট (RAJ-08)", "স্টেশন রোড", "সোহেল রানা", "rajshahi@buscentral.com"),
        ("৯. বগুড়া সাতমাথা (BOG-09)", "সাতমাথা সার্কেল", "আনোয়ার পারভেজ", "bogura@buscentral.com")
    ]

    grid_w = Inches(3.7)
    grid_h = Inches(1.3)
    start_x = Inches(0.8)
    start_y = Inches(1.8)

    for idx, (c_name, c_loc, c_mgr, c_email) in enumerate(counters_data):
        row = idx // 3
        col = idx % 3
        cx = start_x + col * Inches(3.9)
        cy = start_y + row * Inches(1.5)

        card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, cy, grid_w, grid_h)
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_LIGHT
        card.line.color.rgb = COLOR_BORDER

        tb = slide2.shapes.add_textbox(cx + Inches(0.15), cy + Inches(0.12), grid_w - Inches(0.3), grid_h - Inches(0.24))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = c_name
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_TEXT_MAIN

        p2 = tf.add_paragraph()
        p2.text = f"অবস্থান: {c_loc} | ম্যানেজার: {c_mgr}"
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = COLOR_TEXT_MUTED

        p3 = tf.add_paragraph()
        p3.text = f"লগইন: {c_email}"
        p3.font.size = Pt(9)
        p3.font.bold = True
        p3.font.color.rgb = COLOR_PRIMARY

    # Bottom summary bar
    summary_box = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.3), Inches(11.7), Inches(0.7))
    summary_box.fill.solid()
    summary_box.fill.fore_color.rgb = RGBColor(238, 242, 255)
    summary_box.line.color.rgb = COLOR_PRIMARY_LIGHT
    s_tf = summary_box.text_frame
    sp = s_tf.paragraphs[0]
    sp.text = "🎯 সিস্টেমের মূল বৈশিষ্ট্য: প্রতিটি কাউন্টারের নিজস্ব সেলস অফিসার কেবল তাদের কাউন্টারের বাসের তথ্য ও টিকেট ম্যানেজ করবেন, আর সেন্ট্রাল অ্যাডমিন ৯টি কাউন্টারের সামগ্রিক গতিবিধি পর্যবেক্ষণ করবেন।"
    sp.font.size = Pt(10.5)
    sp.font.color.rgb = COLOR_PRIMARY

    # =========================================================================
    # SLIDE 3: AUTHENTICATION & LOGIN PORTAL (IMAGE: 01_login_admin.png & 02_login_sales.png)
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3, COLOR_BG_LIGHT)
    add_header(slide3, "Authentication Portal", "লগইন সিস্টেম ও ৯টি কাউন্টারের আলাদা ক্রেডেনশিয়াল", "সেন্ট্রাল অ্যাডমিন ও প্রতিটি টার্মিনালের জন্য সম্পূর্ণ পৃথক এবং নিরাপদ লগইন সুবিধা")

    # Image Left
    img_path1 = os.path.join(assets_dir, "02_login_sales.png")
    if os.path.exists(img_path1):
        slide3.shapes.add_picture(img_path1, Inches(0.8), Inches(1.8), width=Inches(7.2))

    # Feature List Right
    feat_box = slide3.shapes.add_textbox(Inches(8.3), Inches(1.8), Inches(4.2), Inches(5.0))
    ftf = feat_box.text_frame
    ftf.word_wrap = True

    items = [
        ("🔐 Role-Based Access Control", "সুপার অ্যাডমিন এবং কাউন্টার সেলসের জন্য আলাদা দুটি লগইন গেটওয়ে।"),
        ("🏢 9 Independent Credentials", "৯টি কাউন্টারের জন্য ৯টি নিজস্ব ইমেইল ও পাসওয়ার্ড সেট করা রয়েছে (যেমন: sayedabad@buscentral.com)।"),
        ("⚡ 1-Click Fast Demo Testing", "কাউন্টার ড্রপডাউন সিলেক্ট করলেই স্বয়ংক্রিয়ভাবে সঠিক ক্রেডেনশিয়াল ফিল হয়ে যায় এবং এক ক্লিকেই লগইন করা যায়।"),
        ("🔄 Smart Dashboard Routing", "লগইন সফল হলে অ্যাডমিনকে নিয়ে যায় সেন্ট্রাল ড্যাশবোর্ডে এবং সেলস অফিসারকে তাদের নির্দিষ্ট কাউন্টার ডেস্কে।"),
        ("👁️ Security & Visibility", "পাসওয়ার্ড শো/হাইড টগল ও রিমেম্বার-মি অপশন সহ রেসপন্সিভ ডিজাইন।")
    ]

    for i, (head, body) in enumerate(items):
        p_head = ftf.paragraphs[0] if i == 0 else ftf.add_paragraph()
        p_head.text = head
        p_head.font.size = Pt(12)
        p_head.font.bold = True
        p_head.font.color.rgb = COLOR_TEXT_MAIN
        p_head.space_after = Pt(2)

        p_body = ftf.add_paragraph()
        p_body.text = body
        p_body.font.size = Pt(10.5)
        p_body.font.color.rgb = COLOR_TEXT_MUTED
        p_body.space_after = Pt(10)

    # =========================================================================
    # SLIDE 4: SUPER ADMIN SUPERVISION DASHBOARD (IMAGE: 03_admin_dashboard.png)
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide4, COLOR_BG_LIGHT)
    add_header(slide4, "Super Admin Dashboard", "সুপার অ্যাডমিন সেন্ট্রাল মনিটরিং ড্যাশবোর্ড", "সারাদেশের ৯টি কাউন্টারে আজ কয়টি বাস গেল, কখন গেল এবং কতটি সিট খালি আছে তার লাইভ কন্ট্রোল রুম")

    # Image Left
    img_path2 = os.path.join(assets_dir, "03_admin_dashboard.png")
    if os.path.exists(img_path2):
        slide4.shapes.add_picture(img_path2, Inches(0.8), Inches(1.8), width=Inches(7.3))

    # Features Right
    feat_box4 = slide4.shapes.add_textbox(Inches(8.4), Inches(1.8), Inches(4.1), Inches(5.0))
    ftf4 = feat_box4.text_frame
    ftf4.word_wrap = True

    admin_highlights = [
        ("📊 4 Real-Time Fleet Metrics", "আজকের মোট বাস, ছেড়ে যাওয়া বাস (Departed), বোর্ডিং (Boarding) এবং মোট খালি সিটের লাইভ পরিসংখ্যান।"),
        ("🏢 9 Terminals Live Grid", "প্রতিটি কাউন্টারের জন্য আলাদা স্ট্যাটাস কার্ড—যেখানে পরবর্তী বাস ছাড়ার সময়, গন্তব্য ও খালি সিট স্পষ্ট দেখা যায়।"),
        ("🚌 Nationwide Trips Audit", "সারাদেশের যেকোনো বাসের নাম্বার, সময়, মোট সিট, বুকড সিট ও ভাড়া সরাসরি নজরদারি করার সুবিধা।"),
        ("🔍 Quick Filter & Search", "কাউন্টার সিলেক্ট করে ফিল্টার করা এবং বাস নাম্বার বা গন্তব্য সার্চ করে তাৎক্ষণিক তথ্য পাওয়া।"),
        ("💰 Revenue Supervision", "সব কাউন্টার মিলিয়ে মোট কত টাকার টিকেট বিক্রি হলো তার কেন্দ্রীয় রাজস্ব নিরীক্ষা।")
    ]

    for i, (h, b) in enumerate(admin_highlights):
        p_h = ftf4.paragraphs[0] if i == 0 else ftf4.add_paragraph()
        p_h.text = h
        p_h.font.size = Pt(12)
        p_h.font.bold = True
        p_h.font.color.rgb = COLOR_TEXT_MAIN
        p_h.space_after = Pt(2)

        p_b = ftf4.add_paragraph()
        p_b.text = b
        p_b.font.size = Pt(10.5)
        p_b.font.color.rgb = COLOR_TEXT_MUTED
        p_b.space_after = Pt(10)

    # =========================================================================
    # SLIDE 5: SUPER ADMIN PHYSICAL SEAT AUDIT (IMAGE: 04_admin_seat_map.png)
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide5, COLOR_BG_LIGHT)
    add_header(slide5, "Live Seat Availability Audit", "বাসের খালি সিট ও বাস্তবসম্মত আসন বিন্যাস অডিট", "কোন বাসে কতটি সিট খালি আছে (Empty Seats) তা ২x২ ফিজিক্যাল সিট ম্যাপে সরাসরি দেখার ব্যবস্থা")

    # Center-left Image
    img_path3 = os.path.join(assets_dir, "04_admin_seat_map.png")
    if os.path.exists(img_path3):
        slide5.shapes.add_picture(img_path3, Inches(0.8), Inches(1.8), height=Inches(5.0))

    # Right Side Content
    right_box = slide5.shapes.add_textbox(Inches(6.2), Inches(1.8), Inches(6.3), Inches(5.0))
    rtf = right_box.text_frame
    rtf.word_wrap = True

    seat_points = [
        ("💺 বাস্তবসম্মত ২x২ বাস সিট প্ল্যান (Physical Bus Layout)", "সামনের ড্রাইভার কেবিন, প্রবেশদ্বার (Door), মাঝখানের চলাচলের আইল (Aisle) এবং পিছনের ইঞ্জিন ক্যাবিন সহ নিখুঁত লেআউট।"),
        ("🟢 সবুজ রঙ = খালি সিট (Available Seats)", "যেসব সিট এখনও বিক্রি হয়নি বা যাত্রী উঠেনি তা গাঢ় সবুজ ব্যাজে দৃশ্যমান থাকে।"),
        ("🔴 লাল রঙ = বুকড সিট (Booked Passengers)", "যাত্রী কনফার্ম হওয়া সিটগুলো তাৎক্ষণিকভাবে লাল রঙে রূপান্তরিত হয়।"),
        ("🔎 বাস ভিত্তিক স্বচ্ছতা (Total Transparency)", "অ্যাডমিন যেকোনো কাউন্টারের বাসের 'সিট দেখুন' বাটনে ক্লিক করলেই এই পপআপ ওপেন হয়ে যায়।"),
        ("📈 নো-মোর কলিং কাউন্টার ম্যানেজার", "কাউন্টার ম্যানেজারের সাথে বারবার ফোনে কথা না বলেই সেন্ট্রাল হেডকোয়ার্টার থেকেই পুরো বাসের আসন অবস্থা নিশ্চিত হওয়া যায়।")
    ]

    for i, (head, body) in enumerate(seat_points):
        ph = rtf.paragraphs[0] if i == 0 else rtf.add_paragraph()
        ph.text = head
        ph.font.size = Pt(12)
        ph.font.bold = True
        ph.font.color.rgb = COLOR_TEXT_MAIN
        ph.space_after = Pt(2)

        pb = rtf.add_paragraph()
        pb.text = body
        pb.font.size = Pt(10.5)
        pb.font.color.rgb = COLOR_TEXT_MUTED
        pb.space_after = Pt(10)

    # =========================================================================
    # SLIDE 6: TERMINAL SALES EXECUTIVE DASHBOARD (IMAGE: 05_sales_dashboard.png)
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide6, COLOR_BG_LIGHT)
    add_header(slide6, "Terminal Sales Portal", "কাউন্টার সেলস ড্যাশবোর্ড ও বাস ট্রিপ সিডিউল (CRUD)", "লগইনকৃত নির্দিষ্ট কাউন্টারের জন্য সম্পূর্ণ পৃথক ওয়ার্কস্পেস ও বাস ট্রিপ নিয়ন্ত্রণ")

    # Image Left
    img_path4 = os.path.join(assets_dir, "05_sales_dashboard.png")
    if os.path.exists(img_path4):
        slide6.shapes.add_picture(img_path4, Inches(0.8), Inches(1.8), width=Inches(7.3))

    # Right Box
    feat_box6 = slide6.shapes.add_textbox(Inches(8.4), Inches(1.8), Inches(4.1), Inches(5.0))
    ftf6 = feat_box6.text_frame
    ftf6.word_wrap = True

    sales_crud_items = [
        ("🏢 কাউন্টার স্পেসিফিক ডেস্ক", "লগইন করার সাথে সাথে সংশ্লিষ্ট কাউন্টারের নাম (যেমন: সায়েদাবাদ), কোড (SAY-02) ও ফোন নম্বর লোড হয়।"),
        ("➕ নতুন বাস শিডিউল যোগ (Add Trip)", "কাউন্টার থেকে ছেড়ে যাওয়া নতুন বাসের নম্বর, রুট, সময়, মোট সিট, ড্রাইভার ও ভাড়া যোগ করার ফরম।"),
        ("✏️ বাসের তথ্য এডিট (Edit Bus Info)", "ভাড়ার পরিবর্তন, ছাড়ার সময় পুনঃনির্ধারণ বা ড্রাইভার পরিবর্তনের পূর্ণ স্বাধীনতা।"),
        ("🗑️ ট্রিপ বাতিল বা ডিলিট (Delete Trip)", "কোনো ট্রিপ বাতিল হলে তৎক্ষণাৎ তা ডিলিট করা যায় এবং অ্যাডমিনের কাছেও রিয়েল-টাইমে আপডেট হয়।"),
        ("💵 নিজস্ব কাউন্টার ক্যাশ কালেকশন", "আজকে এই কাউন্টার থেকে মোট কত টাকা আয় হলো তার স্বচ্ছ হিসাব।")
    ]

    for i, (h, b) in enumerate(sales_crud_items):
        ph = ftf6.paragraphs[0] if i == 0 else ftf6.add_paragraph()
        ph.text = h
        ph.font.size = Pt(12)
        ph.font.bold = True
        ph.font.color.rgb = COLOR_TEXT_MAIN
        ph.space_after = Pt(2)

        pb = ftf6.add_paragraph()
        pb.text = b
        pb.font.size = Pt(10.5)
        pb.font.color.rgb = COLOR_TEXT_MUTED
        pb.space_after = Pt(10)

    # =========================================================================
    # SLIDE 7: LIVE SEAT BOOKING BY SALES (IMAGE: 06_sales_seat_booking.png)
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide7, COLOR_BG_LIGHT)
    add_header(slide7, "Point of Sale (POS)", "লাইভ সিট বুকিং ও প্যাসেঞ্জার এসাইনমেন্ট", "সিটে ক্লিক করে যাত্রীর নাম ও মোবাইল নম্বর দিয়ে সেকেন্ডের মধ্যে টিকেট ইস্যু")

    img_path5 = os.path.join(assets_dir, "06_sales_seat_booking.png")
    if os.path.exists(img_path5):
        slide7.shapes.add_picture(img_path5, Inches(0.8), Inches(1.8), width=Inches(7.3))

    feat_box7 = slide7.shapes.add_textbox(Inches(8.4), Inches(1.8), Inches(4.1), Inches(5.0))
    ftf7 = feat_box7.text_frame
    ftf7.word_wrap = True

    pos_features = [
        ("🎯 ইন্টার-অ্যাক্টিভ সিট ক্লিক", "সেলস অফিসার বাসের খালি সিটে (A1, B2 ইত্যাদি) সরাসরি ক্লিক করে বুকিং উইন্ডো ওপেন করতে পারেন।"),
        ("👤 যাত্রীর নাম ও মোবাইল এন্ট্রি", "যাত্রীর নাম ও ফোন নম্বর ইনপুট দেওয়ার সাথে সাথে সিটটি তার নামে লক হয়ে যায়।"),
        ("⚡ ইনস্ট্যান্ট সিট রিলিজ / ক্যানসেল", "যাত্রী যাত্রা বাতিল করলে বুকড সিটে ক্লিক করে এক ক্লিকেই সিট খালি করা যায়।"),
        ("🔄 কাউন্টার ট্রিপ ফিল্টারিং", "বাম পাশের বাস লিস্ট থেকে যেকোনো বাস নির্বাচন করে তার আলাদা সিট লেআউট দেখা যায়।"),
        ("🛡️ ডাটা ইন্টিগ্রিটি", "একই সিট ডাবল বুকিং হওয়ার কোনো সুযোগ নেই।")
    ]

    for i, (h, b) in enumerate(pos_features):
        ph = ftf7.paragraphs[0] if i == 0 else ftf7.add_paragraph()
        ph.text = h
        ph.font.size = Pt(12)
        ph.font.bold = True
        ph.font.color.rgb = COLOR_TEXT_MAIN
        ph.space_after = Pt(2)

        pb = ftf7.add_paragraph()
        pb.text = b
        pb.font.size = Pt(10.5)
        pb.font.color.rgb = COLOR_TEXT_MUTED
        pb.space_after = Pt(10)

    # =========================================================================
    # SLIDE 8: PRINTABLE TICKET RECEIPT & MANIFEST (IMAGE: 07_sales_ticket_receipt.png)
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide8, COLOR_BG_LIGHT)
    add_header(slide8, "Printable Ticket & Manifest", "স্বয়ংক্রিয় টিকেট রিসিপ্ট ও প্যাসেঞ্জার ম্যানিফেস্ট", "বুকিং নিশ্চিত হওয়ার সাথে সাথে প্রিন্টযোগ্য ডিজিটাল রিসিট ও যাত্রীদের রেজিস্টার")

    # Center-left Image
    img_path6 = os.path.join(assets_dir, "07_sales_ticket_receipt.png")
    if os.path.exists(img_path6):
        slide8.shapes.add_picture(img_path6, Inches(0.8), Inches(1.8), height=Inches(5.0))

    # Right Side Content
    right_box8 = slide8.shapes.add_textbox(Inches(6.2), Inches(1.8), Inches(6.3), Inches(5.0))
    rtf8 = right_box8.text_frame
    rtf8.word_wrap = True

    ticket_features = [
        ("🎫 স্বয়ংক্রিয় ইউনিক টিকেট নম্বর (e.g. TKT-7821)", "প্রতিটি সফল বুকিংয়ে স্বয়ংক্রিয়ভাবে অদ্বিতীয় টিকেট আইডি তৈরি হয়।"),
        ("📄 সম্পূর্ণ ভ্রমণের বিবরণ সমৃদ্ধ রিসিট", "কাউন্টার নাম, বাসের নম্বর, গন্তব্য, ছাড়ার নির্ধারিত সময়, সিট নম্বর এবং ভাড়া পরিষ্কারভাবে মুদ্রিত থাকে।"),
        ("🖨️ ১-ক্লিক থার্মাল / পেপার প্রিন্টিং", "'প্রিন্ট করুন' বাটনে ক্লিক করলেই ব্রাউজারের প্রিন্ট ডায়ালগ ওপেন হয় এবং স্লিপ প্রিন্ট হয়ে যায়।"),
        ("📋 আজকের প্যাসেঞ্জার ম্যানিফেস্ট (Passenger Manifest)", "বাস ছাড়ার আগে সব যাত্রীর নাম ও ফোনের তালিকা নিয়ে সুপারভাইজার সহজেই বোর্ডিং সম্পন্ন করতে পারেন।"),
        ("🔒 নির্ভরযোগ্য অডিট ট্রেইল", "কাউন্টার থেকে কয়টি টিকেট ইস্যু হলো এবং কত টাকা আদায় হলো তা সাথে সাথে সংরক্ষিত থাকে।")
    ]

    for i, (head, body) in enumerate(ticket_features):
        ph = rtf8.paragraphs[0] if i == 0 else rtf8.add_paragraph()
        ph.text = head
        ph.font.size = Pt(12)
        ph.font.bold = True
        ph.font.color.rgb = COLOR_TEXT_MAIN
        ph.space_after = Pt(2)

        pb = rtf8.add_paragraph()
        pb.text = body
        pb.font.size = Pt(10.5)
        pb.font.color.rgb = COLOR_TEXT_MUTED
        pb.space_after = Pt(10)

    # =========================================================================
    # SLIDE 9: SUMMARY & BUSINESS ADVANTAGES (Dark Executive Theme)
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide9, COLOR_BG_DARK)
    add_header(slide9, "Executive Summary", "সিস্টেমের প্রযুক্তিগত উৎকর্ষ ও ব্যবসায়িক সুবিধাসমূহ", "বাস ফ্লিট পরিচালনায় ১০০% আধুনিকীকরণ, স্বচ্ছতা এবং আয়ের সর্বোচ্চ সুরক্ষা", dark=True)

    summary_cards = [
        ("🚀 সেন্ট্রাল হেডকোয়ার্টার ভিজিবিলিটি", "প্রধান অ্যাডমিন অফিসে বসেই ৯টি টার্মিনালের সকল বাসের অবস্থান ও খালি সিটের রিয়েল-টাইম তথ্য পাচ্ছেন।"),
        ("⚡ টার্মিনালগুলোর বিকেন্দ্রীভূত স্বাধীনতা", "প্রতিটি কাউন্টারের সেলস টিম স্বাধীনভাবে তাদের বাসের শিডিউল ম্যানেজ ও দ্রুত টিকেট বুকিং করতে পারছে।"),
        ("💺 শতভাগ সিট অকুপেন্সি বৃদ্ধি", "কোন বাসে সিট খালি আছে তা হেডকোয়ার্টার আগে থেকেই দেখতে পেয়ে দ্রুত সিদ্ধান্ত ও রুট রিশিডিউলিং করতে পারছে।"),
        ("💻 জিরো সার্ভার ওভারহেড ও দ্রুত গতি", "Tailwind CSS ও আধুনিক ব্রাউজার-ফার্স্ট আর্কিটেকচারে তৈরি, কোনো জটিল ব্যাকএন্ড ছাড়াও অত্যন্ত দ্রুতগতিতে কাজ করে।")
    ]

    for i, (title, desc) in enumerate(summary_cards):
        col = i % 2
        row = i // 2
        sx = Inches(0.8 + col * 5.9)
        sy = Inches(1.9 + row * 2.3)

        card = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, sx, sy, Inches(5.6), Inches(2.0))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_DARK
        card.line.color.rgb = RGBColor(51, 65, 85)

        tb = slide9.shapes.add_textbox(sx + Inches(0.3), sy + Inches(0.25), Inches(5.0), Inches(1.5))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(14)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_TEXT_LIGHT
        p1.space_after = Pt(6)

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = RGBColor(148, 163, 184)
        p2.space_after = Pt(2)

    # Save Presentation
    prs.save(output_pptx)
    print(f"Presentation successfully created at: {output_pptx}")

if __name__ == "__main__":
    create_presentation()
