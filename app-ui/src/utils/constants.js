export const categoryColors = {
  work: 'bg-(--card-light-orange)',
  play: 'bg-(--card-soft-blue)',
  study: 'bg-(--card-light-red)',
  exercise: 'bg-(--card-lime-green)',
  social: 'bg-(--card-violet)',
  'self-care': 'bg-(--card-soft-yellow)',
};

export const timeframes = ['daily', 'weekly', 'monthly'];

export const previousLabels = {
  daily: 'Yesterday',
  weekly: 'Last Week',
  monthly: 'Last Month',
};

export const redirectToHome = (navigate) => {
  navigate('/home');
};

export const redirectToLogin = (navigate) => {
  navigate('/');
};
