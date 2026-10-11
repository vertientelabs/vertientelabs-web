import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import Manifesto from "@/components/Manifesto";
import HeroFloat from "@/components/HeroFloat";
import { HeroShader, ContourShader, AuraShader } from "@/components/Shaders";
import { Logo, VMark } from "@/components/Logo";
import VConstruct from "@/components/VConstruct";

const SERVICES = [
  {
    title: "Software a la medida",
    text: "Sistemas construidos alrededor de tu operación, no al revés. Del primer diagrama al último despliegue.",
    icon: <path d="M8 7 3 12l5 5M16 7l5 5-5 5M13.5 4.5l-3 15" />,
  },
  {
    title: "Plataformas web",
    text: "Productos SaaS, portales y paneles que se entienden, se mantienen y crecen con tu negocio.",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="M3 9h18M7 6.5h.01M10 6.5h.01" />
      </>
    ),
  },
  {
    title: "Apps móviles",
    text: "iOS y Android con experiencia nativa y una base de código que tu equipo puede sostener.",
    icon: (
      <>
        <rect x="6.5" y="2.5" width="11" height="19" rx="3" />
        <path d="M10.5 18.5h3" />
      </>
    ),
  },
  {
    title: "Producto con IA",
    text: "Agentes, automatizaciones y modelos integrados exactamente donde aportan valor real.",
    icon: <path d="M12 3v3M12 18v3M3 12h3M18 12h3M12 8l1.4 2.6L16 12l-2.6 1.4L12 16l-1.4-2.6L8 12l2.6-1.4z" />,
  },
  {
    title: "Cloud & DevOps",
    text: "Infraestructura como código, despliegue continuo y observabilidad desde el primer día.",
    icon: <path d="M7 18a4 4 0 0 1-.6-7.95A5.5 5.5 0 0 1 17 8.5a4.75 4.75 0 0 1 0 9.5zM12 11v5M9.5 13.5 12 11l2.5 2.5" />,
  },
  {
    title: "Consultoría técnica",
    text: "Arquitectura, auditoría de código y acompañamiento a equipos que necesitan un segundo par de ojos.",
    icon: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4.5 4.5M8.5 11h5M11 8.5v5" />
      </>
    ),
  },
];

const VALUES = [
  {
    n: "A",
    k: "Promesa",
    v: "Tecnología que funciona, se entiende y crece con tu organización.",
    icon: <path d="M12 21s-7-4.35-7-10.5V5.5L12 3l7 2.5v5C19 16.65 12 21 12 21zM8.75 11.75l2.25 2.25 4.25-4.5" />,
  },
  {
    n: "B",
    k: "Principio",
    v: "Claridad antes que complejidad.",
    icon: <path d="M4 7h16M4 12h10M4 17h5M17 15l3 3-3 3" />,
  },
  {
    n: "C",
    k: "Método",
    v: "Entregas medibles, procesos documentados y comunicación constante.",
    icon: <path d="M12 3v3M8.5 21 12 6l3.5 15M6.5 15h11" />,
  },
];

const STEPS = [
  { n: "01", title: "Origen", text: "Entendemos el problema desde su raíz antes de escribir una sola línea de código." },
  { n: "02", title: "Flujo", text: "Procesos, código e interfaces que se mueven sin fricción, de punta a punta." },
  { n: "03", title: "Precisión", text: "Ingeniería rigurosa, medible y honesta. Hacemos lo que decimos." },
  { n: "04", title: "Cauce", text: "Acompañamos el crecimiento con soluciones que escalan junto al negocio." },
];

const CASES = [
  { tag: "Caso 04 · Fintech", line: "De 3 sistemas", em: "a uno solo.", meta: ["Plataforma web", "Integraciones", "Cloud"], tone: "sun" },
  { tag: "Caso 03 · Logística", line: "Rutas que se", em: "corrigen solas.", meta: ["App móvil", "Tiempo real"], tone: "spring" },
  { tag: "Caso 02 · Salud", line: "Agenda clínica", em: "sin fricción.", meta: ["Producto con IA", "Web"], tone: "amber" },
];

const VOICE = [
  { k: "Claros", v: "Te explicamos qué hace cada parte y por qué." },
  { k: "Técnicos", v: "Usamos la arquitectura correcta, no la de moda." },
  { k: "Cercanos", v: "Estamos en el proyecto contigo, de principio a fin." },
  { k: "Seguros", v: "Esto lo hemos resuelto antes. Así lo haríamos." },
];

