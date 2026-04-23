"use client";

import { Plus_Jakarta_Sans, Space_Grotesk, JetBrains_Mono } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-jakarta' });
const grotesk = Space_Grotesk({ subsets: ['latin'], display: 'swap', variable: '--font-grotesk' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-jetbrains' });

export default function Home() {
  const handlePesquisador = () => {
    console.log("Fluxo do pesquisador");
  };

  const handleFuncionario = () => {
    console.log("Fluxo do funcionário");
  };

  return (
    <main className={`${jakarta.variable} ${grotesk.variable} ${jetbrains.variable}`}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        
        body { 
          font-family: var(--font-jakarta), sans-serif; 
          background: #F8FAFC; 
          color: #0F172A; 
          line-height: 1.6; 
          min-height: 100vh; 
        }

        .landing-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          padding: 14px 56px; display: flex; align-items: center;
          background: rgba(255,255,255,0.88); backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(15,23,42,0.07);
        }
        .logo-mark { display: flex; align-items: center; gap: 9px; }
        .logo-icon {
          width: 30px; height: 30px; font-size: 0.8rem;
          background: linear-gradient(135deg, #4F46E5, #3730A3);
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          font-family: var(--font-grotesk), sans-serif; font-weight: 700; color: #fff;
          box-shadow: 0 2px 8px rgba(79,70,229,0.4);
        }
        .logo-text {
          font-family: var(--font-grotesk), sans-serif; font-weight: 700;
          font-size: 0.95rem; color: #0F172A;
        }

        .landing-hero {
          min-height: 100vh; background: #0F172A;
          display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;
          padding: 120px 56px 80px;
        }
        .hero-gradient {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 70% at 80% 40%, rgba(99,102,241,0.18) 0%, transparent 65%),
            radial-gradient(ellipse 40% 50% at 10% 70%, rgba(16,185,129,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 30% 40% at 50% 10%, rgba(124,58,237,0.12) 0%, transparent 50%);
        }
        .hero-dots {
          position: absolute; inset: 0; opacity: 0.05;
          background-image: radial-gradient(circle, #fff 1px, transparent 1px);
          background-size: 32px 32px;
        }

        .hero-layout-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          width: 100%;
          max-width: 1300px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }
        .hero-text-content {
          flex: 1;
          max-width: 540px;
          text-align: left;
        }
        .hero-visual-content {
          flex: 1.1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .hero-pill {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3);
          border-radius: 20px; padding: 5px 14px; font-size: 0.78rem; color: #818CF8;
          font-weight: 600; margin-bottom: 22px; letter-spacing: 0.03em;
        }
        .hero-pill-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #818CF8;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }
        .hero-title {
          font-family: var(--font-grotesk), sans-serif;
          font-size: clamp(2.2rem, 4.5vw, 3.2rem);
          font-weight: 700; color: #fff; margin-bottom: 16px; line-height: 1.12;
        }
        .hero-welcome {
          color: rgba(255,255,255,0.85); font-size: 1rem;
          margin-bottom: 32px; max-width: 460px; line-height: 1.7; font-weight: 500;
        }
        .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; justify-content: flex-start; }

        .btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 13px 28px; border-radius: 10px; border: none; cursor: pointer;
          font-family: var(--font-jakarta), sans-serif; font-weight: 600; font-size: 1rem;
          transition: all 0.18s cubic-bezier(0.4,0,0.2,1); white-space: nowrap;
        }
        .btn-primary { background: linear-gradient(135deg, #4F46E5, #3730A3); color: #fff; box-shadow: 0 2px 8px rgba(79,70,229,0.35); }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(79,70,229,0.45); }
        .btn-secondary { background: rgba(255,255,255,0.1); color: #fff; border: 1.5px solid rgba(255,255,255,0.18); backdrop-filter: blur(6px); }
        .btn-secondary:hover { background: rgba(255,255,255,0.18); transform: translateY(-1px); }

        .illustration-card {
          --color-surface: #111723;
          --color-surface-2: #192131;
          --color-border: #263044;
          --color-text: #edf2f7;
          --color-text-muted: #98a6bb;
          --color-primary: #6ac7d3;
          
          width: 100%;
          max-width: 640px;
          border-radius: 34px;
          background: linear-gradient(180deg, color-mix(in oklab, var(--color-surface) 85%, transparent), color-mix(in oklab, var(--color-surface-2) 92%, transparent));
          border: 1px solid color-mix(in oklab, var(--color-border) 88%, transparent);
          box-shadow: 0 24px 60px rgba(0,0,0,0.38);
          padding: 22px;
          position: relative;
          
          animation: floatIllustration 6s ease-in-out infinite;
        }
        @keyframes floatIllustration {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-15px); }
        }

        .illustration-card::after {
          content: ''; position: absolute; inset: auto 24px -18px 24px; height: 40px;
          background: color-mix(in oklab, var(--color-primary) 10%, transparent);
          filter: blur(26px); border-radius: 999px; z-index: 0;
        }
        .illustration-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .window-dots { display: flex; gap: 8px; }
        .window-dots span { width: 10px; height: 10px; border-radius: 50%; background: color-mix(in oklab, var(--color-text-muted) 35%, transparent); }
        .window-label { font-size: 0.78rem; color: var(--color-text-muted); font-family: var(--font-jakarta), sans-serif; }
        
        .lab-scene {
          position: relative; z-index: 1; height: 460px; border-radius: 26px; overflow: hidden;
          background: linear-gradient(180deg, color-mix(in oklab, var(--color-primary) 6%, var(--color-surface)) 0%, var(--color-surface-2) 100%);
        }
        .lab-wall {
          position: absolute; inset: 0 0 108px 0;
          background: radial-gradient(circle at 82% 18%, color-mix(in oklab, var(--color-primary) 16%, transparent), transparent 24%),
                      linear-gradient(180deg, color-mix(in oklab, white 6%, transparent), transparent),
                      linear-gradient(180deg, color-mix(in oklab, var(--color-surface) 55%, white), var(--color-surface-2));
        }
        .shelf {
          position: absolute; left: 58px; right: 58px; top: 88px; height: 10px; border-radius: 999px;
          background: color-mix(in oklab, var(--color-text) 16%, transparent);
        }
        .bottle, .bottle::before { position: absolute; border-radius: 18px 18px 10px 10px; }
        .bottle {
          width: 44px; bottom: 10px;
          background: linear-gradient(180deg, color-mix(in oklab, white 65%, var(--color-primary)), color-mix(in oklab, var(--color-primary) 24%, var(--color-surface)));
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18);
        }
        .bottle::before {
          content: ''; width: 18px; height: 10px; left: 13px; top: -8px;
          background: color-mix(in oklab, var(--color-text) 18%, transparent); border-radius: 6px 6px 2px 2px;
        }
        .bottle.one { left: 98px; height: 74px; }
        .bottle.two { left: 162px; height: 92px; background: linear-gradient(180deg, #d6eef1, #91d8df); }
        .bottle.three { right: 190px; height: 84px; background: linear-gradient(180deg, #efe1ff, #bb9be7); }
        .bottle.four { right: 124px; height: 66px; background: linear-gradient(180deg, #ffe8c7, #ffbf66); }

        .bench { position: absolute; left: 0; right: 0; bottom: 94px; height: 18px; background: color-mix(in oklab, var(--color-text) 18%, transparent); }
        .bench-front {
          position: absolute; left: 36px; right: 36px; bottom: 0; height: 120px; border-radius: 20px 20px 0 0;
          background: linear-gradient(180deg, color-mix(in oklab, var(--color-primary) 8%, var(--color-surface-2)), color-mix(in oklab, black 8%, var(--color-surface-2)));
        }

        .monitor {
          position: absolute; right: 58px; bottom: 148px; width: 170px; height: 106px; border-radius: 18px; padding: 10px;
          background: #0f1724; border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 18px 30px rgba(0,0,0,0.18);
        }
        .monitor-screen { height: 100%; border-radius: 12px; background: linear-gradient(180deg, #122033, #0b1422); padding: 14px 12px; display: flex; align-items: end; gap: 10px; }
        .bar { flex: 1; border-radius: 8px 8px 4px 4px; background: linear-gradient(180deg, #8be3ee, #4eaebc); }
        .bar:nth-child(1) { height: 34%; } .bar:nth-child(2) { height: 62%; } .bar:nth-child(3) { height: 46%; } .bar:nth-child(4) { height: 74%; }

        .microscope { position: absolute; left: 72px; bottom: 136px; width: 132px; height: 170px; }
        .micro-arm {
          position: absolute; left: 42px; top: 18px; width: 40px; height: 82px;
          border: 14px solid color-mix(in oklab, var(--color-primary) 28%, var(--color-surface));
          border-left: 0; border-bottom: 0; border-radius: 0 62px 0 0; transform: rotate(-18deg);
        }
        .micro-head {
          position: absolute; left: 76px; top: 18px; width: 26px; height: 64px; border-radius: 12px;
          background: color-mix(in oklab, var(--color-text) 20%, var(--color-surface)); transform: rotate(26deg);
        }
        .micro-base { position: absolute; left: 18px; bottom: 0; width: 90px; height: 18px; border-radius: 20px; background: color-mix(in oklab, var(--color-text) 18%, transparent); }
        .micro-stand { position: absolute; left: 48px; bottom: 16px; width: 16px; height: 62px; border-radius: 12px; background: color-mix(in oklab, var(--color-text) 15%, transparent); }

        .scientist { position: absolute; left: 236px; bottom: 116px; width: 180px; height: 250px; }
        .head { position: absolute; left: 62px; top: 14px; width: 54px; height: 54px; border-radius: 50%; background: #e7bd9b; z-index: 2; }
        .hair { position: absolute; left: 56px; top: 8px; width: 64px; height: 34px; border-radius: 40px 40px 18px 18px; background: #233347; z-index: 3; }
        .body-coat { position: absolute; left: 24px; top: 58px; width: 128px; height: 148px; border-radius: 42px 42px 18px 18px; background: linear-gradient(180deg, #ffffff, #dfe8f1); z-index: 1; }
        .inner-shirt { position: absolute; left: 68px; top: 86px; width: 42px; height: 86px; border-radius: 12px; background: color-mix(in oklab, var(--color-primary) 30%, white); z-index: 2; }
        .arm-left, .arm-right { position: absolute; top: 94px; width: 26px; height: 96px; border-radius: 18px; background: #ffffff; z-index: 0; }
        .arm-left { left: 18px; transform: rotate(22deg); } .arm-right { right: 20px; transform: rotate(-18deg); }
        .tablet { position: absolute; left: -4px; top: 130px; width: 80px; height: 58px; border-radius: 14px; background: #172234; border: 5px solid #243146; transform: rotate(-10deg); z-index: 2; }
        .tablet::after { content: ''; position: absolute; inset: 10px; border-radius: 8px; background: linear-gradient(180deg, #1e344f, #0f1f31); }
        
        .flask { position: absolute; right: -2px; top: 124px; width: 46px; height: 76px; z-index: 2; }
        .flask-neck { position: absolute; left: 15px; top: 0; width: 16px; height: 18px; border-radius: 6px; background: color-mix(in oklab, #ffffff 72%, transparent); }
        .flask-body { position: absolute; left: 0; bottom: 0; width: 46px; height: 58px; clip-path: polygon(28% 0, 72% 0, 100% 100%, 0 100%); background: linear-gradient(180deg, #b4f0d7, #62c89b); border-radius: 0 0 16px 16px; }

        .float-chip { position: absolute; display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 999px; font-size: 0.78rem; font-weight: 600; background: color-mix(in oklab, var(--color-surface) 90%, transparent); border: 1px solid color-mix(in oklab, var(--color-border) 82%, transparent); box-shadow: 0 10px 30px rgba(0,0,0,0.28); color: var(--color-text); font-family: var(--font-jakarta), sans-serif;}
        .float-chip.one { top: 28px; right: 24px; }
        .float-chip.two { bottom: 28px; left: 24px; }
        .chip-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--color-primary); }

        .features-sec { padding: 80px 56px; background: #fff; }
        .sec-header { text-align: center; margin-bottom: 52px; }
        .sec-eyebrow { display: inline-block; background: #EEF2FF; color: #4F46E5; padding: 4px 14px; border-radius: 20px; font-size: 0.78rem; font-weight: 700; margin-bottom: 12px; letter-spacing: 0.04em; text-transform: uppercase; }
        .sec-title { font-family: var(--font-grotesk), sans-serif; font-size: 2rem; font-weight: 700; color: #0F172A; }
        .sec-desc { color: #64748B; margin-top: 10px; max-width: 480px; margin-left: auto; margin-right: auto; font-size: 0.95rem; }

        .feat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 20px; }
        .feat-card { padding: 26px; border-radius: 16px; border: 1px solid #E2E8F0; transition: all 0.22s cubic-bezier(0.4,0,0.2,1); }
        .feat-card:hover { border-color: #a5b4fc; box-shadow: 0 4px 16px rgba(15,23,42,0.10); transform: translateY(-4px); }
        .feat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; font-size: 1.2rem; }
        .feat-title { font-family: var(--font-grotesk), sans-serif; font-weight: 700; font-size: 0.95rem; margin-bottom: 7px; color: #0F172A; }
        .feat-desc { font-size: 0.85rem; color: #64748B; line-height: 1.65; }

        .land-footer { background: #0F172A; padding: 32px 56px; text-align: center; color: rgba(255,255,255,0.3); font-size: 0.83rem; }

        @media (max-width: 1080px) {
          .hero-layout-container { flex-direction: column; text-align: center; }
          .hero-text-content { max-width: 100%; text-align: center; margin-bottom: 40px; }
          .hero-title, .hero-welcome { text-align: center; margin-left: auto; margin-right: auto; }
          .hero-btns { justify-content: center; }
        }
        @media (max-width: 768px) {
          .landing-nav { padding: 14px 24px; }
          .landing-hero { padding: 100px 24px 72px; }
          .features-sec { padding: 60px 24px; }
          .land-footer { padding: 32px 24px; }
        }
      `}</style>

      <nav className="landing-nav">
        <div className="logo-mark">
          <div className="logo-icon">LI</div>
          <span className="logo-text">LIACLI</span>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-gradient" />
        <div className="hero-dots" />
        
        <div className="hero-layout-container">
          
          <div className="hero-text-content">

            <h1 className="hero-title">
              Gestão de análises<br />
            </h1>
            <p className="hero-welcome">
              Bem-vindo ao Sistema de Gestão do Laboratório. Por favor, identifique
              o seu perfil de acesso abaixo para continuar.
            </p>
            <div className="hero-btns">
              <button className="btn btn-primary" onClick={handlePesquisador}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Sou Pesquisador
              </button>
              <button className="btn btn-secondary" onClick={handleFuncionario}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
                Sou Funcionário do Lab
              </button>
            </div>
          </div>

          <div className="hero-visual-content">
            <div className="illustration-card">
              <div className="illustration-top">
                <div className="window-dots"><span/><span/><span/></div>
               <div className="hero-pill">
              <div className="hero-pill-dot" />
              Sistema Laboratorial
            </div>
              </div>

              <div className="lab-scene">
                <div className="lab-wall"></div>
                <div className="shelf">
                  <div className="bottle one"></div>
                  <div className="bottle two"></div>
                  <div className="bottle three"></div>
                  <div className="bottle four"></div>
                </div>

                <div className="float-chip two"><span className="chip-dot"></span>Resultados em análise</div>

                <div className="microscope">
                  <div className="micro-arm"></div>
                  <div className="micro-head"></div>
                  <div className="micro-stand"></div>
                  <div className="micro-base"></div>
                </div>

                <div className="scientist">
                  <div className="hair"></div>
                  <div className="head"></div>
                  <div className="body-coat"></div>
                  <div className="inner-shirt"></div>
                  <div className="arm-left"></div>
                  <div className="arm-right"></div>
                  <div className="tablet"></div>
                  <div className="flask">
                    <div className="flask-neck"></div>
                    <div className="flask-body"></div>
                  </div>
                </div>

                <div className="monitor">
                  <div className="monitor-screen">
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                  </div>
                </div>

                <div className="bench"></div>
                <div className="bench-front"></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <footer className="land-footer">
        <p>© 2025 LIACLI — Sistema de Gestão de Análises Laboratoriais. Todos os direitos reservados.</p>
        <p style={{ marginTop: "4px", opacity: 0.6, fontSize: "0.76rem" }}>
        </p>
      </footer>
    </main>
  );
}