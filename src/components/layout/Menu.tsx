import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faCircleInfo, faFileContract, faHeadset, faHouse, faRightFromBracket, faRightToBracket, faShieldHalved, faSliders, faTrashCan, faTrophy } from '@fortawesome/free-solid-svg-icons';

export type SitePage = 'play' | 'scores' | 'progress' | 'account' | 'about' | 'admin';

interface MenuProps {
  isOpen: boolean;
  activePage: SitePage;
  onClose: () => void;
  onNavigate: (page: SitePage) => void;
  onSignIn: () => void;
  onSignOut: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, activePage, onClose, onNavigate, onSignIn, onSignOut }) => {
  const { isUserSignedIn, userDetails } = useAuth();
  const go = (page: SitePage) => { onNavigate(page); onClose(); };
  const items = [
    ['play', 'Games', 'Choose how to play', faHouse],
    ['scores', 'Scores', 'Global and your scores', faTrophy],
    ['progress', 'Progress', 'Streaks and achievements', faChartLine],
    ['about', 'About', 'Modes, rules and scoring', faCircleInfo],
  ] as const;

  return <><button aria-label="Close menu" onClick={onClose} className={`fixed inset-0 z-40 bg-black/75 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />
    <aside id="menu" className={`${isOpen ? 'translate-x-0' : 'translate-x-full'} fixed right-0 top-0 z-50 h-full w-[88vw] max-w-sm overflow-y-auto border-l border-neonCyan bg-deepBlack text-mintGlow shadow-2xl transform transition-transform duration-300`}>
      <div className="flex min-h-full flex-col justify-between p-6"><div>
        <div className="mb-6 flex items-center justify-between animate-pulse-glow"><h2 className="text-3xl font-bold text-neonYellow">Menu</h2><button onClick={onClose} className="text-3xl text-neonCyan hover:text-electricPink" aria-label="Close menu">&times;</button></div>
        {isUserSignedIn && userDetails && <div className="mb-4 text-sm text-electricPink">{userDetails.preferred_username} signed in</div>}
        <div className="flex flex-col gap-2">{items.map(([page, label, copy, icon]) => <button key={page} onClick={() => go(page)} className={`mobile-menu-item ${activePage === page ? 'mobile-menu-primary' : ''}`}><span className="mobile-menu-icon"><FontAwesomeIcon icon={icon} /></span><span><strong>{label}</strong><small>{copy}</small></span></button>)}
          {isUserSignedIn && <button onClick={() => go('account')} className={`mobile-menu-item ${activePage === 'account' ? 'mobile-menu-primary' : ''}`}><span className="mobile-menu-icon"><FontAwesomeIcon icon={faSliders} /></span><span><strong>Account</strong><small>Profile and security</small></span></button>}
          {userDetails?.role === 'ADMIN' && <button onClick={() => go('admin')} className={`mobile-menu-item ${activePage === 'admin' ? 'mobile-menu-primary' : ''}`}><span className="mobile-menu-icon text-electricPink"><FontAwesomeIcon icon={faChartLine} /></span><span><strong>Admin</strong><small>Engagement dashboard</small></span></button>}
          <div className="mt-4 border-t border-gray-700 pt-4"><p className="mb-2 text-xs font-black uppercase tracking-widest text-gray-500">Support & legal</p><div className="grid grid-cols-2 gap-2"><a href="/support.html" className="mobile-menu-link"><FontAwesomeIcon icon={faHeadset} />Support</a><a href="/privacy.html" className="mobile-menu-link"><FontAwesomeIcon icon={faShieldHalved} />Privacy</a><a href="/terms.html" className="mobile-menu-link"><FontAwesomeIcon icon={faFileContract} />Terms</a><a href="/account-deletion.html" className="mobile-menu-link text-red-400"><FontAwesomeIcon icon={faTrashCan} />Deletion</a></div></div>
        </div></div>
        <div className="mt-6">{!isUserSignedIn ? <button onClick={() => { onClose(); onSignIn(); }} className="mobile-auth-button"><FontAwesomeIcon icon={faRightToBracket} /> Sign in</button> : <button onClick={() => { onClose(); onSignOut(); }} className="mobile-auth-button mobile-auth-signout"><FontAwesomeIcon icon={faRightFromBracket} /> Sign out</button>}</div>
      </div>
    </aside></>;
};

export default Menu;
