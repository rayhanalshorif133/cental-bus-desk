# 🚌 Inter-District Bus Fleet & 9 Counters Management System

HTML এবং Tailwind CSS দিয়ে তৈরি একটি প্রফেশনাল, আধুনিক এবং সম্পূর্ণ পৃথক **Admin Dashboard** এবং **Sales Dashboard** সমৃদ্ধ বাস সার্ভিস ও টার্মিনাল ম্যানেজমেন্ট সিস্টেম।

---

## 🌟 প্রধান পরিবর্তন ও ফিচারসমূহ (Key Features)

### ১. সম্পূর্ণ পৃথক দুটি ড্যাশবোর্ড (Separate Dashboards)

| ড্যাশবোর্ড | ফাইল | উদ্দেশ্য ও বৈশিষ্ট্য |
|---|---|---|
| **Super Admin Dashboard** | [`admin-dashboard.html`](file:///e:/Rayhan/Practice/demo-bus-panel/admin-dashboard.html) | • সারাদেশের **৯টি টার্মিনাল কাউন্টার** লাইভ মনিটরিং<br>• কোন কাউন্টার থেকে কোন বাস ছাড়লো, গন্তব্য ও ছাড়া সময়<br>• কোন বাসে কতটি সিট খালি আছে তার লাইভ অডিট<br>• ৯টি কাউন্টারের অকুপেন্সি হার ও মোট রেভিনিউ রিপোর্ট |
| **Terminal Sales Dashboard** | [`sales-dashboard.html`](file:///e:/Rayhan/Practice/demo-bus-panel/sales-dashboard.html) | • লগইনকৃত নির্দিষ্ট কাউন্টারের জন্য কাস্টমাইজড ডেস্ক<br>• নতুন বাস ট্রিপ যোগ করা (**Add Bus**), এডিট ও ডিলিট (**CRUD**)<br>• লাইভ ২x২ বাসের সিট প্ল্যান ও খালি সিটে ক্লিক করে **যাত্রীর টিকেট বুকিং**<br>• স্বয়ংক্রিয় **Printable Ticket Receipt** তৈরি<br>• প্যাসেঞ্জার বুকিং হিস্ট্রি ও ম্যানিফেস্ট |

---

## 🔑 ৯টি কাউন্টারের আলাদা লগইন ক্রেডেনশিয়ালস (9 Counters Login Credentials)

লগইন পেইজে ([`login.html`](file:///e:/Rayhan/Practice/demo-bus-panel/login.html)) প্রতিটি কাউন্টারের জন্য রয়েছে পৃথক ইউজার অ্যাকাউন্ট ও পাসওয়ার্ড:

### 🛡️ Super Admin একাউন্ট:
- **ইমেইল**: `admin@buscentral.com`
- **পাসওয়ার্ড**: `admin123`
- **ড্যাশবোর্ড**: `admin-dashboard.html`

### 🎫 ৯টি কাউন্টার সেলস একাউন্টস:

| # | কাউন্টার নাম ও অবস্থান | সেলস ম্যানেজার | ইমেইল (Login Email) | পাসওয়ার্ড |
|---|---|---|---|---|
| **১** | **গাবতলী কাউন্টার (Dhaka)** | রফিকুল ইসলাম | `gabtoli@buscentral.com` | `gabtoli123` |
| **২** | **সায়েদাবাদ কাউন্টার (Dhaka)** | কামাল হোসেন | `sayedabad@buscentral.com` | `sayedabad123` |
| **৩** | **মহাখালী কাউন্টার (Dhaka)** | জাহিদ হাসান | `mohakhali@buscentral.com` | `mohakhali123` |
| **৪** | **উত্তরা কাউন্টার (Dhaka)** | তানভীর আহমেদ | `uttara@buscentral.com` | `uttara123` |
| **৫** | **চট্টগ্রাম জিইসি কাউন্টার** | নাজমুল হুদা | `chittagong@buscentral.com` | `chittagong123` |
| **৬** | **কক্সবাজার কাউন্টার** | মাহবুব আলম | `coxsbazar@buscentral.com` | `coxsbazar123` |
| **৭** | **সিলেট কদমতলী কাউন্টার** | ফারুক হোসেন | `sylhet@buscentral.com` | `sylhet123` |
| **৮** | **রাজশাহী রেলগেট কাউন্টার** | সোহেল রানা | `rajshahi@buscentral.com` | `rajshahi123` |
| **৯** | **বগুড়া সাতমাথা কাউন্টার** | আনোয়ার পারভেজ | `bogura@buscentral.com` | `bogura123` |

> 💡 **টিপ**: [`login.html`](file:///e:/Rayhan/Practice/demo-bus-panel/login.html) পেইজে ড্রপডাউন সিলেক্টর এবং **১-ক্লিক ডিরেক্ট টেস্ট বাটন** দেওয়া আছে, যার মাধ্যমে কোনো কিছু টাইপ না করেও যেকোনো কাউন্টারে এক ক্লিকে লগইন করা যাবে।

---

## 🚀 কিভাবে চালু করে দেখবেন (How to Run)

১. ফোল্ডারে থাকা [`login.html`](file:///e:/Rayhan/Practice/demo-bus-panel/login.html) ফাইলটি ব্রাউজারে ডাবল ক্লিক করে ওপেন করুন।
২. **Admin** সিলেক্ট করে লগইন করলে সরাসরি `admin-dashboard.html`-এ নিয়ে যাবে।
৩. **কাউন্টার সেলস** থেকে যেকোনো একটি কাউন্টার (যেমন: সায়েদাবাদ বা গাবতলী) সিলেক্ট করে লগইন করলে `sales-dashboard.html`-এ নিয়ে যাবে।
৪. সেলস ড্যাশবোর্ডে গিয়ে সিট বুকিং করুন এবং প্রিন্টেবল টিকেট রিসিপ্ট দেখুন।
৫. ডানপাশের **"লগআউট"** বাটনে ক্লিক করলে পুনরায় লগইন পেইজে চলে আসবে।

---

## 📁 ফাইল স্ট্রাকচার (File Structure)
```
demo-bus-panel/
├── login.html              # ৯টি কাউন্টারের আলাদা ক্রেডেনশিয়াল সহ আধুনিক লগইন পোর্টাল
├── admin-dashboard.html    # সুপার অ্যাডমিনের সেন্ট্রাল মনিটরিং ড্যাশবোর্ড
├── admin.js                # অ্যাডমিন ড্যাশবোর্ডের লজিক ও রিয়েল-টাইম ৯ কাউন্টার অডিট
├── sales-dashboard.html    # কাউন্টার সেলস এক্সিকিউটিভদের ডেডিকেটেড ড্যাশবোর্ড
├── sales.js                # সেলস ড্যাশবোর্ডের টিকেট বুকিং, বাস CRUD ও প্রিন্ট রিসিট
├── data.js                 # ৯টি কাউন্টার, অ্যাকাউন্ট ক্রেডেনশিয়ালস ও ট্রিপ স্টোর
├── index.html              # স্মার্ট গেটওয়ে রাউটার
└── README.md               # প্রজেক্ট ডকুমেন্টেশন
```
