import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { STRINGS } from '../shared/strings';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  strings = STRINGS.home;
  navigationStrings = STRINGS.navigation;
  sharedStrings = STRINGS.shared;
}
