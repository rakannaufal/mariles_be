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
      return { success: true, userData: snapshot.val() };
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
      return { success: true, pengajarData: snapshot.val() };
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

const saveForumAnswer = async (forum_id, user_id, username, answerText) => {
  try {
    const forumAnswerRef = ref(db, "answer");
    const newForumAnswerPostRef = push(forumAnswerRef);

    const forumData = {
      answer_id: newForumAnswerPostRef.key,
      forum_id,
      user_id,
      username,
      answer: answerText,
      created_at: Date.now(),
    };

    await set(newForumAnswerPostRef, forumData);
    return { success: true, message: "Jawaban berhasil disimpan!" };
  } catch (error) {
    return {
      success: false,
      message: `Gagal menyimpan Jawaban: ${error.message}`,
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

const getForumAnswersFromDB = async (forumId) => {
  const forumAnswerRef = ref(db, "answer");
  try {
    const snapshot = await get(forumAnswerRef);
    if (snapshot.exists()) {
      const answers = snapshot.val();
      return Object.values(answers).filter(
        (answer) => answer.forum_id === forumId
      );
    } else {
      return [];
    }
  } catch (error) {
    throw new Error("Error fetching forum answers.");
  }
};
const deleteForumQuestionFromDB = async (forumId, userId) => {
  const forumRef = ref(db, `forum/${forumId}`);
  try {
    const snapshot = await get(forumRef);
    if (!snapshot.exists()) {
      return { success: false, message: "Forum question not found." };
    }

    const forumData = snapshot.val();
    if (forumData.user_id !== userId) {
      return {
        success: false,
        message: "You are not authorized to delete this question.",
      };
    }

    await set(forumRef, null);
    return { success: true, message: "Question deleted successfully." };
  } catch (error) {
    console.error("Failed to delete forum question:", error);
    return { success: false, message: `Error: ${error.message}` };
  }
};

const saveMessageFromDB = async (user_id, nameText, emailText, messageText) => {
  try {
    const contactRef = ref(db, "contact");
    const newContactPostRef = push(contactRef);

    const contactData = {
      contact_id: newContactPostRef.key,
      user_id,
      name: nameText,
      email: emailText,
      message: messageText,
      created_at: Date.now(),
    };

    await set(newContactPostRef, contactData);
    return { success: true, message: "Pesan berhasil disimpan!" };
  } catch (error) {
    return {
      success: false,
      message: `Gagal menyimpan Pesan: ${error.message}`,
    };
  }
};
const saveInfoLes = async (data) => {
  try {
    const infoLesRef = ref(db, "informasiles");
    const newInfoLesPostRef = push(infoLesRef);

    const infoLesData = {
      ...data,
      les_id: newInfoLesPostRef.key,
      created_at: Date.now(),
    };

    await set(newInfoLesPostRef, infoLesData);
    return { success: true, message: "Data Informasi Les berhasil disimpan!" };
  } catch (error) {
    return {
      success: false,
      message: `Gagal menyimpan Data Informasi Les: ${error.message}`,
    };
  }
};

module.exports = {
  saveInfoLes,
  saveMessageFromDB,
  saveForumQuestion,
  saveForumAnswer,
  loginUser,
  registerUser,
  loginPengajar,
  registerPengajar,
  getForumAnswersFromDB,
  getForumQuestionsFromDB,
  deleteForumQuestionFromDB,
};
