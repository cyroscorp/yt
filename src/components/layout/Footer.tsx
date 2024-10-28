import { FaXTwitter, FaInstagram, FaDribbble, FaGithub, FaLinkedinIn } from "react-icons/fa6";

// Define the type for social links
type SocialIcon = "FaXTwitter" | "FaInstagram" | "FaDribbble" | "FaGithub" | "FaLinkedinIn";

interface SocialLink {
  icon: SocialIcon; // Use the defined type for icons
  link: string;
}

// Create a mapping for icons
const iconMap = {
  FaXTwitter,
  FaInstagram,
  FaDribbble,
  FaGithub,
  FaLinkedinIn,
};

// Define social links directly in the component
const socialLinks: SocialLink[] = [
  {
    icon: "FaXTwitter",
    link: "https://x.com/moderneraxarjun?t=XEC7mJ5T5aZzrO7JkunOdg&s=09",
  },
  {
    icon: "FaInstagram",
    link: "https://www.instagram.com/arjuncodr/",
  },
  {
    icon: "FaGithub",
    link: "https://github.com/cyroscorp",
  },
  {
    icon: "FaLinkedinIn",
    link: "https://www.linkedin.com/in/arjun-kumar-dubey-1b528a327/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
  },
  {
    icon: "FaDribbble",
    link: "https://portfolioakd.vercel.app", // Example link; replace with your actual link if needed
  },
];

export default function Social() {
  return (
    <div className="px-2">
      <div className="flex items-center justify-between px-7 py-7 bg-gray-100 rounded-lg">
        <div className="font-medium text-lg flex items-center gap-x-2">
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
          Follow Me
        </div>
        <div className="flex gap-x-1">
          {socialLinks.map((socialLink, index) => {
            const IconComponent = iconMap[socialLink.icon];

            return (
              <a
                key={index}
                href={socialLink.link}
                className="bg-white p-2 rounded-full duration-300 border-2 border-gray-100 hover:border-gray-200 drop-shadow-sm"
                target="_blank"
                rel="noopener noreferrer" // Improve security for external links
              >
                <IconComponent size={20} />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
