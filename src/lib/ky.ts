//scr/lib/ky.ts
// fetch wrapper

import ky from "ky";

const keyInstance = ky.create({
  parseJson: (text) =>
    JSON.parse(text, (key, value) => {
      if (key.endsWith("At")) return new Date(value);
      return value;
    }),
});

export default keyInstance;
