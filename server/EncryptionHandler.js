const crypto = require("crypto");
const secret = "pppppppppppppppppppppppppppppppp";

const encrypt = (password) => {
  const iv = Buffer.from(crypto.randomBytes(16));
  const cipher = crypto.createCipheriv("aes-256-ctr", Buffer.from(secret), iv);

  const encryptedPassword = Buffer.concat([
    cipher.update(password),
    cipher.final(),
  ]);

  return {
    iv: iv.toString("hex"),
    password: encryptedPassword.toString("hex"),
  };
};

const decrypt = (iv, password) => {
  const cipher = crypto.createDecipheriv(
    "aes-256-ctr",
    Buffer.from(secret),
    Buffer.from(iv, "hex")
  );

  let decryptedPassword = cipher.update(Buffer.from(password, "hex"));
  decryptedPassword += cipher.final();

  return decryptedPassword.toString("hex");
};

module.exports = { encrypt, decrypt };