export default function Home() {
  return (
    <>
      <Nav />
      <Reveal />

      <main>
        {/* ============ HERO ============ */}
        <section className="hero dark" id="inicio">
          <HeroShader />
          <HeroFloat />
          <div className="wrap hero__inner">
            <div className="hero__copy">
              <span className="chip glass intro intro--1">
                <b>Nuevo</b> Desarrollo de productos con IA
              </span>
              <h1 className="hero__title">
                <span className="intro intro--2">Software que</span>
                <em className="intro intro--3">fluye.</em>
              </h1>
              <p className="hero__lead intro intro--4">
                Diseñamos y construimos plataformas, apps y sistemas a la medida para equipos que quieren moverse
                eficientemente.
              </p>
              <div className="hero__ctas intro intro--5">
                <a href="#contacto" className="btn btn--chalk">
                  Iniciar un proyecto <span aria-hidden="true">→</span>
                </a>
                <a href="#casos" className="btn btn--glass glass">
                  Ver casos
                </a>
              </div>
            </div>
          </div>
          <div className="wrap hero__foot intro intro--6">
            <span className="mono-s">Ingeniería que encuentra su cauce</span>
            <span className="mono-s scroll-hint">
              Desliza <i />
            </span>
            <a href="#contacto" className="mono-s availability">
              <i /> Agenda abierta para nuevos proyectos
            </a>
          </div>
        </section>


        {/* ============ MANIFIESTO ============ */}
        <section className="manifesto light" id="estudio">
          <div className="manifesto__aura">
            <AuraShader tone="paper" />
          </div>
          <div className="wrap z">
            <div className="manifesto__top reveal">
              <span className="tag">
                <b>01</b> Esencia
              </span>
              <span className="mono-s muted">Por qué existimos</span>
            </div>
            <div className="manifesto__grid">
              <div className="manifesto__copy">
                <Manifesto />
                <p className="manifesto__lead reveal">
                  Vertiente Labs diseña y desarrolla software a la medida, plataformas y soluciones tecnológicas para
                  organizaciones que necesitan que sus ideas funcionen en el mundo real.
                </p>
              </div>
              <figure className="vfig glass-light reveal">
                <VConstruct />
                <figcaption>
                  <span className="mono-s">La V · dos trazos, un vértice</span>
                  <span className="mono-s muted">Origen → cauce</span>
                </figcaption>
              </figure>
            </div>
            <div className="values">
              {VALUES.map((v, i) => (
                <article className="value glass-light reveal" key={v.k} style={{ "--i": i } as React.CSSProperties}>
                  <div className="value__top">
                    <span className="tag">
                      <b>{v.n}</b> {v.k}
                    </span>
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {v.icon}
                    </svg>
                  </div>
                  <p>{v.v}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ SERVICIOS ============ */}
        <section className="services light" id="servicios">
          <div className="wrap">
            <div className="head reveal">
              <div>
                <span className="tag">
                  <b>02</b> Servicios
                </span>
                <h2 className="signature">
                  <span>Lo que imaginas,</span>
                  <em>bien construido.</em>
                </h2>
              </div>
              <p>
                Un equipo pequeño de ingeniería y diseño que acompaña cada proyecto del origen al producto. Elegimos la
                tecnología por lo que resuelve, no por lo que está de moda.
              </p>
            </div>
            <div className="cells c3 services__grid">
              {SERVICES.map((s, i) => (
                <article className="service reveal" key={s.title} style={{ "--i": i } as React.CSSProperties}>
                  <div className="service__top">
                    <span className="mono-s muted">0{i + 1}</span>
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {s.icon}
                    </svg>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <span className="service__more">
                    Saber más <span aria-hidden="true">→</span>
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ PROCESO ============ */}
        <section className="process dark" id="proceso">
          <ContourShader />
          <div className="wrap z">
            <div className="head head--dark reveal">
              <div>
                <span className="tag">
                  <b>03</b> Proceso
                </span>
                <h2>
                  Del origen <br />
                  al <em>cauce.</em>
                </h2>
              </div>
              <p>
                Cuatro movimientos, un mismo caudal. Así llevamos una idea desde la primera conversación hasta un producto
                en producción que sigue creciendo. Mueve el cursor sobre el mapa.
              </p>
            </div>
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li className="step glass reveal" key={s.n} style={{ "--i": i } as React.CSSProperties}>
                  <span className="step__n">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <span className="step__bar" />
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ============ CASOS ============ */}
        <section className="cases light" id="casos">
          <div className="wrap">
            <div className="head reveal">
              <div>
                <span className="tag">
                  <b>04</b> Casos
                </span>
                <h2 className="signature">
                  <span>Problemas reales,</span>
                  <em>soluciones eficientes.</em>
                </h2>
              </div>
              <p>Algunos proyectos donde la tecnología dejó de ser fricción y empezó a mover el negocio.</p>
            </div>
            <div className="cases__grid">
              {CASES.map((c, i) => (
                <a href="#contacto" className={`case case--${c.tone} reveal`} key={c.tag} style={{ "--i": i } as React.CSSProperties}>
                  <div className="case__cover">
                    <svg className="case__contours" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                      {Array.from({ length: 9 }, (_, k) => (
                        <path key={k} d={`M${40 - k * 22} ${-40 + k * 34} L200 ${180 + k * 34} L${360 + k * 22} ${-40 + k * 34}`} />
                      ))}
                    </svg>
                    <span className="mono-s">{c.tag}</span>
                    <p className="case__line">
                      {c.line} <em>{c.em}</em>
                    </p>
                    <VMark className="case__v" />
                  </div>
                  <div className="case__meta">
                    {c.meta.map((m) => (
                      <span className="pilltag" key={m}>
                        {m}
                      </span>
                    ))}
                    <span className="case__arrow" aria-hidden="true">
                      →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ============ VOZ ============ */}
        <section className="voice light">
          <div className="voice__aura">
            <AuraShader tone="light" />
          </div>
          <div className="wrap z">
            <p className="voice__statement reveal">
              Pensar como ingenieros. <br />
              <em>Diseñar como artistas.</em>
            </p>
            <div className="cells c4 voice__grid reveal">
              {VOICE.map((v) => (
                <div className="pad" key={v.k}>
                  <span className="mono-s amber-text">{v.k}</span>
                  <p>“{v.v}”</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="cta dark" id="contacto">
          <AuraShader tone="dark" />
          <div className="wrap z cta__inner">
            <span className="tag reveal">
              <b>05</b> Contacto
            </span>
            <h2 className="cta__title reveal">
              Menos fricción. <br />
              <em>Más flujo.</em>
            </h2>
            <p className="cta__lead reveal">Cuéntanos qué quieres construir. Respondemos en menos de 48 horas con próximos pasos claros.</p>
            <form className="cta__form glass reveal" action="#contacto">
              <label className="sr-only" htmlFor="email">
                Correo
              </label>
              <input id="email" type="email" placeholder="tu@empresa.com" autoComplete="email" />
              <button type="submit" className="btn btn--chalk">
                Hablemos <span aria-hidden="true">→</span>
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="footer dark">
        <div className="wrap">
          <div className="cells c4 footer__grid">
            <div className="pad">
              <Logo size={26} />
              <p className="muted footer__tag">Software que fluye.</p>
            </div>
            <div className="pad">
              <span className="mono-s muted">Estudio</span>
              <a href="#estudio">Esencia</a>
              <a href="#proceso">Proceso</a>
              <a href="#casos">Casos</a>
            </div>
            <div className="pad">
              <span className="mono-s muted">Servicios</span>
              <a href="#servicios">Software a la medida</a>
              <a href="#servicios">Producto con IA</a>
              <a href="#servicios">Cloud & DevOps</a>
            </div>
            <div className="pad">
              <span className="mono-s muted">Contacto</span>
              <a href="mailto:hola@vertientelabs.com">hola@vertientelabs.com</a>
              <a href="#">LinkedIn</a>
              <a href="#">WhatsApp</a>
            </div>
          </div>
          <div className="footer__mark" aria-hidden="true">
            vertiente<i>labs</i>
          </div>
          <div className="footer__legal">
            <span className="mono-s muted">© 2026 Vertiente Labs</span>
            <span className="mono-s muted">Ingeniería que encuentra su cauce</span>
          </div>
        </div>
      </footer>
    </>
  );
}
