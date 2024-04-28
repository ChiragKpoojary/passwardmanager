import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
function App() {
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [passwordList, setPasswordList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const fetchPasswordList = async () => {
    axios
      .get("http://localhost:3001/showpasswords")
      .then((response) => {
        console.log(response.data);
        setPasswordList(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    setShowModal(false);
    fetchPasswordList();
  }, []);

  const addPassword = async (e) => {
    e.preventDefault();

    if(title === "" || password === "") return alert("Please fill all the fields" );

    axios
      .post("http://localhost:3001/addpassword", {
        password: password,
        title: title,
      })
      .then((response) => {
        console.log(response.data);
        fetchPasswordList();
      })
      .catch((err) => {
        console.log("Error : ", err);
      });
  };

  const decryptPassword = (encryption) => {
    console.log(encryption);
    axios
      .post("http://localhost:3001/decryptpassword", {
        title: encryption.title,
      })
      .then((response) => {
        console.log(response.data.password);
        setModalData({
          password: response.data.password,
          title: encryption.title,
        })
        setShowModal(true);
      })
      .catch((err) => {
        console.log("Error : ", err);
      });
  };

  return (
    <div className="App">
      <div className="AddingPassword">
        <input
          type="text"
          placeholder="Ex. password123"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Ex. Facebook"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <button onClick={addPassword}> Add Password</button>
      </div>

      {
        <div className="Passwords">
          {passwordList.map((val, key) => {
            return (
              <div
                className="password"
                onClick={() => {
                  decryptPassword({
                    password: val.password,
                    iv: val.iv,
                    id: val.id,
                    title: val.title,
                  });
                }}
                key={key}
              >
                <h3>{val.title}</h3>
              </div>
            );
          })}
        </div>
      }
      {showModal && (
        <div className="modal">
          <h1>{modalData.title || ""}</h1>
          <p>Password: {modalData.password || ""}</p>
          <button onClick={closeModal}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;
