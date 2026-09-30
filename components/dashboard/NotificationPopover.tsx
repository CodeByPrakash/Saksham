"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  Sparkles,
  IndianRupee,
  GraduationCap,
  Calendar,
  X,
  CheckCheck,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export interface NotificationItem {
  id: string;
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  timestamp: string;
  category: "grant" | "training" | "scheme" | "system";
  isRead: boolean;
  actionUrl?: string;
  badge?: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "PM-AJAY Grant Application Sanctioned",
    titleHi: "पीएम-अजय ₹35,000 पूंजीगत अनुदान स्वीकृत",
    message: "Your micro-enterprise grant of ₹35,000 and tool-kit support has been approved by DLM.",
    messageHi: "जिला आजीविका मिशन द्वारा ₹35,000 का उद्यम सहायता अनुदान व आधुनिक टूल किट स्वीकृत कर दिया गया है।",
    timestamp: "10 mins ago (10 मिनट पहले)",
    category: "grant",
    isRead: false,
    badge: "₹35,000 Grant"
  },
  {
    id: "notif-2",
    title: "New NSQF Batch Allotment",
    titleHi: "नया एनएसक्यूएफ ट्रेनिंग बैच प्रारंभ",
    message: "Solar PV Agri-Pump Specialist batch starts on 15th October at PMKK Hub.",
    messageHi: "सोलर पंप व इलेक्ट्रीशियन का नया 90-दिवसीय निःशुल्क बैच 15 अक्टूबर से शुरू हो रहा है।",
    timestamp: "2 hours ago (2 घंटे पहले)",
    category: "training",
    isRead: false,
    badge: "Batch Starting"
  },
  {
    id: "notif-3",
    title: "Monthly Stipend Credited via DBT",
    titleHi: "मासिक वजीफा ₹3,500 बैंक खाते में भेजा गया",
    message: "Direct Benefit Transfer of ₹3,500 has been credited to your Aadhaar-seeded bank account.",
    messageHi: "डीबीटी के माध्यम से ₹3,500 का मासिक वजीफा आपके आधार लिंक बैंक खाते में जमा हो गया है।",
    timestamp: "1 day ago (1 दिन पहले)",
    category: "grant",
    isRead: true,
    badge: "DBT Credited"
  },
  {
    id: "notif-4",
    title: "Livelihood Passport Verified (4/4)",
    titleHi: "आजीविका पासपोर्ट 100% सत्यापित",
    message: "Your skill verification and socio-economic profile mapping is now 100% complete.",
    messageHi: "आपकी शैक्षणिक योग्यता, एनएसक्यूएफ हुनर और आधार प्रोफाइल को डिजिटल रूप से सत्यापित कर दिया गया है।",
    timestamp: "3 days ago (3 दिन पहले)",
    category: "system",
    isRead: true,
    badge: "Verified"
  }
];

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNotification?: (item: NotificationItem) => void;
}

export function NotificationPopover({
  isOpen,
  onClose,
  onSelectNotification
}: NotificationPopoverProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "grant":
        return <IndianRupee className="size-4 text-emerald-600" />;
      case "training":
        return <GraduationCap className="size-4 text-purple-600" />;
      case "system":
        return <ShieldCheck className="size-4 text-blue-600" />;
      default:
        return <Sparkles className="size-4 text-amber-600" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for outside clicks */}
          <div
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs"
          />

          {/* Popover Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-16 right-4 sm:right-16 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-2xl bg-white/10 flex items-center justify-center text-purple-200">
                  <Bell className="size-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base">
                      सूचनाएं व अलर्ट (Notifications)
                    </h3>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold">
                        {unreadCount} नई
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-purple-200/80">
                    पीएम-अजय योजना व ट्रेनिंग अपडेट्स
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[10px] font-bold text-purple-200 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Mark all as read"
                  >
                    <CheckCheck className="size-3" />
                    <span>सभी पढ़ें</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="size-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50/60 divide-y divide-slate-100">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    handleMarkAsRead(item.id);
                    onSelectNotification?.(item);
                  }}
                  className={`pt-2.5 first:pt-0 p-2.5 rounded-2xl transition-all cursor-pointer border ${
                    !item.isRead
                      ? "bg-white border-purple-200 shadow-xs ring-1 ring-purple-100 hover:border-purple-300"
                      : "bg-white/70 border-slate-200/70 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="size-8 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 mt-0.5 border border-purple-100">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-xs sm:text-[13px] text-slate-900 leading-snug truncate">
                          {item.titleHi}
                        </h4>
                        {!item.isRead && (
                          <span className="size-2 rounded-full bg-rose-500 shrink-0 animate-pulse" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        {item.messageHi}
                      </p>
                      <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-slate-100/70 text-[10px] text-slate-400">
                        <span>{item.timestamp}</span>
                        {item.badge && (
                          <span className="font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 bg-white border-t border-slate-100 text-center shrink-0">
              <button
                onClick={onClose}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 text-xs font-bold transition-colors cursor-pointer"
              >
                बंद करें (Close)
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
