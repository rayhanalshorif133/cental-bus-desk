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
    COLOR_BG_DARK = RGBColor(15, 23, 42)          # Slate 900
    COLOR_CARD_DARK = RGBColor(30, 41, 59)        # Slate 800
    COLOR_BG_LIGHT = RGBColor(248, 250, 252)      # Slate 50
    COLOR_CARD_LIGHT = RGBColor(255, 255, 255)    # Pure White
    COLOR_PRIMARY = RGBColor(79, 70, 229)         # Indigo 600
    COLOR_PRIMARY_LIGHT = RGBColor(224, 231, 255) # Indigo 100
    COLOR_AMBER = RGBColor(217, 119, 6)           # Amber 600
    COLOR_AMBER_LIGHT = RGBColor(254, 243, 199)   # Amber 100
    COLOR_EMERALD = RGBColor(16, 185, 129)        # Emerald 500
    COLOR_EMERALD_LIGHT = RGBColor(209, 250, 229) # Emerald 100
    COLOR_TEXT_MAIN = RGBColor(15, 23, 42)        # Slate 900
    COLOR_TEXT_MUTED = RGBColor(100, 116, 139)    # Slate 500
    COLOR_TEXT_LIGHT = RGBColor(255, 255, 255)    # White
    COLOR_BORDER = RGBColor(226, 232, 240)        # Slate 200

    def add_header(slide, tag_text, title_text, subtitle_text, dark=False):
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
        bg.line.fill.background()

    # =========================================================================
    # SLIDE 1: WELCOME PAGE (Official Executive Welcome - 10 Counters)
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide1, COLOR_BG_DARK)

    # Decorative top bar
    bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.0), Inches(2.2), Inches(0.08))
    bar.fill.solid()
    bar.fill.fore_color.rgb = COLOR_PRIMARY
    bar.line.fill.background()

    # Welcome Tag Pill
    pill = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.3), Inches(3.2), Inches(0.4))
    pill.fill.solid()
    pill.fill.fore_color.rgb = RGBColor(30, 41, 59)
    pill.line.color.rgb = RGBColor(79, 70, 229)
    ptf = pill.text_frame
    pp = ptf.paragraphs[0]
    pp.alignment = PP_ALIGN.CENTER
    pp.text = "★ OFFICIAL PROJECT PRESENTATION ★"
    pp.font.size = Pt(9.5)
    pp.font.bold = True
    pp.font.color.rgb = COLOR_PRIMARY_LIGHT

    # Main Welcome Titles
    title_box = slide1.shapes.add_textbox(Inches(0.8), Inches(1.85), Inches(11.7), Inches(2.8))
    tf1 = title_box.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "WELCOME TO CENTRAL BUS DESK"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = RGBColor(165, 180, 252)
    p.space_after = Pt(6)

    p2 = tf1.add_paragraph()
    p2.text = "১০টি কাউন্টার ও রিয়েল-টাইম বাস ফ্লিট ম্যানেজমেন্ট সিস্টেম"
    p2.font.size = Pt(32)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_TEXT_LIGHT
    p2.space_after = Pt(10)

    p3 = tf1.add_paragraph()
    p3.text = "সেন্ট্রাল সুপার অ্যাডমিন মনিটরিং ও টার্মিনাল-ভিত্তিক সেলস ডেস্কের সমন্বিত প্রেজেন্টেশন"
    p3.font.size = Pt(14)
    p3.font.color.rgb = RGBColor(148, 163, 184)

    # 4 Welcome Highlight Cards
    welcome_cards = [
        ("🛡️ SUPER ADMIN HQ", "সারাদেশের ১০টি কাউন্টার এক নজরে লাইভ মনিটরিং, ছাড়া বাস ও খালি সিটের সেন্ট্রাল অডিট"),
        ("🎫 10 COUNTER PORTALS", "প্রতিটি টার্মিনালের জন্য সম্পূর্ণ আলাদা লগইন, বাসের শিডিউল যোগ/এডিট ও সিট বুকিং"),
        ("💺 2x2 SEAT ENGINE", "বাস্তবমুখী ২x২ সিট ম্যাপ, তাৎক্ষণিক যাত্রী বুকিং ও স্বয়ংক্রিয় প্রিন্টযোগ্য টিকেট স্লিপ"),
        ("⏱️ 2-3 MONTHS ROADMAP", "UI/UX ডিজাইন, ব্যাকএন্ড API আর্কিটেকচার, RBAC রোল ম্যানেজমেন্ট ও ক্লাউড ডেপ্লয়মেন্ট")
    ]
    for i, (c_title, c_desc) in enumerate(welcome_cards):
        x = Inches(0.8 + i * 2.95)
        card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(4.7), Inches(2.8), Inches(1.8))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_DARK
        card.line.color.rgb = RGBColor(51, 65, 85)

        tb = slide1.shapes.add_textbox(x + Inches(0.18), Inches(4.85), Inches(2.44), Inches(1.5))
        tb_tf = tb.text_frame
        tb_tf.word_wrap = True
        
        bp1 = tb_tf.paragraphs[0]
        bp1.text = c_title
        bp1.font.size = Pt(11)
        bp1.font.bold = True
        bp1.font.color.rgb = COLOR_TEXT_LIGHT
        bp1.space_after = Pt(4)

        bp2 = tb_tf.add_paragraph()
        bp2.text = c_desc
        bp2.font.size = Pt(9.5)
        bp2.font.color.rgb = RGBColor(148, 163, 184)

    # Footer note
    foot = slide1.shapes.add_textbox(Inches(0.8), Inches(6.8), Inches(11.7), Inches(0.4))
    foot.text_frame.paragraphs[0].text = "Architecture: Single Page Application • Tailwind CSS • Responsive UI • RESTful APIs • Production Ready"
    foot.text_frame.paragraphs[0].font.size = Pt(10)
    foot.text_frame.paragraphs[0].font.color.rgb = RGBColor(100, 116, 139)

    # =========================================================================
    # SLIDE 2: 10 COUNTERS ARCHITECTURE & NETWORK (Clean 5x2 Grid)
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2, COLOR_BG_LIGHT)
    add_header(slide2, "Network Architecture", "১০টি প্রধান ইন্টার-ডিস্ট্রিক্ট টার্মিনাল হাব ও রোল বিভাজন", "সেন্ট্রাল অ্যাডমিন মনিটরিং এবং পৃথক ১০টি টার্মিনাল সেলস একাউন্টের সমন্বিত কাঠামো")

    counters_data_10 = [
        ("১. গাবতলী (GAB-01)", "ঢাকা সেন্ট্রাল", "রফিকুল ইসলাম", "gabtoli@buscentral.com"),
        ("২. সায়েদাবাদ (SAY-02)", "ঢাকা আন্তঃজেলা", "কামাল হোসেন", "sayedabad@buscentral.com"),
        ("৩. মহাখালী (MOH-03)", "ঢাকা উত্তর হাব", "জাহিদ হাসান", "mohakhali@buscentral.com"),
        ("৪. উত্তরা (UTT-04)", "ঢাকা সেক্টর ৭", "তানভীর আহমেদ", "uttara@buscentral.com"),
        ("৫. চট্টগ্রাম (CTG-05)", "জিইসি সার্কেল", "নাজমুল হুদা", "chittagong@buscentral.com"),
        ("৬. কক্সবাজার (CXB-06)", "কলাতলী বিচ রোড", "মাহবুব আলম", "coxsbazar@buscentral.com"),
        ("৭. সিলেট (SYL-07)", "কদমতলী সেন্ট্রাল", "ফারুক হোসেন", "sylhet@buscentral.com"),
        ("৮. রাজশাহী (RAJ-08)", "রেলগেট স্টেশন", "সোহেল রানা", "rajshahi@buscentral.com"),
        ("৯. বগুড়া (BOG-09)", "সাতমাথা সার্কেল", "আনোয়ার পারভেজ", "bogura@buscentral.com"),
        ("১০. খুলনা (KHU-10)", "সোনাডাঙ্গা টার্মিনাল", "তরিকুল ইসলাম", "khulna@buscentral.com")
    ]

    card_w = Inches(2.22)
    card_h = Inches(1.9)
    gap_x = Inches(0.16)
    gap_y = Inches(0.2)
    start_x = Inches(0.8)
    start_y = Inches(1.8)

    for idx, (c_name, c_loc, c_mgr, c_email) in enumerate(counters_data_10):
        row = idx // 5
        col = idx % 5
        cx = start_x + col * (card_w + gap_x)
        cy = start_y + row * (card_h + gap_y)

        card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, cy, card_w, card_h)
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_LIGHT
        card.line.color.rgb = COLOR_BORDER

        tb = slide2.shapes.add_textbox(cx + Inches(0.12), cy + Inches(0.1), card_w - Inches(0.24), card_h - Inches(0.2))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = c_name
        p1.font.size = Pt(10.5)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_TEXT_MAIN
        p1.space_after = Pt(2)

        p2 = tf.add_paragraph()
        p2.text = f"📍 {c_loc}"
        p2.font.size = Pt(9)
        p2.font.color.rgb = COLOR_TEXT_MUTED

        p3 = tf.add_paragraph()
        p3.text = f"👤 {c_mgr}"
        p3.font.size = Pt(9)
        p3.font.color.rgb = COLOR_TEXT_MUTED
        p3.space_after = Pt(4)

        p4 = tf.add_paragraph()
        p4.text = f"🔑 {c_email.split('@')[0]}"
        p4.font.size = Pt(8.5)
        p4.font.bold = True
        p4.font.color.rgb = COLOR_PRIMARY

    # Bottom summary bar
    summary_box = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.25), Inches(11.7), Inches(0.75))
    summary_box.fill.solid()
    summary_box.fill.fore_color.rgb = RGBColor(238, 242, 255)
    summary_box.line.color.rgb = COLOR_PRIMARY_LIGHT
    s_tf = summary_box.text_frame
    sp = s_tf.paragraphs[0]
    sp.text = "🎯 সিস্টেমের মূল বৈশিষ্ট্য: ১০টি কাউন্টারের নিজস্ব সেলস অফিসার কেবল তাদের কাউন্টারের বাসের তথ্য ও টিকেট ম্যানেজ করবেন, আর সেন্ট্রাল অ্যাডমিন ১০টি কাউন্টারের সামগ্রিক গতিবিধি এক নজরে তদারকি করবেন।"
    sp.font.size = Pt(10.5)
    sp.font.color.rgb = COLOR_PRIMARY

    # =========================================================================
    # SLIDE 3: AUTHENTICATION & LOGIN PORTAL (IMAGE: 02_login_sales.png)
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3, COLOR_BG_LIGHT)
    add_header(slide3, "Authentication Portal", "লগইন সিস্টেম ও ১০টি কাউন্টারের আলাদা ক্রেডেনশিয়াল", "সেন্ট্রাল অ্যাডমিন ও প্রতিটি টার্মিনালের জন্য সম্পূর্ণ পৃথক এবং নিরাপদ লগইন সুবিধা")

    img_path1 = os.path.join(assets_dir, "02_login_sales.png")
    if os.path.exists(img_path1):
        slide3.shapes.add_picture(img_path1, Inches(0.8), Inches(1.8), width=Inches(7.2))

    feat_box = slide3.shapes.add_textbox(Inches(8.3), Inches(1.8), Inches(4.2), Inches(5.0))
    ftf = feat_box.text_frame
    ftf.word_wrap = True

    items = [
        ("🔐 Role-Based Access Control", "সুপার অ্যাডমিন এবং কাউন্টার সেলসের জন্য আলাদা দুটি লগইন গেটওয়ে।"),
        ("🏢 10 Independent Credentials", "১০টি কাউন্টারের জন্য ১০টি নিজস্ব ইমেইল ও পাসওয়ার্ড সেট করা রয়েছে (যেমন: sayedabad@buscentral.com, khulna@buscentral.com)।"),
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
    add_header(slide4, "Super Admin Dashboard", "সুপার অ্যাডমিন সেন্ট্রাল মনিটরিং ড্যাশবোর্ড", "সারাদেশের ১০টি কাউন্টারে আজ কয়টি বাস গেল, কখন গেল এবং কতটি সিট খালি আছে তার লাইভ কন্ট্রোল রুম")

    img_path2 = os.path.join(assets_dir, "03_admin_dashboard.png")
    if os.path.exists(img_path2):
        slide4.shapes.add_picture(img_path2, Inches(0.8), Inches(1.8), width=Inches(7.3))

    feat_box4 = slide4.shapes.add_textbox(Inches(8.4), Inches(1.8), Inches(4.1), Inches(5.0))
    ftf4 = feat_box4.text_frame
    ftf4.word_wrap = True

    admin_highlights = [
        ("📊 4 Real-Time Fleet Metrics", "আজকের মোট বাস, ছেড়ে যাওয়া বাস (Departed), বোর্ডিং (Boarding) এবং মোট খালি সিটের লাইভ পরিসংখ্যান।"),
        ("🏢 10 Terminals Live Grid", "প্রতিটি কাউন্টারের জন্য আলাদা স্ট্যাটাস কার্ড—যেখানে পরবর্তী বাস ছাড়ার সময়, গন্তব্য ও খালি সিট স্পষ্ট দেখা যায়।"),
        ("🚌 Nationwide Trips Audit", "সারাদেশের যেকোনো বাসের নম্বর, সময়, মোট সিট, বুকড সিট ও ভাড়া সরাসরি নজরদারি করার সুবিধা।"),
        ("🔍 Quick Filter & Search", "কাউন্টার সিলেক্ট করে ফিল্টার করা এবং বাস নম্বর বা গন্তব্য সার্চ করে তাৎক্ষণিক তথ্য পাওয়া।"),
        ("💰 Revenue Supervision", "সব ১০টি কাউন্টার মিলিয়ে মোট কত টাকার টিকেট বিক্রি হলো তার কেন্দ্রীয় রাজস্ব নিরীক্ষা।")
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

    img_path3 = os.path.join(assets_dir, "04_admin_seat_map.png")
    if os.path.exists(img_path3):
        slide5.shapes.add_picture(img_path3, Inches(0.8), Inches(1.8), height=Inches(5.0))

    right_box = slide5.shapes.add_textbox(Inches(6.2), Inches(1.8), Inches(6.3), Inches(5.0))
    rtf = right_box.text_frame
    rtf.word_wrap = True

    seat_points = [
        ("💺 বাস্তবসম্মত ২x২ বাস সিট প্ল্যান (Physical Bus Layout)", "সামনের ড্রাইভার কেবিন, প্রবেশদ্বার (Door), মাঝখানের চলাচলের আইল (Aisle) এবং পিছনের ইঞ্জিন ক্যাবিন সহ নিখুঁত লেআউট।"),
        ("🟢 সবুজ রঙ = খালি সিট (Available Seats)", "যেসব সিট এখনও বিক্রি হয়নি বা যাত্রী উঠেনি তা গাঢ় সবুজ ব্যাজে দৃশ্যমান থাকে।"),
        ("🔴 লাল রঙ = বুকড সিট (Booked Passengers)", "যাত্রী কনফার্ম হওয়া সিটগুলো তাৎক্ষণিকভাবে লাল রঙে রূপান্তরিত হয়।"),
        ("🔎 বাস ভিত্তিক স্বচ্ছতা (Total Transparency)", "অ্যাডমিন ১০টি কাউন্টারের যেকোনো বাসের 'সিট দেখুন' বাটনে ক্লিক করলেই এই পপআপ ওপেন হয়ে যায়।"),
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

    img_path4 = os.path.join(assets_dir, "05_sales_dashboard.png")
    if os.path.exists(img_path4):
        slide6.shapes.add_picture(img_path4, Inches(0.8), Inches(1.8), width=Inches(7.3))

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

    img_path6 = os.path.join(assets_dir, "07_sales_ticket_receipt.png")
    if os.path.exists(img_path6):
        slide8.shapes.add_picture(img_path6, Inches(0.8), Inches(1.8), height=Inches(5.0))

    right_box8 = slide8.shapes.add_textbox(Inches(6.2), Inches(1.8), Inches(6.3), Inches(5.0))
    rtf8 = right_box8.text_frame
    rtf8.word_wrap = True

    ticket_features = [
        ("🎫 স্বয়ংক্রিয় ইউনিক টিকেট নম্বর (e.g. TKT-7821)", "প্রতিটি সফল বুকিংয়ে স্বয়ংক্রিয়ভাবে অদ্বিতীয় টিকেট আইডি তৈরি হয়।"),
        ("📄 সম্পূর্ণ ভ্রমণের বিবরণ সমৃদ্ধ রিসিট", "কাউন্টার নাম, বাসের নম্বর, গন্তব্য, ছাড়ার নির্ধারিত সময়, সিট নম্বর এবং ভাড়া পরিষ্কারভাবে মুদ্রিত থাকে।"),
        ("🖨️ ১-ক্লিক থার্মাল / পেপার প্রিন্টিং", "'প্রিন্ট করুন' বাটনে ক্লিক করলেই ব্রাউজারের প্রিন্ট ডায়ালগ ওপেন হয় এবং স্লিপ প্রিন্ট হয়ে যায়।"),
        ("📋 আজকের প্যাসেঞ্জার ম্যানিফেস্ট (Passenger Manifest)", "বাস ছাড়ার আগে সব যাত্রীর নাম ও ফোনের তালিকা নিয়ে সুপারভাইজার সহজেই বোর্ডিং সম্পন্ন করতে পারেন।"),
        ("🔒 নির্ভরযোগ্য অডিট ট্রেইল", "১০টি কাউন্টার থেকে কয়টি টিকেট ইস্যু হলো এবং কত টাকা আদায় হলো তা সাথে সাথে সংরক্ষিত থাকে।")
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
    # SLIDE 9: EXECUTIVE SUMMARY & BUSINESS ADVANTAGES
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide9, COLOR_BG_DARK)
    add_header(slide9, "Executive Summary", "সিস্টেমের প্রযুক্তিগত উৎকর্ষ ও ব্যবসায়িক সুবিধাসমূহ", "বাস ফ্লিট পরিচালনায় ১০০% আধুনিকীকরণ, স্বচ্ছতা এবং আয়ের সর্বোচ্চ সুরক্ষা", dark=True)

    summary_cards = [
        ("🚀 সেন্ট্রাল হেডকোয়ার্টার ভিজিবিলিটি", "প্রধান অ্যাডমিন অফিসে বসেই ১০টি টার্মিনালের সকল বাসের অবস্থান ও খালি সিটের রিয়েল-টাইম তথ্য পাচ্ছেন।"),
        ("⚡ টার্মিনালগুলোর বিকেন্দ্রীভূত স্বাধীনতা", "১০টি কাউন্টারের সেলস টিম স্বাধীনভাবে তাদের বাসের শিডিউল ম্যানেজ ও দ্রুত টিকেট বুকিং করতে পারছে।"),
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

    # =========================================================================
    # SLIDE 10: 2-3 MONTHS FULL DEVELOPMENT TIMELINE & ROADMAP (10 Counters)
    # =========================================================================
    slide10 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide10, COLOR_BG_LIGHT)
    add_header(slide10, "Development Roadmap", "সম্পূর্ণ প্রজেক্ট ডেভেলপমেন্ট টাইমলাইন (২-৩ মাস / ১০-১২ সপ্তাহ)", "UI/UX ডিজাইন, রেসপন্সিভ লেআউট, ব্যাকএন্ড API, ডাটাবেস আর্কিটেকচার ও রোল ম্যানেজমেন্ট (RBAC)")

    timeline_phases = [
        {
            "phase": "PHASE 1 (Week 1 - 3)",
            "title": "UI/UX & Responsive Frontend",
            "tag": "১ম মাস • ফ্রন্টএন্ড ডিজাইন",
            "color": COLOR_PRIMARY,
            "badge_bg": RGBColor(238, 242, 255),
            "points": [
                ("🎨 UI/UX Wireframing", "Tailwind CSS ও Figma ডিজাইন সিস্টেম তৈরি।"),
                ("📱 100% Responsive Design", "ডেস্কটপ সাইডবার ও মোবাইল ড্রয়ার লেআউট।"),
                ("💺 2x2 Seat Map Component", "বাসের ফিজিক্যাল আসন বিন্যাস ও গ্রিন/রেড স্টেট।"),
                ("🏢 10 Counter Card Modules", "১০টি কাউন্টার স্ট্যাটাস উইজেট ও ডিপারচার টেবিল।"),
                ("⚡ Client-Side Validation", "টিকেট বুকিং ও বাস CRUD ইনপুট ভ্যালিডেশন।")
            ]
        },
        {
            "phase": "PHASE 2 (Week 4 - 6)",
            "title": "Backend API & Database",
            "tag": "১.৫ মাস • ডাটাবেস ও এপিআই",
            "color": RGBColor(14, 165, 233),
            "badge_bg": RGBColor(240, 249, 255),
            "points": [
                ("🗄️ Database Architecture", "PostgreSQL/MySQL রিলেশনাল স্কিমা ডিজাইন।"),
                ("🔗 RESTful API Development", "বাস ট্রিপ, ১০টি কাউন্টার ও সিট কুয়েরি এন্ডপয়েন্টস।"),
                ("🔒 Concurrency & Seat Locking", "একই সিট ডাবল বুকিং হওয়া বন্ধে Locking লজিক।"),
                ("🔑 Auth & JWT Security", "পাসওয়ার্ড হ্যাশিং, টোকেন ও সেশন গার্ড।"),
                ("⚡ Caching & Optimization", "Redis দিয়ে দ্রুত সিট স্ট্যাটাস রেসপন্স টাইম।")
            ]
        },
        {
            "phase": "PHASE 3 (Week 7 - 9)",
            "title": "RBAC Roles & POS Engine",
            "tag": "২য় মাস • রোল ও বুকিং ইঞ্জিন",
            "color": COLOR_AMBER,
            "badge_bg": COLOR_AMBER_LIGHT,
            "points": [
                ("🛡️ Strict Multi-Role RBAC", "Super Admin HQ বনাম ১০টি কাউন্টার সেলস পারমিশন।"),
                ("🎫 POS Ticket Generator", "ইউনিক টিকেট আইডি ও থার্মাল প্রিন্ট ইঞ্জিন।"),
                ("📡 Real-Time WebSockets", "কাউন্টার থেকে সিট কাটলে হেডকোয়ার্টারে লাইভ সিঙ্ক।"),
                ("💰 Daily Revenue Accounting", "১০টি কাউন্টারভিত্তিক ক্যাশ ও বিক্রির হিসেব।"),
                ("📋 Passenger Manifest Export", "বাস সুপারভাইজারের জন্য প্যাসেঞ্জার শিট তৈরি।")
            ]
        },
        {
            "phase": "PHASE 4 (Week 10 - 12)",
            "title": "Integration, QA & Deployment",
            "tag": "৩য় মাস • টেস্টিং ও লাইভ",
            "color": COLOR_EMERALD,
            "badge_bg": COLOR_EMERALD_LIGHT,
            "points": [
                ("🧪 Full-Scale Load Testing", "১০টি কাউন্টার থেকে একসাথে ৫০০+ রিকুয়েস্ট টেস্ট।"),
                ("📲 SMS Gateway Integration", "যাত্রীর ফোনে স্বয়ংক্রিয় টিকেট কনফার্মেশন SMS।"),
                ("☁️ Production Cloud Setup", "Docker, NGINX SSL, AWS/VPS ও CI/CD পাইপলাইন।"),
                ("🚍 Pilot Terminal Launch", "সায়েদাবাদ ও গাবতলী কাউন্টারে পাইলট রান।"),
                ("🎓 Staff Training & Handover", "১০ কাউন্টার কর্মীদের ট্রেনিং ও ফাইনাল ডেলিভারি।")
            ]
        }
    ]

    col_w = Inches(2.8)
    col_gap = Inches(0.18)
    t_start_x = Inches(0.8)
    t_start_y = Inches(1.75)

    for i, p_data in enumerate(timeline_phases):
        px = t_start_x + i * (col_w + col_gap)
        
        p_card = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, px, t_start_y, col_w, Inches(4.5))
        p_card.fill.solid()
        p_card.fill.fore_color.rgb = COLOR_CARD_LIGHT
        p_card.line.color.rgb = COLOR_BORDER

        pill = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, px + Inches(0.12), t_start_y + Inches(0.12), col_w - Inches(0.24), Inches(0.32))
        pill.fill.solid()
        pill.fill.fore_color.rgb = p_data["badge_bg"]
        pill.line.color.rgb = p_data["color"]
        pltf = pill.text_frame
        plp = pltf.paragraphs[0]
        plp.alignment = PP_ALIGN.CENTER
        plp.text = p_data["phase"]
        plp.font.size = Pt(9)
        plp.font.bold = True
        plp.font.color.rgb = p_data["color"]

        ctb = slide10.shapes.add_textbox(px + Inches(0.14), t_start_y + Inches(0.5), col_w - Inches(0.28), Inches(3.9))
        ctf = ctb.text_frame
        ctf.word_wrap = True

        p_main_title = ctf.paragraphs[0]
        p_main_title.text = p_data["title"]
        p_main_title.font.size = Pt(11.5)
        p_main_title.font.bold = True
        p_main_title.font.color.rgb = COLOR_TEXT_MAIN
        p_main_title.space_after = Pt(2)

        p_tagline = ctf.add_paragraph()
        p_tagline.text = p_data["tag"]
        p_tagline.font.size = Pt(9)
        p_tagline.font.bold = True
        p_tagline.font.color.rgb = p_data["color"]
        p_tagline.space_after = Pt(8)

        for b_head, b_desc in p_data["points"]:
            p_bh = ctf.add_paragraph()
            p_bh.text = b_head
            p_bh.font.size = Pt(9.5)
            p_bh.font.bold = True
            p_bh.font.color.rgb = COLOR_TEXT_MAIN

            p_bd = ctf.add_paragraph()
            p_bd.text = b_desc
            p_bd.font.size = Pt(8.5)
            p_bd.font.color.rgb = COLOR_TEXT_MUTED
            p_bd.space_after = Pt(4)

    # Bottom Milestone Banner
    bm_banner = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.35), Inches(11.7), Inches(0.7))
    bm_banner.fill.solid()
    bm_banner.fill.fore_color.rgb = RGBColor(238, 242, 255)
    bm_banner.line.color.rgb = COLOR_PRIMARY_LIGHT
    bm_tf = bm_banner.text_frame
    bmp = bm_tf.paragraphs[0]
    bmp.alignment = PP_ALIGN.CENTER
    bmp.text = "🏁 টার্গেট টাইমফ্রেম: ২ থেকে ৩ মাস (১০-১২ সপ্তাহ) • ফলাফল: ১০০% স্বয়ংক্রিয়, নিরাপদ ও ১০টি কাউন্টারে তাৎক্ষণিক লাইভ প্রোডাকশন সফটওয়্যার"
    bmp.font.size = Pt(11)
    bmp.font.bold = True
    bmp.font.color.rgb = COLOR_PRIMARY

    # =========================================================================
    # SLIDE 11: THANK YOU / CLOSING PAGE (10 Terminals)
    # =========================================================================
    slide11 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide11, COLOR_BG_DARK)

    c_box = slide11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(1.0), Inches(10.33), Inches(5.5))
    c_box.fill.solid()
    c_box.fill.fore_color.rgb = COLOR_CARD_DARK
    c_box.line.color.rgb = RGBColor(51, 65, 85)

    t_box = slide11.shapes.add_textbox(Inches(2.0), Inches(1.3), Inches(9.33), Inches(4.9))
    ttf = t_box.text_frame
    ttf.word_wrap = True

    tp1 = ttf.paragraphs[0]
    tp1.alignment = PP_ALIGN.CENTER
    tp1.text = "THANK YOU!"
    tp1.font.size = Pt(40)
    tp1.font.bold = True
    tp1.font.color.rgb = COLOR_TEXT_LIGHT
    tp1.space_after = Pt(2)

    tp2 = ttf.add_paragraph()
    tp2.alignment = PP_ALIGN.CENTER
    tp2.text = "আপনাদের মূল্যবান সময় ও মনোযোগের জন্য আন্তরিক ধন্যবাদ"
    tp2.font.size = Pt(18)
    tp2.font.bold = True
    tp2.font.color.rgb = COLOR_PRIMARY_LIGHT
    tp2.space_after = Pt(14)

    tp3 = ttf.add_paragraph()
    tp3.alignment = PP_ALIGN.CENTER
    tp3.text = "Questions & Discussion (প্রশ্নোত্তর ও আলোচনা)"
    tp3.font.size = Pt(15)
    tp3.font.bold = True
    tp3.font.color.rgb = COLOR_EMERALD
    tp3.space_after = Pt(18)

    p_tags = ttf.add_paragraph()
    p_tags.alignment = PP_ALIGN.CENTER
    p_tags.text = "🚌 10 Terminals Connected   •   🛡️ Centralized Control   •   ⚡ 2-3 Months Ready to Deliver"
    p_tags.font.size = Pt(12)
    p_tags.font.bold = True
    p_tags.font.color.rgb = RGBColor(226, 232, 240)
    p_tags.space_after = Pt(24)

    tp4 = ttf.add_paragraph()
    tp4.alignment = PP_ALIGN.CENTER
    tp4.text = "আপনার বাস সার্ভিসের ১০টি কাউন্টারে এই অত্যাধুনিক সিস্টেমটি সফলভাবে তৈরি ও বাস্তবায়ন করতে আমরা সম্পূর্ণ প্রস্তুত!"
    tp4.font.size = Pt(13)
    tp4.font.color.rgb = RGBColor(148, 163, 184)
    tp4.space_after = Pt(16)

    tp5 = ttf.add_paragraph()
    tp5.alignment = PP_ALIGN.CENTER
    tp5.text = "Project Team: Advanced Full-Stack Engineering • Central Bus Desk Systems"
    tp5.font.size = Pt(10)
    tp5.font.color.rgb = RGBColor(100, 116, 139)

    prs.save(output_pptx)
    print(f"Presentation successfully updated with 10 counters at: {output_pptx}")

if __name__ == "__main__":
    create_presentation()
