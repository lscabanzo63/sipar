import {
  siFacebook,
  siInstagram,

} from "simple-icons";

const socialLinks = [
  { href: "#", label: "Facebook", icon: siFacebook },
  { href: "#", label: "Instagram", icon: siInstagram },
];
export default function SocialNav() {
  return (
    <nav className="flex items-center gap-4">
      {socialLinks.map(({ href, label, icon }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          className="opacity-80 hover:opacity-100 transition-opacity"
          dangerouslySetInnerHTML={{ __html: icon.svg }}
          style={{
            width: 20,
            height: 20,
            display: "inline-block",
            fill: "#fff",
          }}
        />
      ))}
    </nav>
  );
}
