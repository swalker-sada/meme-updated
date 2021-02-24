import firebase from "../firebase.config";

const database = firebase.ref("/likes");

class MemeLikesService {
  getAll() {
    return database;
  }

  create(meme) {
    return database.push(meme);
  }

  update(key, value) {
    return database.child(key).update(value);
  }

  delete(key) {
    return database.child(key).remove();
  }

  deleteAll() {
    return database.remove();
  }
}

export default new MemeLikesService();
