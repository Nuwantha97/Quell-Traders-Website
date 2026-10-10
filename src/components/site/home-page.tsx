"use client";

import {
  Activity,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BadgeCheck,
  Blocks,
  CarFront,
  Check,
  CheckCircle2,
  CircleDot,
  Cpu,
  CupSoda,
  Droplet,
  Gauge,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Package,
  Plane,
  Printer,
  Recycle,
  Settings,
  ShieldCheck,
  Sparkles,
  Wind,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { site, navLinks, formCopy } from "@/config/site";
import {
  about,
  clients,
  competitiveEdges,
  divisions,
  heroFeatures,
  industries,
  pageCopy,
  printerBenefits,
  specifications,
  sustainabilityFooter,
  sustainabilityItems,
} from "@/data/site-content";
import { BrandMark } from "./brand-mark";
import { ContactForm } from "./contact-form";
import { SectionHeading } from "./section-heading";
import { ImageGalleryLightbox } from "./image-lightbox";
import { MapEmbed } from "./map-embed";

const icons: Record<string, LucideIcon> = {
  activity: Activity,
  blocks: Blocks,
  car: CarFront,
  check: CheckCircle2,
  cpu: Cpu,
  cup: CupSoda,
  droplet: Droplet,
  gauge: Gauge,
  leaf: Leaf,
  mail: Mail,
  map: MapPin,
  package: Package,
  plane: Plane,
  printer: Printer,
  recycle: Recycle,
  settings: Settings,
  shield: ShieldCheck,
  sparkles: Sparkles,
  wind: Wind,
  badge: BadgeCheck,
};

export function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  const Icon = icons[icon] ?? CircleDot;
  return (
    <article className="feature-card">
      <span className="feature-card__icon" aria-hidden="true"><Icon size={20} strokeWidth={1.8} /></span>
      <div><h3>{title}</h3><p>{description}</p></div>
    </article>
  );
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Content is always rendered visible (server HTML included), so slow loads never show
  // empty gaps. After hydration only blocks that are still below the fold are hidden, and
  // they are revealed again as they scroll into view.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    element.style.setProperty("--reveal-delay", `${delay}s`);
    element.classList.add("reveal-pending");

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        element.classList.remove("reveal-pending");
        element.classList.add("reveal-in");
        observer.disconnect();
      },
      { rootMargin: "0px 0px 120px 0px", threshold: 0.01 },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      element.classList.remove("reveal-pending");
    };
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

function FounderMark() {
  const initials = site.founder
    .split(/\s+/)
    .map((namePart) => namePart[0] ?? "")
    .join("");

  return <span className="founder-mark" aria-hidden="true">{initials}</span>;
}

function Navbar({ imageAvailable }: { imageAvailable: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  // The mobile menu must never stay open after the window grows to the desktop layout.
  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 821px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false);
    };
    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <BrandMark compact imageAvailable={imageAvailable} />
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={isOpen ? pageCopy.menuClose : pageCopy.menuOpen}
          aria-controls="primary-navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
        <nav id="primary-navigation" className={`primary-nav${isOpen ? " primary-nav--open" : ""}`} aria-label={pageCopy.primaryNavigation}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setIsOpen(false)}>{link.label}</a>
          ))}
          <a className="button button--nav" href="#contact" onClick={() => setIsOpen(false)}>
            {formCopy.quoteButton} <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
}

