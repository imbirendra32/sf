import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Cake,
  Camera,
  ChevronDown,
  Crown,
  Heart,
  MapPin,
  Phone,
  Sparkles,
  Star,
  Volume2,
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Petals } from '@/components/Petals';
import { Confetti } from '@/components/Confetti';
import { TiltCard } from '@/components/TiltCard';
import { CountUp } from '@/components/CountUp';
import { PhoneReveal } from '@/components/PhoneReveal';

const photos = [
  { src: 'public/1786807351114104855.png', label: 'Sofia and her tiny royal sidekick', tag: '01 · the queen' },
  { src: 'public/1786807353513507475.png', label: 'A Minecraft moment that got personal', tag: '02 · caught in 4k' },
  { src: 'public/1786807355889281083.png', label: '3,830 km, but somehow close', tag: '03 · ufa to nepal' },
  { src: 'public/1786807358081832978.png', label: 'Our very serious Brawl Stars era', tag: '04 · duo queue' },
];

const reasons = [
  'You are sweet.',
  'You are beautiful.',
  'You are soft-hearted.',
  'You are reliable and keep your promises.',
  "You don't intentionally hurt people and genuinely care about their feelings.",
  'You listen to others and make them feel heard.',
  'You have a high IQ and EQ.',
  'You are really gentle with people.',
  'You have a lot of empathy.',
  'You always give me time, even when you are busy.',
  'You are a really good person to spend time with.',
  'You are a great friend.',
  'You treat people with respect and care about them even when you gain nothing from it.',
  'You are always willing to help people when they need you.',
  "You don't judge people for their mistakes and try to understand them instead.",
  'You are genuinely happy when the people you care about are doing well.',
  'You have a good heart, and it shows in the little things you do.',
  'You make the people around you feel cared for, valued, and safe.',
];

const letterLines = [
  'Dear Sofia,',
  'You thought I forgot your birthday?? Nonono!! (Well, just a little).. because I should have woken up till 00:00 of your time yesterday to wish you a Happy Birthday.. But I still did not forget it. I was busy making this website for you. I\'m still sorry for not greeting you early in the morning, but it was intentional.',
  'Anyway, enough of the apologies, now going straight to the point!!',
  'HAPPY BIRTHDAY SOFIAAA!!!!',
  'I am so glad to be a part of your birthday. How old are you again...? 17?? OMG, YOU ARE A GRANDMA NOW!!! Hahaha. Anyway, I hope this year brings you lots and lots of happiness, and lots of hugs, and kisses, and a boyfriend hopefully ;). I hope your day was full of good food, great gifts, andd good people. And I hope you get everything you want - money, food, gifts, attention and absolutely no responsibilities. And... most importantly, may your period pain go away forever. How will I survive your periods every month 😭💔',
  '(I wanted to send you a gift to your location, but there is no possible way of paying from Nepal to Russia.. I spent 2 hours searching.) BUT, if you come to Nepal in futuree, I\'ll treat you with everythinggg!!!',
  'Finally, You are an amazing person, and you know it yourself. Don\'t forget to stay annoying, stay stupid, and have an absolutely amazing birthday, my favorite idiot. You are 1 year away from being an adult now.. creepy.',
  'Thank you for continuing to exist, please keep it upp ^^',
];

