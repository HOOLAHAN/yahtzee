import { fetchAuthSession } from 'aws-amplify/auth';
import { client } from '../lib/amplifyClient';

export const lifecycleConsentVersion = '2026-09-21';
export interface LifecycleEmailPreference {
  enabled: boolean;
  consentedAt?: string | null;
  consentVersion?: string | null;
  consentSource?: 'WEB' | 'IOS' | 'ANDROID' | null;
  unsubscribedAt?: string | null;
  firstWebSeenAt?: string | null;
  lastWebSeenAt?: string | null;
  firstMobileSeenAt?: string | null;
  lastMobileSeenAt?: string | null;
}

const fields = 'enabled consentedAt consentVersion consentSource unsubscribedAt firstWebSeenAt lastWebSeenAt firstMobileSeenAt lastMobileSeenAt';

async function authenticatedGraphql(query: string, variables?: Record<string, unknown>) {
  const session = await fetchAuthSession();
  const authToken = session.tokens?.idToken?.toString();
  if (!authToken) throw new Error('Sign in required.');
  const result = await (client as any).graphql({ query, variables, authMode: 'userPool', authToken });
  if (result.errors?.length) throw new Error(result.errors.map((error: { message?: string }) => error.message).filter(Boolean).join('\n') || 'Email preference request failed.');
  return result.data;
}

export async function getLifecycleEmailPreference(): Promise<LifecycleEmailPreference> {
  const data = await authenticatedGraphql(`query MyLifecycleEmailPreference { myLifecycleEmailPreference { ${fields} } }`);
  return data.myLifecycleEmailPreference;
}

export async function updateLifecycleEmailPreference(enabled: boolean): Promise<LifecycleEmailPreference> {
  const data = await authenticatedGraphql(`mutation LifecycleEmailPreference($enabled:Boolean!,$consentVersion:String!,$source:ClientPlatform!){updateMyLifecycleEmailPreference(enabled:$enabled,consentVersion:$consentVersion,source:$source){${fields}}}`, { enabled, consentVersion: lifecycleConsentVersion, source: 'WEB' });
  return data.updateMyLifecycleEmailPreference;
}

export async function recordWebActivity(): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const key = 'yahtzee.lifecycle.web-activity-date';
  if (localStorage.getItem(key) === today) return;
  await authenticatedGraphql(`mutation RecordClientActivity($platform:ClientPlatform!){recordClientActivity(platform:$platform){enabled}}`, { platform: 'WEB' });
  localStorage.setItem(key, today);
}

const pendingKey = (email: string) => `yahtzee.lifecycle.pending-consent.${email.trim().toLowerCase()}`;
export function rememberPendingLifecycleConsent(email: string, enabled: boolean) {
  if (enabled) localStorage.setItem(pendingKey(email), lifecycleConsentVersion);
  else localStorage.removeItem(pendingKey(email));
}
export async function applyPendingLifecycleConsent(email: string) {
  const key = pendingKey(email);
  if (!localStorage.getItem(key)) return;
  await updateLifecycleEmailPreference(true);
  localStorage.removeItem(key);
}
export async function deleteLifecycleEmailData() {
  await authenticatedGraphql('mutation DeleteMyLifecycleEmailData { deleteMyLifecycleEmailData }');
}
