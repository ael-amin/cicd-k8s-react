import { useAuth } from '../context/AuthContext';
import { FEATURES, ROLE_ACCESS } from '../config/features';

export const useFeatures = () => {
  const { user } = useAuth();
  const role = user?.role || 'user';

  const isFeatureEnabled = (featureKey) => {
    if (!FEATURES[featureKey]) return false;
    return ROLE_ACCESS[role].features.includes(featureKey);
  };

  const getAccessibleRoutes = () => {
    return ROLE_ACCESS[role].routes;
  };

  const getNavigationItems = () => {
    const baseItems = ROLE_ACCESS[role].features;
    return baseItems.filter(item => !item.feature || isFeatureEnabled(item.feature));
  };

  return {
    isFeatureEnabled,
    getAccessibleRoutes,
    getNavigationItems
  };
};