function ProductVisual({ imageAvailable }: { imageAvailable: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  return (
    <div className="product-visual">
      <div className="product-visual__halo" aria-hidden="true" />
      <span className="product-visual__label"><span /> {pageCopy.printerLabel}</span>
      {imageAvailable && !imageFailed ? (
        <div className={`product-visual__photo-wrap${photoLoaded ? "" : " is-loading"}`}>
          <Image
            src={site.printerImage}
            alt={pageCopy.printerAlt}
            width={600}
            height={600}
            priority
            sizes="(max-width: 560px) 80vw, (max-width: 820px) 70vw, (max-width: 1060px) 45vw, 480px"
            className="product-visual__photo"
            onLoad={() => setPhotoLoaded(true)}
            onError={() => setImageFailed(true)}
          />
        </div>
      ) : (
        <div className="printer-placeholder" role="img" aria-label={pageCopy.printerPlaceholder}>
          <div className="printer-placeholder__body">
            <div className="printer-placeholder__display"><span /><i /><i /><i /></div>
            <div className="printer-placeholder__brand">{pageCopy.printerBrand} <small>{pageCopy.printerScreenReaderDescription}</small></div>
            <div className="printer-placeholder__vent"><i /><i /><i /><i /></div>
            <div className="printer-placeholder__base" />
            <div className="printer-placeholder__head"><span /></div>
          </div>
          <div className="printer-placeholder__substrate"><span /><span /><span /><span /><span /></div>
          <div className="printer-placeholder__spark printer-placeholder__spark--one" />
          <div className="printer-placeholder__spark printer-placeholder__spark--two" />
        </div>
      )}
      <div className="product-visual__note">
        <span className="product-visual__note-icon"><Check size={17} /></span>
        <span>
          <b>High-Precision<br />Marking</b>
          <small>{pageCopy.precisionDescription}</small>
        </span>
      </div>
      <div className="product-visual__dpi"><strong>{pageCopy.printerResolution}</strong><small>{pageCopy.dpiLabel}</small></div>
    </div>
  );
}

function Hero({ printerImageAvailable }: { printerImageAvailable: boolean }) {
  return (
    <section className="hero-section" id="home">
      <div className="hero-grid-pattern" aria-hidden="true" />
      <div className="container hero-layout">
        <div className="hero-copy">
          <p className="hero-kicker"><span className="status-dot" /> {site.descriptor}</p>
          <h1>{site.taglines.primary.split(". ").map((line, index) => (
            <span key={line} className={index === 1 ? "text-green" : ""}>{line}{index === 0 ? "." : ""}</span>
          ))}</h1>
          <p className="hero-subtext">{site.heroSubtext}</p>
          <div className="hero-actions">
            <a className="button button--primary" href="#contact">{formCopy.requestQuote} <ArrowUpRight size={17} /></a>
            <a className="button button--outline" href="#intro-video"><span className="play-mini">▶</span> {formCopy.watchVideo}</a>
          </div>
          <div className="hero-location"><MapPin size={15} /><span>{site.location}</span><i aria-hidden="true" /><span>Est. {site.founded}</span></div>
        </div>
        <Reveal className="hero-art">
          <ProductVisual imageAvailable={printerImageAvailable} />
          <div className="hero-art__orb hero-art__orb--green" aria-hidden="true" />
          <div className="hero-art__orb hero-art__orb--blue" aria-hidden="true" />
        </Reveal>
      </div>
      <div className="container feature-strip">
        {heroFeatures.map((feature) => <FeatureCard key={feature.title} {...feature} />)}
      </div>
      <a className="hero-scroll" href="#intro-video" aria-label={pageCopy.scrollToExplore}></a>
    </section>
  );
}

export function SpecsTable() {
  return (
    <div className="specs-table-wrap">
      <table className="specs-table">
        <tbody>
          {specifications.map(([label, value], index) => (
            <tr key={label}>
              <th scope="row"><span className="spec-index">{String(index + 1).padStart(2, "0")}</span>{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function IndustryGrid() {
  return (
    <div className="industry-grid">
      {industries.map((industry, index) => {
        const Icon = icons[industry.icon] ?? CircleDot;
        return (
          <Reveal key={industry.name} delay={index * 0.035}>
            <article className="industry-card">
              <span className="industry-card__icon" aria-hidden="true"><Icon size={23} strokeWidth={1.7} /></span>
              <div><h3>{industry.name}</h3>{industry.description && <p>{industry.description}</p>}</div>
              <ArrowUpRight className="industry-card__arrow" size={16} aria-hidden="true" />
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}

export function ClientList() {
  return (
    <div className="client-grid">
      {clients.map((client, index) => (
        <Reveal key={client} delay={index * 0.04}>
          <article className="client-card"><span>{client}</span></article>
        </Reveal>
      ))}
    </div>
  );
}

function Footer({ imageAvailable }: { imageAvailable: boolean }) {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <BrandMark imageAvailable={imageAvailable} />
          <p>{site.taglines.business}</p>
          <span className="footer-location"><MapPin size={15} /> {site.location}</span>
        </div>
        <div className="footer-links">
          <h3>{pageCopy.exploreLabel}</h3>
          {navLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </div>
        <div className="footer-contact">
          <h3>{pageCopy.contactLabel}</h3>
          <a href={site.phoneHref}>{site.phone}</a>
          {site.emails.map((email) => <a key={email} href={`mailto:${email}`}>{email}</a>)}
          <p>{site.address}</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {site.founded} {site.name}. {pageCopy.footerRights}</p>
        <p>{site.taglines.primary}</p>
      </div>
    </footer>
  );
}

function WhatsAppFloatingButton() {
  return (
    <a className="whatsapp-float" href={site.whatsappHref} target="_blank" rel="noreferrer" aria-label="Chat with Quell Traders on WhatsApp">
      <MessageCircle size={23} fill="currentColor" strokeWidth={1.5} />
      <span>{pageCopy.chatOnWhatsApp}</span>
    </a>
  );
}

export function HomePage({
  introVideo,
  logoAvailable,
  printerImageAvailable,
}: {
  introVideo: ReactNode;
  logoAvailable: boolean;
  printerImageAvailable: boolean;
}) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 650);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">{pageCopy.skipToContent}</a>
      <Navbar imageAvailable={logoAvailable} />
      <main id="main-content">
        <Hero printerImageAvailable={printerImageAvailable} />

        <section id="intro-video" className="section intro-section">
          <div className="container intro-layout">
            <Reveal className="intro-copy">
              <SectionHeading title={pageCopy.introTitle} description={site.heroSubtext} />
            </Reveal>
            <Reveal className="intro-video">{introVideo}</Reveal>
          </div>
        </section>

        <section id="about" className="section about-section">
          <div className="container">
            <div className="about-top">
              <Reveal>
                <SectionHeading eyebrow={pageCopy.aboutEyebrow} title={pageCopy.aboutTitle} />
              </Reveal>
              <Reveal className="about-summary"><p>{about.summary}</p><div className="founder-note"><FounderMark /><span><b>{site.founder}</b><small>{site.role} </small></span></div></Reveal>
            </div>
            <div className="vision-mission">
              <Reveal className="statement-card statement-card--vision"><span className="statement-number">{pageCopy.visionMarker}</span><h3>{pageCopy.visionLabel}</h3><p>{about.vision}</p></Reveal>
              <Reveal className="statement-card statement-card--mission" delay={0.08}><span className="statement-number">{pageCopy.missionMarker}</span><h3>{pageCopy.missionLabel}</h3><p>{about.mission}</p></Reveal>
            </div>
            <div className="values-block">
              <SectionHeading eyebrow={pageCopy.valuesEyebrow} title={pageCopy.valuesTitle} />
              <div className="values-grid">
                {about.values.map((value, index) => {
                  const Icon = icons[value.icon] ?? CircleDot;
                  return <Reveal key={value.title} delay={index * 0.035}><article className="value-card"><span className="value-card__icon"><Icon size={20} /></span><h3>{value.title}</h3><p>{value.description}</p></article></Reveal>;
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="solutions" className="section solutions-section">
          <div className="container">
            <Reveal><SectionHeading eyebrow={pageCopy.divisionsEyebrow} title={pageCopy.divisionTitle} /></Reveal>
            <div className="division-grid">
              {divisions.map((division, index) => {
                const Icon = icons[division.icon] ?? CircleDot;
                return (
                  <Reveal key={division.number} delay={index * 0.07}>
                    <article className={`division-card${index === 0 ? " division-card--tij" : " division-card--spares"}`}>
                      <div className="division-card__top"><span className="division-card__number">{division.number}</span><span className="division-card__icon"><Icon size={24} /></span><p>{division.eyebrow}</p></div>
                      <h3>{division.title}</h3>
                      <p className="division-card__intro">{division.intro}</p>
                      {index === 0 && (
                        <ImageGalleryLightbox
                          images={[
                            {
                              src: "/images/tij-system.jpg",
                              alt: "Thermal inkjet (TIJ) printing system",
                            },
                          ]}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                          className="division-media-single-wrap"
                          frameClassName="division-media-single"
                        />
                      )}
                      {division.brands && (
                        <div className="brand-badges-wrap">
                          <p className="brand-badges-label">{pageCopy.brandLabel}</p>
                          <div className="brand-badges">{division.brands.map((brand) => <span key={brand}>{brand}</span>)}</div>
                          <p className="brand-footnote">{division.footnote}</p>
                        </div>
                      )}
                      {index === 1 && (
                        <ImageGalleryLightbox
                          images={[
                            {
                              src: "/images/atlas-copco-air-filter.jpeg",
                              alt: "Atlas Copco air filter element",
                            },
                            {
                              src: "/images/atlas-copco-air-oil-separator.jpeg",
                              alt: "Atlas Copco air/oil separator cartridge",
                            },
                            {
                              src: "/images/compressor-repair-kits-spare-parts.jpeg",
                              alt: "Atlas Copco compressor repair kits and spare parts",
                            },
                            {
                              src: "/images/canister-cartridge-filters.jpeg",
                              alt: "Canister and cartridge industrial filters",
                            },
                          ]}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 380px"
                        />
                      )}
                      <div className="division-benefits">
                        {division.benefits.map((benefit) => <div className="division-benefit" key={benefit.title}><CheckCircle2 size={18} /><div><h4>{benefit.title}</h4><p>{benefit.description}</p></div></div>)}
                      </div>
                      <a className="text-link" href="#contact">{pageCopy.discussRequirements} <ArrowUpRight size={16} /></a>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id="printer-benefits" className="section printer-section">
          <div className="container printer-layout">
            <Reveal className="printer-intro">
              <p className="eyebrow">{pageCopy.thermalInkjet}</p>
              <SectionHeading title={pageCopy.printerBenefitsTitle} />
              <a href="#specifications" className="button button--primary">{pageCopy.viewSpecifications} <ArrowRight size={16} /></a>
            </Reveal>
            <div className="printer-checklist">
              {printerBenefits.map((benefit, index) => <Reveal key={benefit} delay={index * 0.03}><div className="checklist-item"><span><Check size={16} /></span><p>{benefit}</p></div></Reveal>)}
            </div>
          </div>
        </section>

        <section id="specifications" className="section specs-section">
          <div className="container specs-layout">
            <Reveal className="specs-intro">
              <p className="eyebrow">{pageCopy.specsEyebrow}</p>
              <SectionHeading title={pageCopy.specificationsTitle} />
              <div className="specs-aside"><Printer size={22} /><span>{pageCopy.printerLabel}<br />{site.descriptor}</span></div>
            </Reveal>
            <Reveal><SpecsTable /></Reveal>
          </div>
        </section>

        <section id="industries" className="section industries-section">
          <div className="container">
            <Reveal><SectionHeading eyebrow={pageCopy.industryEyebrow} title={pageCopy.industriesTitle} centered /></Reveal>
            <IndustryGrid />
            <p className="industry-extra"><span>{pageCopy.industriesAlsoServingLabel}</span> {pageCopy.industriesAlsoServing.map((item, index) => <span key={item}>{index > 0 && <i />}{item}</span>)}</p>
          </div>
        </section>

        <section id="sustainability" className="sustainability-band" aria-labelledby="sustainability-title">
          <div className="container sustainability-inner">
            <div className="sustainability-heading"><span className="sustainability-icon"><Leaf size={23} /></span><div><h2 id="sustainability-title">{pageCopy.sustainabilityTitle}</h2></div></div>
            <div className="sustainability-items">{sustainabilityItems.map((item) => <div key={item}><span><Check size={14} /></span>{item}</div>)}</div>
            <p className="sustainability-footer">{sustainabilityFooter}</p>
          </div>
        </section>

        <section id="competitive-edge" className="section edge-section">
          <div className="container">
            <Reveal><SectionHeading eyebrow={pageCopy.competitiveEdgeTitle} title={pageCopy.competitiveEdgeTitle} /></Reveal>
            <div className="edge-grid">
              {competitiveEdges.map((edge, index) => {
                const Icon = icons[edge.icon] ?? CircleDot;
                return <Reveal key={edge.title} delay={index * 0.06}><article className="edge-card"><span className="edge-card__icon"><Icon size={21} /></span><span className="edge-card__index">0{index + 1}</span><h3>{edge.title}</h3><p>{edge.description}</p></article></Reveal>;
              })}
            </div>
          </div>
        </section>

        <section id="clients" className="section clients-section">
          <div className="container">
            <Reveal><SectionHeading eyebrow={pageCopy.clientsEyebrow} title={pageCopy.clientsTitle} centered /></Reveal>
            <ClientList />
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="container">
            <div className="contact-heading">
              <Reveal><SectionHeading eyebrow={pageCopy.contactEyebrow} title={pageCopy.contactTitle} /></Reveal>
            </div>
            <div className="contact-layout">
              <Reveal className="contact-information">
                <div className="contact-highlight"><span className="contact-highlight__icon"><MessageCircle size={20} /></span><div><small>{pageCopy.speakWithTeamLabel}</small><a href={site.phoneHref}>{site.phone}</a><a className="whatsapp-link" href={site.whatsappHref} target="_blank" rel="noreferrer">{pageCopy.chatOnWhatsApp} <ArrowUpRight size={14} /></a></div></div>
                <div className="contact-detail"><span><Mail size={18} /></span><div><small>{pageCopy.emailLabel}</small>{site.emails.map((email) => <a key={email} href={`mailto:${email}`}>{email}</a>)}</div></div>
                <div className="contact-detail"><span><MapPin size={18} /></span><div><small>{pageCopy.visitLabel}</small><p>{site.address}</p></div></div>
                <div className="contact-person"><FounderMark /><span><b>{site.founder}</b><small>{site.role}</small></span></div>
                <MapEmbed />
              </Reveal>
              <Reveal><ContactForm /></Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer imageAvailable={logoAvailable} />
      <WhatsAppFloatingButton />
      {showBackToTop && <a className="back-to-top" href="#home" aria-label={pageCopy.backToTop}><ArrowUp size={19} /></a>}
    </>
  );
}
