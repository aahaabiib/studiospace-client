import { ShieldCheck, BadgeCheck, Wrench, Headset } from 'lucide-react';

const items = [
  { icon: ShieldCheck, title: 'Liability Protection', text: 'Every confirmed booking is covered by clear usage terms for hosts and creators.' },
  { icon: BadgeCheck, title: 'Verified Profiles', text: 'Hosts and creators have verified accounts, so you always know who you are working with.' },
  { icon: Wrench, title: 'Equipment Safety', text: 'Security deposits protect studio gear, and listings state exactly what is included.' },
  { icon: Headset, title: '24/7 Host Support', text: 'Questions at midnight before a shoot? Our support team is always online.' },
];

export default function HostGuarantee() {
  return (
    <section id="about" className="scroll-mt-20 bg-gray-50 py-16 dark:bg-gray-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">Host Guarantee &amp; Creator Support</h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
            StudioSpace is built on trust. Here is how we protect both sides of every booking.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="h-full rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-4 inline-flex rounded-xl bg-violet-100 p-3 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}