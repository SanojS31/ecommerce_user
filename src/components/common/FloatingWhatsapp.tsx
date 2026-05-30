import { MessageCircle } from "lucide-react";

const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917305228722";

export default function FloatingWhatsapp() {
  const message = encodeURIComponent(
    "Hi Mirni Collections, I need help with shopping."
  );

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_rgba(37,211,102,0.35)] transition hover:-translate-y-0.5 hover:bg-[#1ebe5d] focus:outline-none focus:ring-4 focus:ring-green-200"
    >
      <MessageCircle size={27} strokeWidth={2.4} />
    </a>
  );
}
