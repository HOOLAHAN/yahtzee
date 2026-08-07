export const sharedAppAchievementKey = 'yahtzee-shared-app-achievement';
export const recordSharedApp = () => localStorage.setItem(sharedAppAchievementKey, 'true');
export const hasSharedApp = () => localStorage.getItem(sharedAppAchievementKey) === 'true';
