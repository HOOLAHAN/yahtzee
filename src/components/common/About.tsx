import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faComputer, faDice, faPeopleGroup, faShieldHalved, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { QRCodeSVG } from 'qrcode.react';

const appStoreUrl = 'https://apps.apple.com/gb/app/yahtzee-hub/id6794910138';

interface AboutProps { onClose: () => void }

const modes = [
  { name: 'Solo', icon: faDice, copy: 'Play all 13 rounds, submit your final score and climb the shared leaderboard.' },
  { name: 'Vs Computer', icon: faComputer, copy: 'Battle an automated opponent that rolls and makes logical category choices.' },
  { name: 'Pass & Play', icon: faPeopleGroup, copy: 'Take turns on one screen with independent scores and scorecards.' },
  { name: 'Real Dice', icon: faCalculator, copy: 'Keep score for up to six named players while using physical dice.' },
];

const About: React.FC<AboutProps> = ({ onClose }) => <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-xl overflow-y-auto border-l border-neonCyan bg-deepBlack p-6 text-mintGlow shadow-2xl">
  <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Web and iPhone</p><h2 className="section-heading">About Yahtzee</h2></div><button onClick={onClose} aria-label="Close about" className="text-4xl text-neonCyan hover:text-electricPink">&times;</button></div>
  <p className="section-copy">One shared account and leaderboard, with four ways to play at home or on the move.</p>
  <section className="app-download-card"><div><p className="eyebrow">Play on iPhone or iPad</p><h3>Take Yahtzee Hub with you</h3><p>Scan the code with your phone or open the App Store directly. Android is not currently available.</p><a href={appStoreUrl} target="_blank" rel="noreferrer">View on the App Store →</a></div><a href={appStoreUrl} target="_blank" rel="noreferrer" aria-label="Scan or open Yahtzee Hub on the App Store" className="app-qr"><QRCodeSVG value={appStoreUrl} size={116} bgColor="#ffffff" fgColor="#071012" level="M" marginSize={1} /></a></section>
  <div className="grid sm:grid-cols-2 gap-3">{modes.map((mode) => <section key={mode.name} className="web-panel p-4"><FontAwesomeIcon icon={mode.icon} className="text-neonCyan text-xl" /><h3 className="mt-3 text-neonYellow font-black">{mode.name}</h3><p className="mt-2 text-sm leading-6 text-mintGlow">{mode.copy}</p></section>)}</div>
  <section className="web-panel p-4 mt-5"><h3 className="text-electricPink font-black"><FontAwesomeIcon icon={faTrophy} className="mr-2" />Scoring and progress</h3><p className="mt-2 text-sm leading-6">Complete scorecards track all categories, totals and turns. Reach 63 in Ones–Sixes for the 35-point upper bonus.</p></section>
  <section className="web-panel p-4 mt-3"><h3 className="text-neonCyan font-black"><FontAwesomeIcon icon={faShieldHalved} className="mr-2" />Account and privacy</h3><p className="mt-2 text-sm leading-6">Your username is public; email, first name and surname remain private. Account controls include profile editing, password management and permanent deletion.</p></section>
  <nav className="flex flex-wrap gap-4 mt-6 text-neonCyan font-bold"><a href="/support.html">Support</a><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="/account-deletion.html">Delete account</a></nav>
</aside>;

export default About;
