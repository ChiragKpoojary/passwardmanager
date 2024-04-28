const express = require("express");
const app = express();
const mysql = require("mysql");
// const { Client } = require("pg");
const cors = require("cors");
const PORT = 3001;

const { encrypt, decrypt } = require("./EncryptionHandler");

app.use(cors());
app.use(express.json());

const db = new Client({
  user: "pratham",
  host: "localhost",
  password: "112818",
  database: "passwardmanager",
});

app.post("/addpassword", (req, res) => {
  const { password, title } = req.body;

  db.query(
    `SELECT * FROM passwords WHERE title = '${title}'`,
    (err, result) => {
      if (err) {
        res.send(
          { message: "Error while searching for data in database", error: err },
          500
        );
      } else {
        if (result.rowCount > 0) {
          res.send({ message: "Password already exists" }, 226);
        } else {
          const hashedPassword = encrypt(password);
          console.log(hashedPassword);
          db.query(
            // "INSERT INTO passwords (password, title, iv) VALUES (?,?,?)",
            // [hashedPassword.password, title, hashedPassword.iv],
            `INSERT INTO passwords (password, title, iv) VALUES ('${hashedPassword.password}', '${title}', '${hashedPassword.iv}');`,
            (e, resu) => {
              if (err) {
                res.send({ message: "Error while inserting data" }, 500);
              } else {
                res.send({ message: "data inserted successfully" }, 200);
              }
            }
          );
        }
      }
    }
  );
});

app.get("/showpasswords", (req, res) => {
  db.query("SELECT id , title FROM passwords;", (err, result) => {
    if (err) {
      res.send(
        { message: "Error while searching for data in database", error: err },
        500
      );
    } else {
      res.send(
        {
          message: "data fetched successfully",
          count: result.rowCount,
          data: result.rows,
        },
        200
      );
    }
  });
});

app.post("/decryptpassword", (req, res) => {
  db.query(
    `SELECT * FROM passwords WHERE title = '${req.body.title}'`,
    (err, result) => {
      if (err) {
        res.send(
          { message: "Error while searching for data in database", error: err },
          500
        );
      } else {
        if (result.rowCount > 0) {
          const decryptedPassword = decrypt(result.rows[0].iv, result.rows[0].password);
          res.send({ message: "Password decrypted", password: decryptedPassword },200);
        } else {
          res.send({ message: "Password not found" }, 404);
        }
      }
    }
  );
});

// app.post("/temp", async (req, res) => {
//   const bcrypt = require("bcryptjs");

//   // Password to hash
//   const password = "password123";
//   let hashed = "";

//   // Generate salt and hash
//   const ha = await bcrypt.genSalt(10, function (err, salt) {
//     bcrypt.hash(password, salt, function (err, hash) {
//       // Store hash in your password DB.
//       console.log("Hashed password:", hash);
//       hashed = hash;
//     });
//   });

//   console.log("ha", ha);

//   const userInputPassword = "password123";

//   // Compare the user's password input with the hash
//   bcrypt.compare(
//     userInputPassword,
//     "$2a$10$fj.SZxji/gG.YeZVBl6mEu5GewPoKlUSJW2SzRHOcnGHGQsdrt1KK",
//     function (err, result) {
//       if (result) {
//         console.log("Password is correct");
//       } else {
//         console.log("Password is incorrect");
//       }
//     }
//   );

//   res.send("done");
// });

app.listen(PORT, () => {
  db.connect(
    () => {
      console.log("connection established");

      const createTableQuery = `CREATE TABLE IF NOT EXISTS passwords(
        id SERIAL,title varchar(255) UNIQUE NOT NULL,
        password varchar(255),
        iv varchar(255),PRIMARY KEY(id)
      );
      `;

      db.query(createTableQuery, function (err, results, fields) {
        if (err) {
          console.log("Error creating table: ", err);
        } else {
          console.log("Table created or already exists");
        }
      });
    },
    (err) => {
      console.log("error : ", err);
    }
  );
  console.log("Server is running at port : ", PORT);
});
