import type { Metadata } from "next";
import { HeritageImage } from "@/components/marketing/HeritageImage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what you are building. Email hello@teknaija.ng or message +234 803 044 0935. Office in Apapa, Lagos.",
};

const EMAIL = "hello@teknaija.ng";
const WHATSAPP_DISPLAY = "+234 803 044 0935";
const WHATSAPP_E164 = "2348030440935";

export default function ContactPage() {
  return (
    <section
      aria-labelledby="contact-heading"
      className="
        relative
        mx-auto w-full max-w-[1440px]
        px-5 sm:px-8 lg:px-14
        pt-24 lg:pt-40 pb-32
      "
    >
      {/* Fabric — fixed, full-viewport ground beneath everything else. */}
      <HeritageImage
        src="/fabric_2.jpeg"
        positionClassName="fixed inset-0 -z-10"
        opacity={0.04}
        blendMode="screen"
        maskImage="radial-gradient(ellipse 80% 75% at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)"
        sizes="100vw"
      />
      <HeritageImage
        src="/calabash.jpeg"
        positionClassName="absolute right-0 bottom-0 h-[80vh] w-[60vw] max-w-[820px] -z-10"
        opacity={0.20}
        blendMode="luminosity"
        maskImage="linear-gradient(to bottom right, transparent 0%, transparent 22%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,1) 90%)"
        sizes="(min-width: 1366px) 820px, 60vw"
        objectPosition="right bottom"
      />
      <p className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre">
        <span aria-hidden className="mr-3 inline-block h-px w-8 align-middle bg-ochre" />
        Contact
      </p>

      <h1
        id="contact-heading"
        className="
          mt-8 font-serif font-optical-display
          text-[clamp(2.75rem,9vw,7rem)]
          leading-[0.96] tracking-[-0.014em]
          text-foreground max-w-[20ch]
        "
      >
        Tell us what you are building.
      </h1>

      <div className="mt-16 lg:mt-24 grid grid-cols-12 gap-x-6 gap-y-12">
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-12">
          <ContactLine
            label="By email"
            href={`mailto:${EMAIL}`}
            value={EMAIL}
          />
          <ContactLine
            label="By WhatsApp"
            href={`https://wa.me/${WHATSAPP_E164}`}
            value={WHATSAPP_DISPLAY}
            external
          />
        </div>

        <aside className="col-span-12 lg:col-span-5 lg:pl-10 flex flex-col gap-10">
          <Block label="Office">
            <address className="not-italic font-sans text-[1rem] leading-[1.6] text-foreground">
              5 Bauchi Link Street
              <br />
              Apapa, Lagos
              <br />
              Federal Republic of Nigeria
            </address>
          </Block>

          <Block label="Hours">
            <p className="font-sans text-[1rem] leading-[1.6] text-foreground">
              Monday – Friday
              <br />
              09:00 – 18:00 WAT
            </p>
            <p className="mt-3 font-mono text-[0.7rem] tracking-[0.18em] uppercase text-foreground-muted">
              UTC+1, no daylight saving
            </p>
          </Block>

          <Block label="On record">
            <p className="font-mono text-[0.85rem] leading-[1.6] text-foreground">
              TEK NAIJA LIMITED
              <br />
              RC 9181824
              <br />
              Incorporated 08.01.2026
            </p>
          </Block>
        </aside>
      </div>

      <p className="mt-24 lg:mt-32 max-w-[60ch] font-serif italic text-foreground-muted text-[1.15rem] leading-[1.55] border-t border-border-subtle pt-10">
        We do not run a contact form. Serious enquiries reach us in person; the
        absence of friction is the message.
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function ContactLine({
  label,
  href,
  value,
  external,
}: {
  label: string;
  href: string;
  value: string;
  external?: boolean;
}) {
  return (
    <div className="border-t border-border-subtle pt-8">
      <p className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre">
        {label}
      </p>
      <a
        href={href}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="
          group mt-5 inline-flex items-baseline gap-3
          font-mono text-foreground
          text-[clamp(1.5rem,4.4vw,2.75rem)]
          tracking-[-0.005em] leading-[1.1]
          transition-colors hover:text-terracotta
        "
      >
        <span className="border-b border-ochre/60 pb-1 transition-colors group-hover:border-terracotta">
          {value}
        </span>
        <span
          aria-hidden
          className="inline-block text-ochre text-[0.7em] translate-x-0 transition-transform duration-300 ease-out group-hover:translate-x-1.5"
        >
          →
        </span>
      </a>
    </div>
  );
}

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border-subtle pt-6">
      <p className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre mb-4">
        {label}
      </p>
      {children}
    </div>
  );
}
