// Nav.jsx — BLANKSLATE Navbar
const Nav = ({ active }) => {
  const links = [
    {
      label: 'About',
      children: [
        { label: 'About Us', href: 'about.html' },
        { label: 'Artists',  href: 'artists.html' },
        { label: 'Globe',    href: 'Globe.html' },
      ],
    },
    { label: 'Stream',  href: 'shop.html' },
    { label: 'Contact', href: 'contact.html' },
  ];

  const [visible, setVisible] = React.useState(true);
  const lastY = React.useRef(0);

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < lastY.current || y < 10);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [openSub, setOpenSub] = React.useState(null); // mobile: which submenu is expanded

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      background: '#fff', zIndex: 100,
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      boxSizing: 'border-box',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'transform 0.35s ease',
    }}>
      <div style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <a href="index.html" style={{ fontSize: '1.3rem', fontWeight: 400, letterSpacing: 1, color: '#000', textDecoration: 'none' }}>
          BLANKSLATE
        </a>
        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 30 }} className="nav-desktop">
          {links.map((item) => <NavItem key={item.label} item={item} active={active} />)}
        </div>
        {/* Hamburger */}
        <button onClick={() => setMenuOpen(o => !o)} className="nav-hamburger" style={{
          display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8, fontSize: '1.4rem'
        }}>☰</button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="nav-mobile-menu" style={{ borderTop: '1px solid #eee', padding: '12px 24px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {links.map((item) => (
            item.children ? (
              <div key={item.label}>
                <button
                  onClick={() => setOpenSub(o => o === item.label ? null : item.label)}
                  style={{
                    background: 'none', border: 'none', padding: 0, color: '#000',
                    fontFamily: 'inherit', fontSize: '1.1rem', fontWeight: 400,
                    display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                    paddingBottom: 2,
                  }}
                >
                  {item.label}
                  <span style={{ fontSize: '0.7rem', transform: openSub === item.label ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }}>▾</span>
                </button>
                {openSub === item.label && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 14, marginTop: 10, borderLeft: '1px solid #ddd' }}>
                    {item.children.map((c) => (
                      <a key={c.label} href={c.href} style={{ color: '#000', textDecoration: 'none', fontSize: '1rem', fontWeight: 400, borderBottom: active === c.label ? '1px solid #000' : 'none', paddingBottom: 2, alignSelf: 'flex-start' }}>{c.label}</a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a key={item.label} href={item.href} style={{ color: '#000', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 400, borderBottom: active === item.label ? '1px solid #000' : 'none', paddingBottom: 2, alignSelf: 'flex-start' }}>{item.label}</a>
            )
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

// Single desktop nav entry — handles both plain links and dropdown parents.
const NavItem = ({ item, active }) => {
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef(null);

  const isActive = active === item.label
    || (item.children && item.children.some(c => c.label === active));

  if (!item.children) {
    return (
      <a href={item.href} style={{
        color: '#000', textDecoration: 'none', fontSize: '1rem', fontWeight: 400,
        borderBottom: isActive ? '1px solid #000' : '1px solid transparent',
        paddingBottom: 2, transition: 'border-color 0.2s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.borderBottomColor = '#000'}
      onMouseLeave={e => e.currentTarget.style.borderBottomColor = isActive ? '#000' : 'transparent'}
      >{item.label}</a>
    );
  }

  const openMenu = () => { clearTimeout(closeTimer.current); setOpen(true); };
  const scheduleClose = () => { closeTimer.current = setTimeout(() => setOpen(false), 140); };

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'none', border: 'none', padding: '0 0 2px', cursor: 'pointer',
          color: '#000', fontFamily: 'inherit', fontSize: '1rem', fontWeight: 400,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          borderBottom: isActive ? '1px solid #000' : '1px solid transparent',
          transition: 'border-color 0.2s ease',
        }}
      >
        {item.label}
        <span style={{ fontSize: '0.65rem', transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }}>▾</span>
      </button>
      <div
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}
        style={{
          position: 'absolute', top: 'calc(100% + 14px)', left: '50%', transform: 'translateX(-50%)',
          minWidth: 160, background: '#fff',
          border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 10px 24px rgba(0,0,0,0.10)',
          padding: '10px 0', display: 'flex', flexDirection: 'column',
          opacity: open ? 1 : 0, visibility: open ? 'visible' : 'hidden',
          transform: open ? 'translate(-50%, 0)' : 'translate(-50%, -6px)',
          transition: 'opacity 0.18s ease, transform 0.18s ease, visibility 0.18s ease',
        }}
      >
        {item.children.map(c => (
          <a key={c.label} href={c.href}
            style={{
              padding: '10px 20px', color: '#000', textDecoration: 'none',
              fontSize: '0.95rem', fontWeight: 400, whiteSpace: 'nowrap',
              background: active === c.label ? '#f4f4f4' : 'transparent',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f4f4f4'}
            onMouseLeave={e => e.currentTarget.style.background = active === c.label ? '#f4f4f4' : 'transparent'}
          >{c.label}</a>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { Nav });