const ui = {
  en: {
    language: 'RU',
    scroll: 'scroll to open',
    private: 'a little something for',
    birthday: 'birthday',
    memories: 'four tiny windows into us',
    distance: 'different places, same little universe',
    distanceCaption: 'We met randomly on Telegram. Now 3,830 km feels like nothing.',
    phoneIntro: 'I never gave you my phone number, so here it is',
    phoneHint: 'scroll a little closer',
    phoneNote: 'now you have no excuse',
    reasonsKicker: '18 reasons',
    reasonsTitle: 'you are easy to love',
    reasonsNote: 'One for every day since we met.',
    letterKicker: 'a letter from nepal',
    letterTitle: 'read this when you miss me',
    letterNote: 'this letter stays in english, just as it was written',
    finale: 'happy birthday, Sofia',
    replay: 'back to the beginning',
  },
  ru: {
    language: 'EN',
    scroll: 'листай, чтобы открыть',
    private: 'кое-что особенное для',
    birthday: 'день рождения',
    memories: 'четыре маленьких окна в нашу историю',
    distance: 'разные места, одна маленькая вселенная',
    distanceCaption: 'Мы познакомились случайно в Telegram. Теперь 3,830 км кажутся пустяком.',
    phoneIntro: 'Я никогда не давал тебе свой номер, так что вот он',
    phoneHint: 'листай чуть ближе',
    phoneNote: 'теперь у тебя нет отговорок',
    reasonsKicker: '18 причин',
    reasonsTitle: 'тебя легко любить',
    reasonsNote: 'По одной за каждый день с нашей встречи.',
    letterKicker: 'письмо из непала',
    letterTitle: 'прочитай, когда будешь скучать',
    letterNote: 'это письмо остаётся на английском, как и было написано',
    finale: 'с днём рождения, София',
    replay: 'в начало',
  },
};

type Language = keyof typeof ui;

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!('IntersectionObserver' in window) || els.length === 0) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [parallax, setParallax] = useState<Record<string, number>>({});
  const parallaxRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);

      const vh = window.innerHeight;
      const next: Record<string, number> = {};
      parallaxRefs.current.forEach((el) => {
        if (!el) return;
        const speed = parseFloat(el.dataset.parallax || '0');
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const offset = (center - vh / 2) / vh;
        next[el.dataset.parallaxId || ''] = offset * speed;
      });
      setParallax(next);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return { progress, parallax, parallaxRefs };
}

