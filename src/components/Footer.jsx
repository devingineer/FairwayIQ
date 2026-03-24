const links = ['Features', 'Pricing', 'Privacy', 'Terms', 'Contact']
const hrefs = ['#features', '#pricing', '#', '#', '#']

export default function Footer() {
  return (
    <footer>
      <p>
        <span style={{ fontWeight: 600 }}>FairwayIQ</span> · © 2026
      </p>
      <div className="footer-links">
        {links.map((link, i) => (
          <a key={link} href={hrefs[i]}>{link}</a>
        ))}
      </div>
    </footer>
  )
}