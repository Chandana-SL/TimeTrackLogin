import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'TimeTrack';
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private destroy$ = new Subject<void>();
  private lastUrl: string = '';

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Track navigation and prevent back to signin for logged-in users
      this.router.events
        .pipe(
          filter(event => event instanceof NavigationEnd),
          takeUntil(this.destroy$)
        )
        .subscribe((event: any) => {
          const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
          const unauthenticatedRoutes = ['/', '/signin', '/signup'];

          if (isLoggedIn && unauthenticatedRoutes.includes(event.urlAfterRedirects)) {
            // Redirect to dashboard if trying to access unauthenticated routes while logged in
            const userSession = localStorage.getItem('user_session');
            if (userSession) {
              const user = JSON.parse(userSession);
              const role = user.role?.toLowerCase();

              if (role === 'admin') {
                this.router.navigate(['/admin/users'], { replaceUrl: true });
              } else if (role === 'manager') {
                this.router.navigate(['/manager/team-logs'], { replaceUrl: true });
              } else if (role === 'employee') {
                this.router.navigate(['/employee/loghours'], { replaceUrl: true });
              }
            }
          } else {
            this.lastUrl = event.urlAfterRedirects;
          }
        });

      // Prevent browser back button when logged in
      history.pushState(null, '', window.location.href);

      window.addEventListener('popstate', (event: PopStateEvent) => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (isLoggedIn) {
          // If user is logged in, prevent going back
          history.pushState(null, '', window.location.href);
          // Optionally navigate to dashboard instead
          // const user = JSON.parse(localStorage.getItem('user_session') || '{}');
          // if (user.role) {
          //   this.router.navigate([this.getDashboardRoute(user.role)]);
          // }
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

