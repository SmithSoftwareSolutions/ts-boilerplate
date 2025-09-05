import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'org-design-system-preview-view',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './design-system-preview-view.component.html',
  styleUrl: './design-system-preview-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignSystemPreviewViewComponent {
  doSomething() {
    console.log('Do something.');
  }
  logEvent(event: Event) {
    console.log('EVENT', event);
  }
}
