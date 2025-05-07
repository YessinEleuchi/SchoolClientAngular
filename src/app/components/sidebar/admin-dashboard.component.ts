import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  isCollapsed = false;
  isMobile = window.innerWidth < 640; // Adjusted for smaller screens (sm breakpoint)
  isTablet = window.innerWidth >= 640 && window.innerWidth < 1024; // Tablet range (sm to lg)

  constructor(private authService: AuthService) {
    this.updateSidebarState();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile = window.innerWidth < 640;
    this.isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
    this.updateSidebarState();
  }

  updateSidebarState(): void {
    if (this.isMobile) {
      this.isCollapsed = true; // Always collapse on mobile
    } else if (this.isTablet) {
      this.isCollapsed = false; // Expand on tablets by default
    } else {
      this.isCollapsed = false; // Expand on desktop
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }
}
