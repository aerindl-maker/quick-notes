
import { Component } from '@angular/core';

import { ToastController } from '@ionic/angular';

import {
  FirebaseService,
  Note
} from '../../services/firebase.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false
})
export class Tab1Page {

  newNote: Note = {
    title: '',
    content: '',
    category: 'School'
  };

  toastOpen = false;
  toastMessage = '';

  constructor(
    private firebaseService: FirebaseService,
    private toastController: ToastController
  ) {}

  async addNote() {

    if (
      !this.newNote.title.trim() ||
      !this.newNote.content.trim()
    ) {

      await this.showToast(
        'Please fill in the title and content.'
      );

      return;

    }

    try {

      await this.firebaseService.addNote(this.newNote);

      this.newNote = {
        title: '',
        content: '',
        category: 'School'
      };

      await this.showToast('Note added successfully!');

    } catch (error) {

      console.error('Error adding note:', error);

      await this.showToast('Failed to add note.');

    }

  }

  async showToast(message: string) {

    const toast = await this.toastController.create({

      message: message,

      duration: 1800,

      position: 'bottom'

    });

    await toast.present();

  }

}