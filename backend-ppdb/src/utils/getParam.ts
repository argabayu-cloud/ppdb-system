export const getParam = (param: string | string[], fieldName = "param") => {
  if (Array.isArray(param)) {
    throw new Error(`${fieldName} tidak valid`);
  }

  if (!param) {
    throw new Error(`${fieldName} wajib diisi`);
  }

  return param;
};