import WhatsAppIcon from "@mui/icons-material/WhatsApp";
export default function WhatsAppFloat() {

  const phoneNumber = "91956109045"; // replace with your number
  const message = "Hello, I want to know more about your products";

  const whatsappURL =
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed bottom-6 right-6 z-50
        flex items-center justify-center
        w-14 h-14 sm:w-16 sm:h-16
        bg-blue-600 hover:bg-blue-700
        text-white
        rounded-full
        shadow-lg
        transition-all duration-300
        hover:scale-110
      "
    >
      <WhatsAppIcon style={{ fontSize: 32 }} />
    </a>
  );
}