const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const PORT = 3001;
const bcrypt = require("bcryptjs");

const { encrypt, decrypt } = require("./EncryptionHandler");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "chirag",
  host: "localhost",
  password: "chirag_123",
  database: "passwardmanager",
});

app.post("/addpassword", (req, res) => {
  const { password, title } = req.body;
  // const hashedPassword = encrypt(password);
  db.query(
    "INSERT INTO passwords (password, title, iv) VALUES (?,?,?)",
    [hashedPassword.password, title, hashedPassword.iv],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Success");
      }
    }
  );
});

app.get("/showpasswords", (req, res) => {
  db.query("SELECT * FROM passwords;", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/decryptpassword", (req, res) => {
  res.send(decrypt(req.body));
});

app.post("/temp", async(req, res) => {
  const bcrypt = require("bcryptjs");

  // Password to hash
  const password = "password123";
  let hashed = ""

  // Generate salt and hash
  const ha = await bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      // Store hash in your password DB.
      console.log("Hashed password:", hash);
      hashed = hash;
    })
  });

  console.log("ha" , ha);

  const userInputPassword = "password123";

  // Compare the user's password input with the hash
  bcrypt.compare(
    userInputPassword,
    "$2a$10$fj.SZxji/gG.YeZVBl6mEu5GewPoKlUSJW2SzRHOcnGHGQsdrt1KK",
    function (err, result) {
      if (result) {
        console.log("Password is correct");
      } else {
        console.log("Password is incorrect");
      }
    }
  );

  res.send("done");
});

app.listen(PORT, () => {
  db.connect(
    () => {
      console.log("connection established");
    },
    (err) => {
      console.log("error : ", err);
    }
  );
  console.log("Server is running");
});
