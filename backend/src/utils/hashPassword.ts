export const hash = (password: string, username: string) => {
  let passwordData = Array.from(password).map((c) => c.charCodeAt(0));
  let usernameData = Array.from(username).map((c) => c.charCodeAt(0));

  let data = [...passwordData, ...usernameData];

  let hash1 = 0;
  let hash2 = 0;
  let hash3 = 0;
  let hash4 = 0;

  for (let i = 0; i < data.length; i++) {
    hash1 ^= data[i] + 0x9e2479b9 + (hash1 << 6) + (hash1 >> 8);
    hash2 ^= data[i] + 0x1e31739b9 + (hash2 << 12) + (hash2 >> 4);
    hash3 ^= data[i] + 0x5e5279b9 + (hash3 << 2) + (hash3 >> 9);
    hash4 ^= data[i] + 0x43e334b9 + (hash4 << 1) + (hash4 >> 2);
  }

  return (
    (hash1 >>> 0).toString(16) +
    "-" +
    (hash2 >>> 0).toString(16) +
    "-" +
    (hash3 >>> 0).toString(16) +
    "-" +
    (hash4 >>> 0).toString(16)
  );
};
