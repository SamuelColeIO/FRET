import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LogoutService } from './../../../../services/logout.service';

@Component({
	selector: 'navbar',
	styleUrls: ['/navbar.component.scss'],
	template: `
  <div class="m-grid__item m-header clearfix" data-minimize-offset="200" data-minimize-mobile-offset="200">
	<div class="m-container m-container--fluid m-container--full-height">
		<div class="m-stack m-stack--ver m-stack--desktop">
			<div class="m-stack__item m-brand  m-brand--skin-dark fret-navbar__title-container">
				<div class="m-stack m-stack--ver m-stack--general">
					<div class="m-stack__item m-stack__item--middle m-brand__logo">
            <a [routerLink]="['/dashboard']" class="fret-navbar__title">
              FRET
						</a>
					</div>
					<div class="m-stack__item m-stack__item--middle m-brand__tools">
					</div>
				</div>
			</div>
			<div class="m-stack__item m-stack__item--fluid m-header-head" id="m_header_nav" style="background-color:#FFFFFF">
				<button class="m-aside-header-menu-mobile-close  m-aside-header-menu-mobile-close--skin-dark " id="m_aside_header_menu_mobile_close_btn">
					<i class="la la-close"></i>
				</button>
        <div
          id="m_header_menu"
          class="m-header-menu m-aside-header-menu-mobile m-aside-header-menu-mobile--offcanvas  m-header-menu--skin-light m-header-menu--submenu-skin-light m-aside-header-menu-mobile--skin-dark m-aside-header-menu-mobile--submenu-skin-dark fret-navbar__menu">
					<ul class="m-menu__nav  m-menu__nav--submenu-arrow ">
						<li class="m-menu__item  m-menu__item--submenu m-menu__item--rel" data-menu-submenu-toggle="click" data-redirect="true" aria-haspopup="true">
							<button
								[disabled]="logoutLoading"
								(click)="logout()"
								[ngClass]="{'m-loader m-loader--right m-loader--primary': logoutLoading}"
								id="m_login_signin_submit"
								class="btn btn-secondary m-btn m-btn--pill">
								Logout
							</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
  </div>
</div>
<div class="fret-navbar__helper"></div>
`
})
export class NavbarComponent {
	constructor(private LogoutService: LogoutService, private router: Router, private window: Window) { }

	@Input()
	toggleLoader;

	logoutLoading = false;

	logout() {
		this.logoutLoading = true;
		this.LogoutService.submitLogout()
			.subscribe(() => {
				this.logoutLoading = false;
				let window: any = this.window;
				window.currentUser = null;
				this.router.navigate(['/login/']);
			});
	}
}