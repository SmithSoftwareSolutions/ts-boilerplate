import { authActions, selectAuth } from '@org/angular/core';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  firstValueFrom,
  Observable,
} from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { isInStandaloneMode } from '@org/ts/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MainAppState } from '../../state/index.reducers';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import '@khmyznikov/pwa-install';

const unprotectedRoutes: string[] = [
  'login',
  'register',
  'forgot-password',
  'reset-password',
];

const hideLayoutRoutes: string[] = [
  'login',
  'register',
  'forgot-password',
  'reset-password',
];

interface SidenavItem {
  key: string;
  label: string;
  icon?: string;
  routerPath?: string;
  children?: SidenavItem[];
}

export const APP_VERSION = 'v0.0.0';

@Component({
  selector: 'org-main-app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './main-app-layout.component.html',
  styleUrl: './main-app-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainAppLayoutComponent {
  appVersion = APP_VERSION;

  @ViewChild('pwaInstallPrompt') pwaInstallPrompt!: ElementRef;

  sidenavIsOpen$: Observable<boolean | undefined>;
  hideLayout$ = new BehaviorSubject(false);
  sidenavItems: SidenavItem[] = [
    // {
    //   key: 'home',
    //   label: 'Home',
    //   icon: 'home',
    //   routerPath: '/',
    // },
    {
      key: 'user-notes',
      label: 'Notes',
      icon: 'view_list',
      routerPath: '/user-notes',
    },
  ];
  expandedItems$ = new BehaviorSubject<string[]>([]);

  constructor(
    private readonly store: Store<MainAppState>,
    private readonly router: Router,
    private readonly breakpointObserver: BreakpointObserver
  ) {
    this.sidenavIsOpen$ = this.store
      .select((s) => s.sidenavIsOpen)
      .pipe(takeUntilDestroyed());
    combineLatest([
      this.store.select((s) => selectAuth(s).user),
      this.router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed()
      ),
    ]).subscribe(([user, routeEvent]) => {
      const urlSlug = routeEvent.url.split('/')[1];
      if (hideLayoutRoutes.includes(urlSlug)) {
        this.hideLayout$.next(true);
      } else {
        this.hideLayout$.next(false);
      }

      if (!unprotectedRoutes.includes(urlSlug) && !user) {
        this.store.dispatch(
          authActions.setOriginalPath({ path: routeEvent.url })
        );
        this.router.navigate(['login']);
      }
    });
  }

  ngAfterViewInit() {
    const initiallyLoaded = localStorage.getItem('initiallyLoaded');
    if (initiallyLoaded != 'true') {
      // this.helpTooltip.show();
      this.showInstallPrompt();
      localStorage.setItem('initiallyLoaded', 'true');
    }
  }

  showInstallPrompt() {
    if (!isInStandaloneMode())
      (this.pwaInstallPrompt?.nativeElement as any).showDialog();
  }

  async toggleExpandedItem(sidenavItem: SidenavItem) {
    if (!sidenavItem.children) return;
    const expandedItems = await firstValueFrom(this.expandedItems$);
    if (expandedItems.includes(sidenavItem.key))
      this.expandedItems$.next([
        ...expandedItems.filter((i) => i != sidenavItem.key),
      ]);
    else this.expandedItems$.next([...expandedItems, sidenavItem.key]);
  }
}