function App() {
  const [language, setLanguage] = useLocalStorage<Language>('sofia-lang', 'en');
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const copy = ui[language];
  const { progress, parallax, parallaxRefs } = useScrollProgress();
  useReveal();

  const registerParallax = (id: string, speed: number) => (el: HTMLElement | null) => {
    if (el) {
      el.dataset.parallaxId = id;
      el.dataset.parallax = String(speed);
      if (!parallaxRefs.current.includes(el)) parallaxRefs.current.push(el);
    }
  };

  const numberRotation = useMemo(
    () => `rotateX(${progress * 360 - 18}deg) rotateY(${progress * 180 - 25}deg)`,
    [progress]
  );

  return (
    <main className="birthday-site" style={{ '--scroll-progress': progress } as React.CSSProperties}>
      <div className="progress-line" aria-hidden="true"><span /></div>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Sofia birthday home"><span className="brand-mark"><Heart size={14} fill="currentColor" /></span> sofia / 17</a>
        <div className="topbar-right">
          <span className="topbar-location"><MapPin size={14} /> ufa · nepal</span>
          <button className="language-toggle" onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')} aria-label="Switch language">
            <span>{copy.language}</span><span className="toggle-dot" />
          </button>
        </div>
      </header>

      <section className="hero scene" id="top">
        <div className="hero-glow glow-one" ref={registerParallax('g1', -60)} style={{ transform: `translate3d(0, ${parallax.g1 || 0}px, 0)` }} />
        <div className="hero-glow glow-two" ref={registerParallax('g2', 80)} style={{ transform: `translate3d(0, ${parallax.g2 || 0}px, 0)` }} />
        <Petals count={12} />
        <div className="hero-copy">
          <p className="eyebrow" data-reveal="up"><Sparkles size={14} /> {copy.private}</p>
          <h1 data-reveal="up" style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}>For Sofia<span className="accent-dot">.</span></h1>
          <p className="hero-subtitle" data-reveal="up" style={{ '--reveal-delay': '0.25s' } as React.CSSProperties}>{copy.scroll}<br /><span>there is a little world waiting below</span></p>
        </div>
        <div className="scroll-cue" data-reveal="up" style={{ '--reveal-delay': '0.5s' } as React.CSSProperties}><ArrowDown size={16} /><span>01 / 06</span></div>
        <div className="hero-orbit orbit-one" ref={registerParallax('o1', 40)} style={{ transform: `translate(-50%,-50%) rotate(-28deg) translate3d(0, ${parallax.o1 || 0}px, 0)` }} />
        <div className="hero-orbit orbit-two" ref={registerParallax('o2', -30)} style={{ transform: `translate(-50%,-50%) rotate(36deg) translate3d(0, ${parallax.o2 || 0}px, 0)` }} />
        <div className="tiny-star star-one" ref={registerParallax('s1', 50)} style={{ transform: `translate3d(0, ${parallax.s1 || 0}px, 0)` }}><Star size={14} fill="currentColor" /></div>
        <div className="tiny-star star-two" ref={registerParallax('s2', -45)} style={{ transform: `translate3d(0, ${parallax.s2 || 0}px, 0)` }}><Star size={9} fill="currentColor" /></div>
      </section>

      <section className="number-scene scene">
        <div className="section-meta" data-reveal="up"><span>chapter one</span><span>keep going ↓</span></div>
        <div className="number-stage">
          <div className="number-shadow" />
          <div className="number-three-d" style={{ transform: numberRotation }} aria-label="17">17</div>
          <div className="number-caption" data-reveal="up"><span>seventeen</span><span>the plot thickens</span></div>
        </div>
        <div className="number-copy">
          <p className="eyebrow" data-reveal="right"><Cake size={14} /> {copy.birthday}</p>
          <h2 data-reveal="right" style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}>Not 16.<br /><em>Seventeen.</em></h2>
          <p data-reveal="right" style={{ '--reveal-delay': '0.2s' } as React.CSSProperties}>One year away from being an adult. This feels both illegal and iconic.</p>
        </div>
      </section>

      <section className="wish-scene scene">
        <Petals count={8} />
        <div className="crown-float" data-reveal="down"><Crown size={48} strokeWidth={1.2} /></div>
        <div className="wish-card" data-reveal="scale">
          <div className="card-kicker">a very important announcement</div>
          <h2>Happy <span>17</span>th<br />birthday, Sofia<span className="accent-dot">!</span></h2>
          <div className="card-line" />
          <p>From your favorite annoying idiot<br /><span>somewhere 3,830 km away</span></p>
          <div className="card-stamp"><Heart size={15} fill="currentColor" /> B.S.</div>
        </div>
        <div className="wish-side-note" data-reveal="left">scroll for proof<br />that I tried</div>
      </section>

      <section className="gallery-section section-shell">
        <div className="section-heading">
          <div data-reveal="up"><p className="eyebrow"><Camera size={14} /> {copy.memories}</p><h2>Our little<br /><em>archive.</em></h2></div>
          <p className="heading-note" data-reveal="up" style={{ '--reveal-delay': '0.15s' } as React.CSSProperties}>A small collection of evidence<br />that we are actually friends.</p>
        </div>
        <div className="gallery-grid">
          {photos.map((photo, index) => (
            <figure className={`photo-card photo-${index + 1}`} key={photo.src} data-reveal="up" style={{ '--reveal-delay': `${0.1 + index * 0.12}s` } as React.CSSProperties}>
              <TiltCard max={8}>
                <div className="photo-frame"><img src={photo.src} alt={photo.label} onError={(event) => { event.currentTarget.style.display = 'none'; }} /><div className="photo-fallback"><span>photo {String(index + 1).padStart(2, '0')}</span></div><span className="photo-number">{String(index + 1).padStart(2, '0')}</span></div>
              </TiltCard>
              <figcaption><span>{photo.tag}</span><strong>{photo.label}</strong></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="distance-section scene">
        <div className="distance-copy">
          <p className="eyebrow" data-reveal="up"><MapPin size={14} /> {copy.distance}</p>
          <h2 data-reveal="up" style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}>Ufa <span>↗</span><br /><em>to Kathmandu</em></h2>
          <p data-reveal="up" style={{ '--reveal-delay': '0.2s' } as React.CSSProperties}>{copy.distanceCaption}</p>
        </div>
        <div className="distance-map" data-reveal="scale" aria-label="Map showing distance from Ufa to Kathmandu">
          <div className="map-grid" />
          <div className="map-label map-ufa"><span /> UFA, RU</div>
          <div className="map-label map-nepal"><span /> KATHMANDU</div>
          <div className="route-line" />
          <div className="distance-badge"><strong><CountUp to={3830} /></strong><span>kilometres apart</span></div>
        </div>
      </section>

      <section className="phone-section scene">
        <div className="phone-copy">
          <p className="eyebrow" data-reveal="up"><Phone size={14} /> a missed detail</p>
          <h2 data-reveal="up" style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}>{copy.phoneIntro}<span className="accent-dot">.</span></h2>
          <p className="phone-hint" data-reveal="up" style={{ '--reveal-delay': '0.2s' } as React.CSSProperties}><ChevronDown size={16} /> {copy.phoneHint}</p>
        </div>
        <div className={`phone-reveal ${phoneRevealed ? 'is-visible' : ''}`} data-reveal="scale">
          <PhoneReveal number="+977-9761800750" onRevealStart={() => setPhoneRevealed(true)} />
          <small className="phone-note">{copy.phoneNote}</small>
        </div>
      </section>

      <section className="reasons-section section-shell">
        <div className="section-heading reasons-heading">
          <div data-reveal="up"><p className="eyebrow"><Heart size={14} /> {copy.reasonsKicker}</p><h2>{copy.reasonsTitle}<span className="accent-dot">.</span></h2></div>
          <p className="heading-note" data-reveal="up" style={{ '--reveal-delay': '0.15s' } as React.CSSProperties}>{copy.reasonsNote}<br />Yes, I counted.</p>
        </div>
        <div className="reasons-grid">
          {reasons.map((reason, index) => (
            <div className="reason" key={reason} data-reveal="up" style={{ '--reveal-delay': `${(index % 3) * 0.08}s` } as React.CSSProperties}>
              <span>{String(index + 1).padStart(2, '0')}</span><p>{reason}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="letter-section section-shell">
        <div className="letter-intro" data-reveal="right">
          <p className="eyebrow"><Volume2 size={14} /> {copy.letterKicker}</p>
          <h2>{copy.letterTitle}<span className="accent-dot">.</span></h2>
          <p className="letter-scroll">{copy.letterNote}</p>
        </div>
        <article className="letter-paper" data-reveal="up">
          <div className="paper-top"><span>17 / 08 / 2026</span><span>for Sofia</span></div>
          <div className="letter-body">
            {letterLines.map((line, i) => (
              <p
                key={i}
                className={`letter-line ${line === 'HAPPY BIRTHDAY SOFIAAA!!!!' ? 'letter-shout' : ''}`}
                data-reveal="up"
                style={{ '--reveal-delay': `${i * 0.12}s` } as React.CSSProperties}
              >
                {line}
              </p>
            ))}
            <p className="letter-signoff" data-reveal="up" style={{ '--reveal-delay': `${letterLines.length * 0.12}s` } as React.CSSProperties}>
              Your favorite annoying idiot,<br /><strong>Binam</strong>
            </p>
          </div>
          <div className="paper-flower">✳</div>
        </article>
      </section>

      <section className="finale scene">
        <Confetti />
        <Petals count={10} />
        <div className="finale-orbit" ref={registerParallax('fo', -25)} style={{ transform: `rotate(25deg) translate3d(0, ${parallax.fo || 0}px, 0)` }} />
        <p className="eyebrow" data-reveal="up"><Sparkles size={14} /> the end, for now</p>
        <h2 data-reveal="up" style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}>{copy.finale}<span className="accent-dot">!</span></h2>
        <p className="finale-note" data-reveal="up" style={{ '--reveal-delay': '0.2s' } as React.CSSProperties}>Thank you for continuing to exist.<br />Please keep it upp ^^</p>
        <a href="#top" className="replay" data-reveal="up" style={{ '--reveal-delay': '0.3s' } as React.CSSProperties}><ArrowRight size={15} /> {copy.replay}</a>
      </section>
    </main>
  );
}

export default App;
