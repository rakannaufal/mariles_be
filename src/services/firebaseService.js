// BACKEND marilesBE:  src/services/firebaseService.js
const {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} = require("firebase/auth");
const { getDatabase, ref, set, get, push } = require("firebase/database");
const firebase = require("firebase/app");

const firebaseConfig = {
  apiKey: "AIzaSyCeGxY9MZnIACV8g-9vE3Zb1fbatKKKjoc",
  authDomain: "mariles.firebaseapp.com",
  databaseURL: "https://mariles-default-rtdb.firebaseio.com",
  projectId: "mariles",
  storageBucket: "mariles.appspot.com",
  messagingSenderId: "773629840415",
  appId: "1:773629840415:web:1249b75e77ea0d86d8592a",
};

firebase.initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();

const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const pelajarRef = ref(db, `pelajar/${user.uid}`);
    const snapshot = await get(pelajarRef);
    if (snapshot.exists()) {
      return {
        success: true,
        userData: snapshot.val(),
      };
    } else {
      return { success: false, message: "Data pelajar tidak ditemukan." };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const registerUser = async (username, email, password, phone, address) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;

    const counterRef = ref(db, "user_counter/");
    const counterSnapshot = await get(counterRef);
    let userIdCounter = 1;

    if (counterSnapshot.exists()) {
      userIdCounter = counterSnapshot.val() + 1;
    }

    await set(counterRef, userIdCounter);

    await set(ref(db, `pelajar/${userId}`), {
      user_id: userIdCounter,
      username,
      email,
      phone,
      address,
      role: "pelajar",
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const loginPengajar = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const pengajar = userCredential.user;

    const pengajarRef = ref(db, `pengajar/${pengajar.uid}`);
    const snapshot = await get(pengajarRef);
    if (snapshot.exists()) {
      return { success: true, username: snapshot.val().username };
    } else {
      return { success: false, message: "Data pengajar tidak ditemukan." };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const registerPengajar = async (username, email, password, phone, address) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const pengajarId = userCredential.user.uid;

    const counterRef = ref(db, "pengajar_counter/");
    const counterSnapshot = await get(counterRef);
    let pengajarIdCounter = 1;

    if (counterSnapshot.exists()) {
      pengajarIdCounter = counterSnapshot.val() + 1;
    }

    await set(counterRef, pengajarIdCounter);

    await set(ref(db, `pengajar/${pengajarId}`), {
      pengajar_id: pengajarIdCounter,
      username,
      email,
      phone,
      address,
      role: "pengajar",
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const saveForumQuestion = async (
  user_id,
  username,
  selectedTags,
  questionText
) => {
  try {
    const forumRef = ref(db, "forum");
    const newForumPostRef = push(forumRef);

    const forumData = {
      forum_id: newForumPostRef.key,
      user_id,
      username,
      tag: selectedTags,
      pertanyaan: questionText,
      created_at: Date.now(),
    };

    await set(newForumPostRef, forumData);
    return { success: true, message: "Pertanyaan berhasil disimpan!" };
  } catch (error) {
    return {
      success: false,
      message: `Gagal menyimpan pertanyaan: ${error.message}`,
    };
  }
};

const getForumQuestionsFromDB = async () => {
  const forumRef = ref(db, "forum");
  try {
    const snapshot = await get(forumRef);
    if (snapshot.exists()) {
      return snapshot.val(); // Mengembalikan data forum yang ditemukan
    } else {
      return []; // Jika tidak ada data, kembalikan array kosong
    }
  } catch (error) {
    console.error("Error fetching forum questions:", error);
    throw new Error(
      "Gagal mengambil data forum. Periksa aturan keamanan Firebase."
    );
  }
};

module.exports = {
  saveForumQuestion,
  loginUser,
  registerUser,
  loginPengajar,
  registerPengajar,
  getForumQuestionsFromDB, // Export the new function
};
