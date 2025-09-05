import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'org-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent { }
