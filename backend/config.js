export const config = {
  secret: 'secretKey',
  tokens: {
    access: {
      type: 'access',
      expiresIn: '2m',
    },
    refresh: {
      type: 'refresh',
      expiresIn: '3m',
    },
  },
};
