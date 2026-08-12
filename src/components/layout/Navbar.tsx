import { useEffect, useRef, useState } from 'react';
import '../../styles/tailwind.css';
import AuthenticationManager from '../auth/AuthenticationManager';
import { useAuth } from '../../context/AuthContext';
import Menu, { SitePage } from './Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronDown, faRightToBracket, faSliders, faTrophy } from '@fortawesome/free-solid-svg-icons';

interface NavbarProps {
  activePage: SitePage;
  pageTitle?: string;
  onNavigate: (page: SitePage) => void;
  registrationRequest?: number;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, pageTitle = 'Yahtzee!', onNavigate, registrationRequest = 0 }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'play' | 'player' | 'account' | null>(null);
  const [currentForm, setCurrentForm] = useState('');
  const [initialAuthForm, setInitialAuthForm] = useState<'login' | 'signup'>('login');
  const navRef = useRef<HTMLElement>(null);
  const { isUserSignedIn, signOut, userDetails } = useAuth();
  const titles: Record<SitePage, string> = { play: pageTitle, scores: 'High Scores', progress: 'Progress', account: 'Account', about: 'About', admin: 'Admin' };
  const go = (page: SitePage) => { setOpenDropdown(null); setIsMenuOpen(false); onNavigate(page); };
  const openAuth = (form: 'login' | 'signup' = 'login') => { setInitialAuthForm(form); setShowAuthModal(true); setOpenDropdown(null); };

  useEffect(() => { if (registrationRequest) openAuth('signup'); }, [registrationRequest]);
  useEffect(() => { const close = (event: MouseEvent) => { if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenDropdown(null); }; document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close); }, []);
  useEffect(() => { document.body.style.overflow = isMenuOpen || showAuthModal ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [isMenuOpen, showAuthModal]);
  const handleCloseModal = (event: React.MouseEvent<HTMLDivElement>) => { if (event.target === event.currentTarget && currentForm !== 'verifyEmail') setShowAuthModal(false); };

  return <>
    <nav ref={navRef} className="sticky top-0 z-30 border-b-2 border-neonCyan bg-deepBlack/95 px-4 py-3 text-white shadow-lg backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
      <button onClick={() => go('play')} className="flex min-w-0 items-center gap-3 text-left"><div className="h-14 w-14 lg:h-16 lg:w-16"><img src={`${process.env.PUBLIC_URL}/yahtzee_dice_logo.png`} alt="Yahtzee Dice Logo" className="h-full w-full object-contain" /></div><h1 className="max-w-[11rem] truncate text-xl font-black text-neonYellow animate-pulse-glow sm:max-w-xs sm:text-2xl lg:text-3xl">{titles[activePage]}</h1></button>
      <div className="ml-auto hidden items-center gap-1 md:flex" aria-label="Primary navigation">
        <div className="desktop-nav-dropdown"><button onClick={() => setOpenDropdown(openDropdown === 'play' ? null : 'play')} className={`desktop-nav-button ${activePage === 'play' ? 'desktop-nav-active' : ''}`}>Play <FontAwesomeIcon icon={faChevronDown} /></button>{openDropdown === 'play' && <div className="desktop-dropdown-panel"><button onClick={() => go('play')}>Choose a game<small>Solo, Daily, Computer or Pass & Play</small></button><button onClick={() => go('play')}>Dice tools<small>Virtual dice and physical scorecard</small></button></div>}</div>
        <div className="desktop-nav-dropdown"><button onClick={() => setOpenDropdown(openDropdown === 'player' ? null : 'player')} className={`desktop-nav-button ${activePage === 'scores' || activePage === 'progress' ? 'desktop-nav-active' : ''}`}><FontAwesomeIcon icon={faTrophy} /> Player <FontAwesomeIcon icon={faChevronDown} /></button>{openDropdown === 'player' && <div className="desktop-dropdown-panel"><button onClick={() => go('scores')}>High Scores<small>Solo and Daily leaderboards</small></button><button onClick={() => go('progress')}>Progress<small>Stats, streaks and achievements</small></button></div>}</div>
        <button onClick={() => go('about')} className={`desktop-nav-button ${activePage === 'about' ? 'desktop-nav-active' : ''}`}>About</button>
        {isUserSignedIn ? <div className="desktop-nav-dropdown"><button onClick={() => setOpenDropdown(openDropdown === 'account' ? null : 'account')} className={`desktop-nav-button desktop-nav-account ${activePage === 'account' || activePage === 'admin' ? 'desktop-nav-active' : ''}`}><FontAwesomeIcon icon={faSliders} /> Account <FontAwesomeIcon icon={faChevronDown} /></button>{openDropdown === 'account' && <div className="desktop-dropdown-panel desktop-dropdown-right"><button onClick={() => go('account')}>Account settings<small>Profile, preferences and security</small></button>{userDetails?.role === 'ADMIN' && <button onClick={() => go('admin')}>Admin dashboard<small>Users, games and engagement</small></button>}<button onClick={() => void signOut()} className="desktop-dropdown-danger">Sign out</button></div>}</div> : <button onClick={() => openAuth('login')} className="desktop-nav-button desktop-nav-account"><FontAwesomeIcon icon={faRightToBracket} /> Sign in</button>}
      </div>
      <button onClick={() => setIsMenuOpen(true)} className="flex h-10 items-center gap-2 rounded-full bg-neonCyan px-3 font-black text-deepBlack transition hover:bg-electricPink hover:text-white md:hidden" aria-label="Open navigation"><FontAwesomeIcon icon={faBars} /><span>Menu</span></button>
    </div></nav>
    {showAuthModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={handleCloseModal}><div className="relative w-full max-w-[410px] rounded-lg" onClick={(event) => event.stopPropagation()}><AuthenticationManager initialForm={initialAuthForm} onClose={() => setShowAuthModal(false)} onFormChange={setCurrentForm} /><button onClick={() => setShowAuthModal(false)} className="absolute right-3 top-2 text-3xl text-neonCyan">&times;</button></div></div>}
    <Menu isOpen={isMenuOpen} activePage={activePage} onClose={() => setIsMenuOpen(false)} onNavigate={go} onSignIn={() => openAuth('login')} onSignOut={() => void signOut()} />
  </>;
};

export default Navbar;
