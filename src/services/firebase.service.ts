
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';

import { initializeApp } from 'firebase/app';

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  CollectionReference,
  DocumentData
} from 'firebase/firestore';

export interface Note {
  id?: string;
  title: string;
  content: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private app = initializeApp(environment.firebaseConfig);

  private db = getFirestore(this.app);

  private notesCollection: CollectionReference<DocumentData> =
    collection(this.db, 'notes');

  async addNote(note: Note) {

    return await addDoc(this.notesCollection, {
      title: note.title,
      content: note.content,
      category: note.category
    });

  }

  listenToNotes(
    callback: (notes: Note[]) => void
  ) {

    return onSnapshot(this.notesCollection, snapshot => {

      const notes: Note[] = snapshot.docs.map(item => ({
        id: item.id,
        ...(item.data() as Omit<Note, 'id'>)
      }));

      callback(notes);

    });

  }

  async updateNote(note: Note) {

    if (!note.id) {
      throw new Error('Note ID is required.');
    }

    const noteRef = doc(this.db, 'notes', note.id);

    return await updateDoc(noteRef, {
      title: note.title,
      content: note.content,
      category: note.category
    });

  }

  async deleteNote(noteId: string) {

    const noteRef = doc(this.db, 'notes', noteId);

    return await deleteDoc(noteRef);

  }

}