export const stubEnv = (name: string, value: string) => {
  process.env[name] = value;
};
